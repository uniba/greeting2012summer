
var inspect = require('util').inspect
  , everyauth = require('everyauth')
  , Facebook = require('facebook-node-sdk')
  , auth = require('./auth.json');

module.exports = function(app) {

  var env = auth[app.settings.env];
  
  everyauth.debug = 'production' !== app.settings.env;
  
  everyauth.twitter
    .consumerKey(env.twitter.consumerKey)
    .consumerSecret(env.twitter.consumerSecret)
    .findOrCreateUser(function() {
      var promise = this.Promise();
      app.emit('twitterLogin', arguments[3]);
      return {};
    })
    .redirectPath('/')
    .handleAuthCallbackError(function(req, res) {
    });
  
  everyauth.facebook
    .appId(env.facebook.appId)
    .appSecret(env.facebook.appSecret)
    .scope('user_about_me,friends_about_me,publish_stream')
    .findOrCreateUser(function() {
      var promise = this.Promise();
      app.emit('facebookLogin', arguments[3]);
      return {};
    })
    .redirectPath('/');
  
  everyauth.helpExpress(app);
  
  app.use(everyauth.middleware());
  app.use(Facebook.middleware({ appId: env.facebook.appId, secret: env.facebook.appSecret }));
  
  return everyauth;
};