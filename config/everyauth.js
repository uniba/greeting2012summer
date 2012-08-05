
var inspect = require('util').inspect
  , request = require('request')
  , everyauth = require('everyauth')
  , Facebook = require('facebook-node-sdk');

module.exports = function(app) {

  try {
    var auth = require('./auth.json')
      , env = auth[app.settings.env];
  } catch (e) {
    var env = {
            twitter: {
                consumerKey: process.env.TWITTER_CONSUMER_KEY
              , consumerSecret: process.env.TWITTER_CONSUMER_SECRET
            }
          , facebook: {
                appId: process.env.FACEBOOK_APP_ID
              , appSecret: process.env.FACEBOOK_APP_SECRET
            }
        };
  }
  
  everyauth.debug = 'production' !== app.settings.env;
  
  everyauth.twitter
    .consumerKey(env.twitter.consumerKey)
    .consumerSecret(env.twitter.consumerSecret)
    .addToSession(function(session, data) {
      var promise = this.Promise()
        , options = { url: data.oauthUser.profile_image_url, encoding: 'binary' };
      
      for (var i in data) {
        session[i] = data[i];
      }
      
      request(options, function(err, resp, body) {
        session.avatar = new Buffer(body, 'binary').toString('base64');
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
      
      for (var i in data) {
        session[i] = data[i];
      }
      
      request(options, function(err, resp, body) {
        session.avatar = new Buffer(body, 'binary').toString('base64');
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
