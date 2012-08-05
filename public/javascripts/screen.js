// (function() {

var socket = io.connect()
  , screen = socket.of(location.pathname)
  , frame = document.createElement('img');

$.holdReady(true);

frame.onload = function() {
  $.holdReady(false);
}

frame.src = '/images/deadee_frame.png';

$(function() {
  var canvas = document.createElement('canvas')
    , ctx = canvas.getContext('2d');
    
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.className = 'deadee-sepia';
  
  frame.width = window.innerWidth;
  frame.height = window.innerHeight;
  
  screen.on('image', function(type, base64) {
    var image = new Image();
    image.onload = function(e) {
      var ratio = canvas.width / image.width
        , width = image.width * ratio
        , height = image.height * ratio;
      $(canvas).animate({ opacity: 0 }, function() {
        ctx.drawImage(image, 0, ~~(canvas.height / 2 - height / 2), ~~width, ~~height);
        ctx.drawImage(frame, 0, 0, canvas.width, canvas.height)
        $(canvas).animate({ opacity: 1 });
      });
    };
    image.src = 'data:' + type + ';base64,' + base64;
  });
  
  document.body.appendChild(canvas);
});

// })();