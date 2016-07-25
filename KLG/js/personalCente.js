
function showPcOrder(){
	if($(".pc_personalOrder").css("display")=="none"){
		$(".pc_personalOrder").show();
		$(".pc_personalWinrecord").hide();
		$(".pc_loveRecord").hide();
		$("#tab_order").addClass("tab_active");
		$("#tab_order").siblings().removeClass("tab_active");
	}
	
}

function showPCWin(){
	if($(".pc_personalWinrecord").css("display")=="none"){
	
	$(".pc_personalWinrecord").show();
	$(".pc_loveRecord").hide();
	$(".pc_personalOrder").hide();
	$("#tab_win").addClass("tab_active");
	$("#tab_win").siblings().removeClass("tab_active");
	}
	if(myScroll2){
		
	}else{
		var myScroll2 = new iScroll('wrapper2', {
	    scrollbarClass : 'myScrollbar',
	    hideScrollbar : false
	});
	}
}
function showPClove(){
	if($(".pc_loveRecord").css("display")=="none"){
		$(".pc_loveRecord").show();
		$(".pc_personalWinrecord").hide();
		$(".pc_personalOrder").hide();
		$("#tab_love").addClass("tab_active");
		$("#tab_love").siblings().removeClass("tab_active");
	}
	if(myScroll3){
		
	}else{
		var myScroll3 = new iScroll('wrapper3', {
	    scrollbarClass : 'myScrollbar',
	    hideScrollbar : false
	});
	}
}
