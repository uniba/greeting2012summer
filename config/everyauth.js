
var inspect = require('util').inspect
  , request = require('request')
  , everyauth = require('everyauth')
  , Facebook = require('facebook-node-sdk')
  , auth = require('./auth.json');

module.exports = function(app) {

  var env = auth[app.settings.env];
  
  everyauth.debug = 'production' !== app.settings.env;
  
  everyauth.twitter
    .consumerKey(env.twitter.consumerKey)
    .consumerSecret(env.twitter.consumerSecret)
    .addToSession(function(session, data) {
      var promise = this.Promise()
        , options = { url: data.oauthUser.profile_image_url, encoding: 'binary' };
      
      request(options, function(err, resp, body) {
        session.avatar = new Buffer(body, 'binary');
        session.save(function(err) {
          if (err) return promise.fail(err);
          app.emit('twitterLogin', session);
          promise.fulfill();
        });
      });
      
      return promise;
    })
    .findOrCreateUser(function() {
      return {};
    })
    .redirectPath('/console')
    .handleAuthCallbackError(function(req, res) {
    });
  
  everyauth.facebook
    .appId(env.facebook.appId)
    .appSecret(env.facebook.appSecret)
    .scope('user_about_me,friends_about_me,publish_stream')
    .addToSession(function(session, data) {
      var promise = this.Promise()
        , url = url = 'http://graph.facebook.com/' + data.oauthUser.id + '/picture'
        , options = { url: url, encoding: 'binary' };
      
      request(options, function(err, resp, body) {
        session.avatar = new Buffer(body, 'binary');
        session.save(function(err) {
          if (err) return promise.fail(err);
          app.emit('twitterLogin', session);
          promise.fulfill();
        });
      });
      
      return promise;
    })
    .findOrCreateUser(function() {
      return {};
    })
    .redirectPath('/console');
  
  everyauth.helpExpress(app);
  
  app.use(everyauth.middleware());
  app.use(Facebook.middleware({ appId: env.facebook.appId, secret: env.facebook.appSecret }));
  
  return everyauth;
};