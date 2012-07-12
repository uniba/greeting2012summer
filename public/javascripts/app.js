
var socket = io.connect();

$(function() {
  
  var spirits = {}
    , windowWidth = $(window).width()
    , windowHeight = $(window).height();

  $(window).on('resize', function() {
    windowWidth = $(this).width();
    windowHeight = $(this).height();
  });
  
  function createSpirit() {
    var img = document.createElement('img');
    img.src = '/images/fire_anime.gif';
    img.style.display = 'none';
    img.style.position = 'absolute';
    img.style.zIndex = 10000;
    img.className = 'spirits';
    document.body.appendChild(img);
    
    return img;
  }

  $(document).on('mousemove', function(e) { 
    socket.emit('moveSpirit', e.clientX / windowWidth, e.pageY);
  });
  
  socket.on('connection', function() {
  });
  
  socket.on('numberOfConnection', function(n) {
    $('.number-of-connection').text(n);
  });
  
  socket.on('createSpirit', function(id) {
    var img = createSpirit();
    spirits[id] = img;
  });
  
  socket.on('moveSpirit', function(id, x, y) {
    if (!spirits[id]) {
      spirits[id] = createSpirit();
    }
    spirits[id].style.display = 'block';
    spirits[id].style.left = (x * windowWidth) + 'px';
    spirits[id].style.top = y + 'px';
  });
  
  socket.on('removeSpirit', function(id) {
    document.body.removeChild(spirits[id]);
    delete spirits[id];
  });
});