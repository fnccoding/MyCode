/** 动态加载活动规则页面 */
function creatediv() {
    $.ajax({
	url : "rule.html",
	type : "GET",
	dataType : "html",
	async : false,
	success : function(msg) {
	    $('#container').append(msg);
		
	}
    });
}
function showActiveRule() {
    if (!$('#activeRules').is(':visible')) {
    	creatediv();
	$('#activeRules').show();
	var myScroll = new iScroll('wrapper', {
	    scrollbarClass : 'myScrollbar',
	    hideScrollbar : false
	});
    }
}


/** 隐藏活动规则 */
function hideActiveRule() {
    if ($('#activeRules').is(':visible')) {
	$('#activeRules').remove();
    }
}