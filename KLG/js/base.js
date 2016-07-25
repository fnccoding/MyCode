/** 采用正则表达式获取地址栏参数： */
function GetQueryString(name) {
    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)");
    var r = window.location.search.substr(1).match(reg);
    if (r != null)
	return unescape(r[2]);
    return null;
}

/** 是否是微信浏览器 */
function isWeiXin() {
    var ua = window.navigator.userAgent.toLowerCase();
    if (ua.match(/MicroMessenger/i) == 'micromessenger') {
	return true;
    } else {
	return false;
    }
}
$.ajax({
	type:"get",
	url:"",
	async:true
});

/**错误弹窗
 * msg 错误提示
 *link 确认后跳转地址，默认不跳转
 */
function errorShow(msg, link) {
    if ($('#error').length) {
	$('#error #error_alert_slogan').text(msg);
	$('#error').show();
    } else {
	var html = "";
	html += '<div class="popalert" id="error">';
	html += '<div class="popup error_onebtn">';
	html += '<div class="popup_warp">';
	html += '<div class="error_alert">';
	html += '<div class="error_alert_slogan">' + msg + '</div>';
	html += '<div class="error_btn_one">',
	html += '<a href="javascript:;" class="close"></a>'
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$('.container').append(html);
	$("#error").show();
    }

    $('#error .close').click(function() {
	if (link) {
	    window.location.href = link;
	}
	$("#error").remove();
    });
}

/** 错误提示 */
function errorAlert(msg, time) {
	$('#errorAlertDiv').remove();
	var html = '';
	html += '<div id="errorAlertDiv">';
	html += '<div  class="error-tip">';
	html += '<p>' + msg + '</p>';
	html += '</div>';
	html += '</div>';
	$('body').append(html);

	$(window).resize(function() {
		$('.error-tip p').css({
			'position' : 'fixed',
			'left' : ($(window).width() - $('.error-tip p').outerWidth()) / 2,
			'top' : ($(window).height() - $('.error-tip p').outerHeight()) / 2
		});
	});
	$(window).resize();

	function layerHide() {
		$('#errorAlertDiv').fadeOut('fast');
	}
	if (time) {
		window.setTimeout(layerHide, time);
	} else {
		window.setTimeout(layerHide, 1600);
	}
}