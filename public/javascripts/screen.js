// (function() {

var socket = io.connect()
  , screen = socket.of(location.pathname);

$(function() {
  var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d');
    
  canvas.width = 480;
  canvas.height = 320;
  
  screen.on('image', function(type, base64) {
    var image = new Image();
    image.onload = function(e) {
      ctx.drawImage(image, Math.random() * canvas.width, Math.random() * canvas.height, 128, 128);
    };
    image.src = 'data:' + type + ';base64,' + base64;
  });
  
  document.body.appendChild(canvas);
});

// })();