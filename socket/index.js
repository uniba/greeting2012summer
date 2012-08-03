
var inspect = require('util').inspect
  , connect = require('connect')
  , socket = require('socket.io')
  , parseCookie = connect.utils.parseCookie
  , Rail = require('../lib/rail')
  , rail = new Rail()
  , Session = connect.middleware.session.Session;

module.exports = function(app) {
  var io = socket.listen(app)
    , sessionStore = app.settings['session store']
    , clients = {}
    , cursor = io.of('/cursor')
    , small = io.of('/screen/small')
    , large = io.of('/screen/large');
    
  io.configure(function() {
    io.set('authorization', function(data, callback) {
      if (data.headers.cookie) {
        var cookie = data.headers.cookie
          , sessId = parseCookie(cookie)['connect.sid'];
        
        sessionStore.load(sessId, function(err, sess) {
          if (err) return callback(err, false);
          data.session = new Session(data, sess);
          callback(null, true);
        });
      } else {
        callback(null, false);
      }
    });
  });
  
  io.sockets.on('connection', function(client) {
    client.on('forward', function(val) {
      rail.forward(val);
    });
    
    client.on('back', function(val) {
      rail.back(val);
    });
    
    client.on('right', function(val) {
      rail.right(val);
    });
    
    client.on('left', function(val) {
      rail.left(val);
    });
    
    client.on('reset', function() {
      rail.reset();
    });
  });
  
  app.on('twitterLogin', function(session) {
    small.emit('image', 'image/png', session.avatar);
    large.emit('image', 'image/png', session.avatar);
  });
  
  app.on('facebookLogin', function(session) {
    small.emit('image', 'image/jpg', session.avatar);
    large.emit('image', 'image/jpg', session.avatar);
  });
  
  cursor.on('connection', function(client) {
    var handshake = client.handshake
      , avatar = handshake.session.avatar;
    
    client.broadcast.emit('createSpirit', client.id, avatar);
    
    Object.keys(clients).forEach(function(key, i) {
      var c = clients[key]
        , id = c.client.id
        , session = c.handshake.session;
      
      client.emit('createSpirit', id, session.avatar);
    });
    
    clients[client.id] = { client: client, handshake: client.handshake };
    cursor.emit('numberOfConnection', Object.keys(cursor.sockets).length);
    
    client.on('disconnect', function() {
      client.broadcast.emit('removeSpirit', client.id);
      cursor.emit('numberOfConnection', Object.keys(cursor.sockets).length);
      delete clients[client.id];
    });
    
    client.on('moveSpirit', function(x, y) {
      client.broadcast.volatile.emit('moveSpirit', client.id, x, y);
    });
  });
    
  small.on('connection', function(client) {
    
  });

  large.on('connection', function(client) {
    
  });
  
  return io;
};
