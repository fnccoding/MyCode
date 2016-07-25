/**
 * 
 */

/**
 *首页背景光闪动
 */
//setInterval(guang,800);


/**
*星光闪烁
*/
function flicker(a){
	if($(a).css("display")=="none"){
		$(a).show("slow");
	}else{
		$(a).hide("slow");
	}
	
}
setInterval(flicker(""),500);


/**
 * 星星随机出现
 */
function initparticles(){
	setInterval(hearts,2000);
}

function hearts() {
	$(".stars img").hide(2000);
	
   $.each($(".stars img"), function(){
      var heartcount = ($(this).width()/50)*5;
      for(var i = 0; i <= heartcount; i++) {
         var size = ($.rnd(60,120)/15);
         var top= $.rnd(0,100)+"%";
         var left=$.rnd(0,100)+"%";
         var width=$.rnd(8,10)+"%";
         $(this).attr("style","position:absolute;top:"+top+";left:"+left+";width:"+width+";");
      }
   });
}
jQuery.rnd = function(m,n) {
    m = parseInt(m);
    n = parseInt(n);
    return Math.floor( Math.random() * (n - m + 1) ) + m;
}

initparticles();







