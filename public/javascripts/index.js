$(document).mousemove(function(e){
    if( $(window).width() > 1023 ){
      $('#cursor').css('left',e.clientX);
      $('#cursor').css('top',e.clientY);
    }
  });
  $(document).click(function(e){
    if( $(window).width() > 1023 ){
      let eff = $('<div class="clickEff" style="left: '+e.clientX+'px;top: '+e.clientY+'px;"></div>');
      $(document.body).append(eff);
      let start = setTimeout(function(){
        eff.addClass('start');
      },10);
      let timeout = setTimeout(function(){
        eff.remove();
      },500);
    }
  });
$(document).ready(function(){
    $('button, .scrollPrompt>p, .scrollPrompt>svg, a, .navbar>img, .cateNavbar>img, .cateNavbar>div>img').hover(function(){
        $('#cursor').addClass('onHover');
      },function(){
        $('#cursor').removeClass('onHover');
      });
});