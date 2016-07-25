
function loadupate(){
    
    var geth = window.innerHeight || document.documentElement.clientHeight || document.body.clientHeight;
    var getw = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;  
    var geth2 = geth/1008;
    var getw2 = getw/640;
    var sUserAgent = navigator.userAgent.toLowerCase();
    var bIsIpad = sUserAgent.match(/ipad/i) == "ipad";
    var bIsIphoneOs = sUserAgent.match(/iphone os/i) == "iphone os";
    var bIsMidp = sUserAgent.match(/midp/i) == "midp";
    var bIsUc7 = sUserAgent.match(/rv:1.2.3.4/i) == "rv:1.2.3.4";
    var bIsUc = sUserAgent.match(/ucweb/i) == "ucweb";
    var bIsAndroid = sUserAgent.match(/android/i) == "android";
    var bIsCE = sUserAgent.match(/windows ce/i) == "windows ce";
    var bIsWM = sUserAgent.match(/windows mobile/i) == "windows mobile";
    if (!(bIsIphoneOs || bIsMidp || bIsUc7 || bIsUc || bIsAndroid || bIsCE || bIsWM) ){
       $("#container").css("height",geth+"px");
       $("#container").css("width",640*geth2+"px");
       // $("#container").css("height",1008);
       // $("#container").css("transform","scale("+geth/1008+")");
       // $("#container").css("-webkit-transform","scale("+geth/1008+")");

       $('.male_box dl').find('dd').css('margin-top','6%');
       $('.female_box').find('.info').css('margin-top','6%');
      }else{
        $("#container").css("height",geth+"px");
        $("#container").css("width",getw+"px");
      }
};
loadupate();
//  $(function(){
//     var windowHeight = $(window).height();
//     var dialog = $('.dialogbox').outerHeight();
//     var dialogMiddle = (windowHeight - dialog) / 2;
//     $('.dialogbox').css('margin-top',dialogMiddle);
    
  
    
    
// });

// $(function(){
//     var windowHeight = $(window).height();
//     var dialog = $('.dialogbox').height();
//     var dialogMiddle = (windowHeight - dialog) / 2;
//     $('.dialogbox').css('margin-top',dialogMiddle + "px");



    
    
// });

