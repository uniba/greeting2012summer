
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index');
};

exports.about = function(req, res){
  res.render('about');
};

exports.console = function(req, res){
  res.render('console');
};

exports.secret = function(req, res){
  res.render('secret');
};