/**
 * Logo of uniba.jp
 * 
 * @dependency jQuery 1.6.2+
 * @dependency Processing.js 1.3.0+
 */

!function(window, document, $, undefined) {

  window.p5 = Processing.getInstanceById('p5stage');
  
  /**
   * Expose callback function for Processing.js
   */
  
  window.processingInitComplete = function() {
    $(window).resize();
  };
  
  $(function() {
  	$(window).bind("resize orientationchange", function(event) {  		
  		if (window.p5 && window.p5.setStageSize) {
  			window.p5.setStageSize(windowWidth, windowHeight);
  		}
  	}).trigger("resize");
  });
  
}(window, document, jQuery);
