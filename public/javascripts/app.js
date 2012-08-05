
var route = (function() {
  var routes = [];

  return function(route, fn) {
    if (1 == arguments.length) {
      for (var i = 0, len = routes.length; i < len; ++i) {
        if (route === routes[i].route
          || (routes[i].route.test && routes[i].route.test(routes[i].route))) {
          routes[i].handler();
        }
      }
    } else {
      routes.push({
          route: route
        , handler: fn
      });
    }
  };
})();

var music
  , socket = io.connect()
  , cursor = io.connect('/cursor');

route('/', function() {
  var audio = music = new Audio();
  audio.src = '/assets/music.m4a';
  audio.loop = true;
  audio.play();
});

route('/about', function() {
  var audio = music = new Audio();
  audio.src = '/assets/music.m4a';
  audio.loop = true;
  audio.play();
});

route('/console', function() {
  var audio = music = new Audio();
  audio.src = '/assets/music.m4a';
  audio.loop = true;
  audio.play();
});

route('/secret', function() {
  var audio = music = new Audio();
  audio.src = '/assets/secret.m4a';
  audio.loop = true;
  audio.play();
});

$(function() {
  $(document.body).on('keypress', function(e) {
    switch (e.keyCode) {
      case 'r'.charCodeAt(0):
        socket.emit('reset');
        break;
    }
  });
  
  $('.back[rel=controller]').on('click', function(e) {
    socket.emit('back', 100);
  });

  $('.forward[rel=controller]').on('click', function(e) {
    socket.emit('forward', 100);
  });
  
  $('.right[rel=controller]').on('click', function(e) {
    socket.emit('right', 15);
  });
  
  $('.left[rel=controller]').on('click', function(e) {
    socket.emit('left', 15);
  });
});

$(function() {
  var spirits = {}
    , windowWidth = $(window).width()
    , windowHeight = $(window).height();

  $(window).on('resize', function() {
    windowWidth = $(this).width();
    windowHeight = $(this).height();
  });
  
  $('.pause').on('click', function(e) {
    if (music) {
      if (music.paused) {
        music.play();
      } else {
        music.paused();
      }
    }
  });
  
  function createSpirit(data) {
    var canvas = document.createElement('canvas')
      , ghost = new Image()
      , ctx = canvas.getContext('2d')
      , container = document.createElement('div')
      , avatar = document.createElement('img');
    
    canvas.width = 100;
    canvas.height = 126;
    
    ghost.onload = function(e) {
      if (data) {
        avatar.onload = function(e) {
          var buffer = document.createElement('canvas')
            , bufCtx = buffer.getContext('2d');
          
          buffer.width = ghost.width;
          buffer.height = ghost.height;
          
          bufCtx.drawImage(ghost, 0, 0, ghost.width, ghost.height);
          bufCtx.drawImage(avatar, 78, 84, 220, 220);
          ctx.drawImage(buffer, 0, 0, 100, 126);
                    
          $(container).fadeIn();
        };
        avatar.src = 'data:image/png;base64,' + data;
      }
    };
    
    ghost.src = '/images/sns_obake.png';
    
    $(container).addClass('spirits').hide();
    container.appendChild(canvas);
    document.body.appendChild(container);
    
    return container;
  }

  socket.on('connection', function() {
    
  });

  $(document).on('mousemove', function(e) { 
    cursor.emit('moveSpirit', e.clientX / windowWidth, e.pageY);
  });
  
  cursor.on('numberOfConnection', function(n) {
    $('.number-of-connection').text(n);
  });
  
  cursor.on('createSpirit', function(id, data) {
    var img = createSpirit(data);
    spirits[id] = img;
  });
  
  cursor.on('moveSpirit', function(id, x, y) {
    if (!spirits[id]) {
      spirits[id] = createSpirit();
    }
    spirits[id].style.display = 'block';
    spirits[id].style.left = (x * windowWidth) + 'px';
    spirits[id].style.top = y + 'px';
  });
  
  cursor.on('removeSpirit', function(id) {
    $(spirits[id])
      .fadeOut()
      .promise()
      .done(function() {
        document.body.removeChild(spirits[id]);
        delete spirits[id];
      });
  });
});

jQuery.extend( jQuery.easing,
  {
  	easeInOutQuad: function (x, t, b, c, d) {
  		if ((t/=d/2) < 1) return c/2*t*t + b;
  		return -c/2 * ((--t)*(t-2) - 1) + b;
  },
  	easeInBounce: function (x, t, b, c, d) {
  		return c - jQuery.easing.easeOutBounce (x, d-t, 0, c, d) + b;
  },
  	easeOutBounce: function (x, t, b, c, d) {
  		if ((t/=d) < (1/2.75)) {
  			return c*(7.5625*t*t) + b;
  		} else if (t < (2/2.75)) {
  			return c*(7.5625*(t-=(1.5/2.75))*t + .75) + b;
  		} else if (t < (2.5/2.75)) {
  			return c*(7.5625*(t-=(2.25/2.75))*t + .9375) + b;
  		} else {
  			return c*(7.5625*(t-=(2.625/2.75))*t + .984375) + b;
  		}
  	},
  	easeInOutBounce: function (x, t, b, c, d) {
  		if (t < d/2) return jQuery.easing.easeInBounce (x, t*2, 0, c, d) * .5 + b;
  		return jQuery.easing.easeOutBounce (x, t*2-d, 0, c, d) * .5 + c*.5 + b;
  	}
});

$(function() {
  setInterval(function(){
    $('#console .obake').animate({top:'50px'},1000,'easeInOutQuad',function(){
      $('#console .obake').animate({top:'30px'},1000,'easeInOutQuad')
   });
  }, 2000);
  setInterval(function(){
    $('#console div.minikun').animate({top:'20px'},800,'easeInOutQuad',function(){
      $('#console div.minikun').animate({top:'0px'},800,'easeInOutQuad')
   });
  }, 1600);
  setInterval(function(){
    $('#console div.akumakun').animate({top:'-30px'},1000,'easeInOutQuad',function(){
      $('#console div.akumakun').animate({top:'0px'},500,'easeInOutQuad')
   });
  }, 2000);
});
$(window).load(function(){
  $('#secret .back_to_top').animate({top:0},1000,'easeOutBounce');
});

route(location.pathname);
