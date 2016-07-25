/**
 * index js
 */

/** 查看用户是否登录 */
function memberProfile() {
    var existMember = false;
    // 用户是否登录
    $.ajax({
	type : "post",
	url : "/member/profile.ctrl",
	contentType : "application/json",
	async : false,
	dataType : "json",
	success : function(data) {
	    if (data.object) {
	    	
		existMember = true;
	    } else {
		existMember = false;
	    }
	}
    });
    return existMember;
}

if (isWeiXin()) {
	if (memberProfile()) {
	    window.location.href = "main.html";
	} else {
	    window.location.href = "https://open.weixin.qq.com/connect/oauth2/authorize?appid=wx160b97fc7a08acc3&redirect_uri=http://www.hotkidclub.com/xiaoxiaosu/main.html&response_type=code&scope=snsapi_userinfo#wechat_redirect";
	}
	} else {
	window.location.href = "main.html";
}
