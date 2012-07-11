
var socket = io.connect();

$(function() {
  
  var spirits = {};

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
    socket.emit('moveSpirit', e.clientX, e.clientY);
  });
  
  socket.on('connection', function() {
  });
  
  socket.on('createSpirit', function(id) {
    var img = createSpirit();
    spirits[id] = img;
  });
  
  socket.on('moveSpirit', function(id, x, y) {
    console.log(arguments);
    
    if (!spirits[id]) {
      spirits[id] = createSpirit();
    }
    spirits[id].style.display = 'block';
    spirits[id].style.left = x + 'px';
    spirits[id].style.top = y + 'px';
  });
  
  socket.on('removeSpirit', function(id) {
    document.body.removeChild(spirits[id]);
    delete spirits[id];
  });
});