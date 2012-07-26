
var socket = io.connect()
  , cursor = io.connect('/cursor');

$(function() {
  $(document.body).on('keypress', function(e) {
    console.log(e);    
    switch (e.keyCode) {
      case 'b'.charCodeAt(0):
        socket.emit('back', 100);
        break;
      case 'f'.charCodeAt(0):
        socket.emit('forward', 100);
        break;
      case 'r'.charCodeAt(0):
        socket.emit('reset');
        break;
    }
  });
});

$(function() {
  var audio = new Audio();
  audio.src = '/assets/music.mp3';
  audio.loop = true;
  audio.play();
});

$(function() {
  var spirits = {}
    , windowWidth = $(window).width()
    , windowHeight = $(window).height();

  $(window).on('resize', function() {
    windowWidth = $(this).width();
    windowHeight = $(this).height();
  });
  
  function createSpirit(data) {
    var container = document.createElement('div')
      , img = document.createElement('img')
      , avatar = document.createElement('img');
    
    $(container).addClass('spirits');
    $(img).hide().attr('src', '/images/fire_anime.gif');
    
    if (data) {
      avatar.src = 'data:image/png;base64,' + data;
      $(avatar).addClass('avatar');
      container.appendChild(avatar);
    }
    
    container.appendChild(img);
    document.body.appendChild(container);
    
    $(img).fadeIn();
    
    return container;
  }

  socket.on('connection', function() {
    
  });

  $(document).on('mousemove', function(e) { 
    cursor.emit('moveSpirit', e.clientX / windowWidth, e.pageY);
  });
  
  cursor.on('numberOfConnection', function(n) {
    $('.number-of-connection').text(n);
  });
  
  cursor.on('createSpirit', function(id, data) {
    var img = createSpirit(data);
    spirits[id] = img;
  });
  
  cursor.on('moveSpirit', function(id, x, y) {
    if (!spirits[id]) {
      spirits[id] = createSpirit();
    }
    spirits[id].style.display = 'block';
    spirits[id].style.left = (x * windowWidth) + 'px';
    spirits[id].style.top = y + 'px';
  });
  
  cursor.on('removeSpirit', function(id) {
    $(spirits[id])
      .fadeOut()
      .promise()
      .done(function() {
        document.body.removeChild(spirits[id]);
        delete spirits[id];
      });
  });
});

$(function() {
  setInterval(function(){
    $('.obake').animate({bottom:'20px'},1000,function(){
      $('.obake').animate({bottom:0},1000)
   })
  }, 1000)
});