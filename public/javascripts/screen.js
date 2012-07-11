// (function() {

var socket = io.connect()
  , screen = socket.of(location.pathname);

$(function() {
  var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d');
    
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.className = 'deadee-sepia';
  
  screen.on('image', function(type, base64) {
    var image = new Image();
    image.onload = function(e) {
      var ratio = canvas.width / image.width
        , width = image.width * ratio
        , height = image.height * ratio;
      
      ctx.drawImage(image, 0, ~~(canvas.height / 2 - height / 2), ~~width, ~~width);
    };
    image.src = 'data:' + type + ';base64,' + base64;
  });
  
  document.body.appendChild(canvas);
});

// })();