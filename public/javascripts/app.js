
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

jQuery.extend( jQuery.easing,
  {
  	easeInOutQuad: function (x, t, b, c, d) {
  		if ((t/=d/2) < 1) return c/2*t*t + b;
  		return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  	easeInBounce: function (x, t, b, c, d) {
  		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  	easeOutBounce: function (x, t, b, c, d) {
  		if ((t/=d) < (1/2.75)) {
  			return c*(7.5625*t*t) + b;
  		} else if (t < (2/2.75)) {
  			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  		} else if (t < (2.5/2.75)) {
  			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  		} else {
  			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  		}
  	},
  	easeInOutBounce: function (x, t, b, c, d) {
  		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
  		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  	}
});

$(function() {
  setInterval(function(){
    $('#console .obake').animate({top:'50px'},1000,'easeInOutQuad',function(){
      $('#console .obake').animate({top:'30px'},1000,'easeInOutQuad')
   });
  }, 2000);
  setInterval(function(){
    $('#console div.minikun').animate({top:'20px'},800,'easeInOutQuad',function(){
      $('#console div.minikun').animate({top:'0px'},800,'easeInOutQuad')
   });
  }, 1600);
  setInterval(function(){
    $('#console div.akumakun').animate({top:'-100px'},1000,'easeInOutQuad',function(){
      $('#console div.akumakun').animate({top:'0px'},500,'easeOutBounce')
   });
  }, 2000);
});
$(window).load(function(){
  $('#secret .back_to_top').animate({top:0},1000,'easeOutBounce');
});