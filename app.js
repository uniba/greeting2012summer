
/**
 * Module dependencies.
 */

var express = require('express')
  , config = require('./config')
  , routes = require('./routes');

process.on('uncaughtException', function(e) {
  console.log(e);
});

// require('console-trace')({ always: true });

var app = module.exports = express.createServer();

config(app);

// Configuration

app.helpers({
    title: 'Uniba House'
});

app.dynamicHelpers({
    action: function(req, res) {
      return '';
      // return req.path.replace('/', ' ').trim().replace(' ', '/') || 'index';
    }
});

// Routes

app.all('/', function(req, res) {
  res.render('end');
});

// app.get('/', routes.index);
// app.get('/index', routes.index);
// app.get('/about', routes.about);
// app.get('/console', routes.console);
// app.get('/secret', routes.secret);
// app.get('/coming', routes.coming);
// app.get('/screen/:name', function(req, res) {
//   res.render('screen');
// });

app.listen(process.env.PORT || 3000, function(){
  // var io = require('./socket')(app);
  
  console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);
});
