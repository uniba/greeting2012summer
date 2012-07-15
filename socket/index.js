
var inspect = require('util').inspect
  , connect = require('connect')
  , socket = require('socket.io')
  , parseCookie = connect.utils.parseCookie
  , Session = connect.middleware.session.Session;

module.exports = function(app) {
  var io = socket.listen(app)
    , sessionStore = app.settings['session store']
    , clients = []
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
  
  app.on('twitterLogin', function(session) {
    var base64 = session.avatar.toString('base64');
    
    small.emit('image', 'image/png', base64);
    large.emit('image', 'image/png', base64);
  });
  
  app.on('facebookLogin', function(data) {
    var base64 = session.avatar.toString('base64');
    
    small.emit('image', 'image/jpg', base64);
    large.emit('image', 'image/jpg', base64);
  });
  
  cursor.on('connection', function(client) {
    var handshake = client.handshake
      , avatar = handshake.session.avatar
      , base64 = null;
    
    if (avatar) base64 = new Buffer(avatar, 'binary').toString('base64');
    client.broadcast.emit('createSpirit', client.id, base64);
    
    clients.forEach(function(el, i) {
      if (!el.handshake) return false;
      var avatar = el.handshake.session.avatar
        , base64 = null;
      
      if (avatar) base64 = new Buffer(avatar, 'binary').toString('base64');
      client.emit('createSpirit', el.id, base64);
    });
    
    clients.push(client);
    cursor.emit('numberOfConnection', Object.keys(cursor.sockets).length);
    
    client.on('disconnect', function() {
      client.broadcast.emit('removeSpirit', client.id);
      cursor.emit('numberOfConnection', Object.keys(cursor.sockets).length);
      clients = clients.filter(function(el) {
        return el === client;
      });
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
