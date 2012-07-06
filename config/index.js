
var express = require('express');

module.exports = function(app) {
  
  app.configure('all', function() {
    app.set('views', __dirname + '/../views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.cookieParser());
    app.use(express.session({
        secret: 'all your ghost are belong to us.'
    }));
    app.use(express.methodOverride());
    app.use(require('stylus').middleware({ src: __dirname + '/../public' }));
    app.use(app.router);
    app.use(express.static(__dirname + '/../public'));
  });
  
  app.configure('development', function() {
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
  });
  
  app.configure('production', function() {
    app.use(express.errorHandler());
  });

  var everyauth = require('./everyauth')(app);
  
  return app;
};