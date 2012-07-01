
var socket = require('socket.io');

module.exports = function(app) {
  var io = socket.listen(app);

  io.configure(function() {
    // TODO:
  });

  return io;
};
