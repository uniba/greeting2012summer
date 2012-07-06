
var socket = require('socket.io')
  , request = require('request');

module.exports = function(app) {
  var io = socket.listen(app)
    , small = io.of('/screen/small')
    , large = io.of('/screen/large');

  io.configure(function() {
    // TODO:
  });
  
  app.on('twitterLogin', function(data) {
    request({ url: data.profile_image_url, encoding: 'binary' }, function(err, res, body) {
      io.sockets.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
      small.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
      large.emit('image', 'image/png', new Buffer(body, 'binary').toString('base64'));
    })
  });
  
  app.on('facebookLogin', function(data) {
    
  });
  
  small.on('connection', function(client) {
    
  });

  large.on('connection', function(client) {
    
  });
  
  return io;
};
