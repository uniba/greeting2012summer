
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { title: 'Express', action: 'index' })
};

exports.about = function(req, res){
  res.render('about', { title: 'Express', action: 'about' })
};

exports.console = function(req, res){
  res.render('console', { title: 'Express', action: 'console' })
};