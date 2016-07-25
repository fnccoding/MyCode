var member, openId;

$(function() {
    if (!memberProfile()) {
	if (isWeiXin()) {
	    try {
		openId = getOpenId();
	    } catch (err) {
		errorShow(err, null);
		return;
	    }
	    try {
		loginByOpenId(openId);
	    } catch (err) {// 登录失败，未注册
	    
	    }
	} else {
		loginShow();
		}
    }
});


/** 错误信息 */

/** 查看用户是否登录 */
function memberProfile() {
    var existMember;
    $.ajax({
	type : "post",
	url : "/member/profile.ctrl",
	contentType : "application/json",
	async : false,
	dataType : "json",
	success : function(data) {
	    if (data.object) {
		member = data.object;
		existMember = true;
	    } else {
		existMember = false;
	    }
	}
    });
    return existMember;
}

/** 根据code获取OpenId */
function getOpenId() {
    var openId;
    if (code) {
	$.ajax({// 获取openId
	    type : "post",
	    contentType : "application/json",
	    url : "/weixin/authorizeGetOpentId.ctrl",
	    data : JSON.stringify({
		"code" : code
	    }),
	    async : false,
	    dataType : "json",
	    success : function(data) {
		if (data.object != null) {
		    openId = data.object;
		} else {
		    // alertMsg(data.error, "error");
		    // window.location.href = "error.html";
		    throw "微信授权失败";
		}
	    },
	    error : function(XMLHttpRequest, textStatus, errorThrown) {
		console.log("error:" + XMLHttpRequest + " " + textStatus + " " + errorThrown);
	    }
	});

    } else {
	// alertMsg("微信没有授权", "error");
	// window.location.href = "error.html";
	throw "未使用微信授权";
    }
    return openId;
}

/** 根据openId登录 */
function loginByOpenId(openId) {
    var requestData = {
	"openId" : openId,
	"campaign" : "XIAOXIAOSU"
    };
    $.ajax({
	type : "post",
	contentType : "application/json",
	url : "/member/loginByOpenId.ctrl",
	data : JSON.stringify(requestData),
	async : false,
	dataType : "json",
	success : function(data) {
	    if (data.error != null) {
		// alertMsg(data.error, "error");
		throw data.error;
	    } else {
		member = data.object;
	    }
	}
    });
}

/** 展示登录弹框 */
function loginShow() {
    if ($("#login").length) {
	if (!$('#login').is(":visible")) {
	    $("#loginForm input").val("");
	    $("#login").show();
	}
    } else {
	var html = "";
	html += '<div class="popalert" id="login">';
	html += '<div class="popup loginbg">';
	html += '<div class="popup_warp">';
	html += '<div class="login_slogan">因奖品有现金和旺币发放，为确保能即时发送给您，请验证您的信息</div>';
	html += '<form id="loginForm" name="loginForm" class="form-control">';
	html += '<div class="alertformitem clearfix"><label color="">手机号：</label><input placeholder="请输入您的手机号" maxlength="11" name="mobileNumber" id="mobileNumber"></div>';
	html += '<div class="alertformitem clearfix"><label color="">密码：</label><input placeholder="请输入您的密码" type="password" name="password"></div>';
	html += '</form>';
	html += '<div class="alert_btn_box">',
	html += '<a href="javascript:loginSubmit();" class="alert_btn"></a>',
	html += '</div>',
	html += '<div class="two_a">',
	html += '<a href="javascript:toRegister()" class="to_validate">去注册</a>',
	html += '<a href="javascript:resetShow()" class="forgetpwd">忘记密码？</a>'
	html += '</div>';
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$('.container').append(html);
	$("#login").show();
    }
}

/** 隐藏登录弹框 */
function loginHide() {
    if ($('#login').is(":visible")) {
	$("#loginForm input").val("");
	$("#login").hide();
    }
}
/*登录页去注册
 */
function toRegister(){
	loginHide();
	registerShow()
}

/** 展示注册弹框 */
function registerShow() {
    loginHide();
    if ($('#register').length) {
	if (!$('#register').is(":visible")) {
	    $("#registerForm input").val("");
	    $("#register").show();
	}
    } else {
	var html = "";
	html += '<div class="popalert" id="register">';
	html += '<div class="popup registerbg">';
	html += '<div class="popup_warp">';
	html += '<div class="login_slogan">因奖品有现金和旺币发放，为确保能即时发送给您，请验证您的信息!</div>';
	html += '<form id="registerForm" name="registerForm" class="form-control">';
	html += '<div class="alertformitem clearfix"><label >手机号：</label><input placeholder="请输入您的手机号" maxlength="11" id="mobileNumber" name="mobileNumber"></div>';
	html += '<div class="alertformitem clearfix"><label >密码：</label><input placeholder="请输入您的密码" id="password" name="password" type="password"></div>';
	html += '<div class="alertformitem clearfix">'
	html += '<label>短信验证：</label><input id="verificationCode" name="verificationCode" type="number" maxlength="4">';
	html += '<a href="javascript:;" id="registrationCodeCheck" class="registrationCodeCheck" onclick="sendRegistrationCode(\'register\')">获取验证码</a>';
	html += '</div>'
	html += '</form>',
	html += '<div class="alert_btn_box">',
	html += '<a href="javascript:registerSubmit();" class="alert_btn"></a>'
	html += '</div>';
	html += '<div class="two_a clearfix">',
	html += '<a href="javascript:registerToLogin()" class="to_validate">去登录</a>'
	html += '<a href="javascript:resetShow()" class="forgetpwd">忘记密码？</a>'
	html += '</div>',
	html += '</div>';
	html += '</div>';
	html += '</div>';
	$('.container').append(html);
	
	$("#register").show();
    }

}

/** 隐藏注册弹框 */
function registerHide() {
    if ($('#register').is(":visible")) {
	$("#registerForm input").val("");
	$("#register").hide();
    }
}

/** 注册弹框到登录弹框 */
function registerToLogin() {
    registerHide();
    loginShow();
}

/** 展示重置密码弹框 */
function resetShow() {
    loginHide();
    if ($('#reset').length) {
	if (!$('#reset').is(":visible")) {
	    $("#resetForm input").val("");
	    $("#reset").show();
	}
    } else {
	var html = "";
	html += '<div class="popalert" id="reset">';
	html += '<div class="popup resetbg">';
	html += '<div class="popup_warp">';
	html += '<form id="resetForm" name="resetForm" class="form-control">';
	html += '<div class="alertformitem clearfix"><label >手机号：</label><input placeholder="请输入您的手机号" maxlength="11" id="mobileNumber" name="mobileNumber"></div>';
	html += '<div class="alertformitem clearfix"><label >密码：</label><input placeholder="请输入您的密码" id="password" name="password" type="password"></div>';
	html += '<div class="alertformitem clearfix">',
	html += '<label >验证码:</label>',
	html += '<input id="verificationCode"  name="verificationCode" type="number" maxlength="4">'
	html += '<a href="javascript:;" id="resetPasswordCodeCheck" class="registrationCodeCheck" onclick="sendRegistrationCode(\'resetPassword\')">获取验证码</a>'
	html += '</div></form>',
	html += '<div class="alert_btn_box">',
	html += '<a href="javascript:resetPassword();" class="alert_btn"></a>',
	html += '</div>',
	html += '<div class="reset_to_validate clearfix">',
	html += '<a href="javascript:resetToLogin()">去验证?</a>',
	html += '</div>',
	html += '</div>',
	html += '</div>',
	html += '</div>';
	$('.container').append(html);
	$("#reset").show();
    }
}

/** 隐藏重置密码弹框 */
function resetHide() {
    if ($('#reset').is(":visible")) {
	$("#resetForm input").val("");
	$("#reset").hide();
    }
}

/** 重置密码弹框到登录弹框 */
function resetToLogin() {
    resetHide();
    loginShow();
}

/**
 * 获取短信验证码
 * 
 * @param object:register、resetPassword
 */
var registrationCodeFlag = 1;
var resetPasswordCodeFlag = 1;
function sendRegistrationCode(object) {
    if (object == "register") {
	var error;
	var mobileNumber = $("#register input[name='mobileNumber']").val();
	var password=$("#register input[name='password']").val();
   
	if (registrationCodeFlag == 1) {
	    if (!mobileNumber) {
		errorShow("请输入正确的手机号", null);
		return;
	    } else if (!/^1[0-9]{10}$/.test(mobileNumber)) {
		errorShow("请输入正确的手机号", null);
		return;
	    } else if (!password) {
		errorShow("请输入密码", null);
		return;
		}
	    var requestData = {
		"mobileNumber" : mobileNumber,
		"channel" : "KLG"
	    };
	    $.ajax({
		type : "post",
		contentType : "application/json",
		url : "/member/sendValidationCode.ctrl",
		data : JSON.stringify(requestData),
		async : false,
		dataType : "json",
		success : function(data) {
		    if (data.error != null) {
			errorShow(data.error, null);
			// throw data.error;
			error = data.error;
		    } else {
			error = null;
		    }
		}
	    });
	    if (!error) {
		time($("#registrationCodeCheck"), "register");
	    }
	}
    } else if (object == "resetPassword") {
	var error;
	var mobileNumber = $("#reset input[name='mobileNumber']").val();
	var password=$("#reset input[name='password']").val();
    var verifyPassword =$("#reset input[name='verifyPassword']").val();
	if (resetPasswordCodeFlag == 1) {
	    if (!mobileNumber) {
		errorShow("请输入正确的手机号", null);
		return;
	    } else if (!/^1[0-9]{10}$/.test(mobileNumber)) {
		errorShow("请输入正确的手机号", null);
		return;
	    } else if (!password) {
		errorShow("请输入密码", null);
		return;
		}
	    var requestData = {
		"mobileNumber" : mobileNumber,
		"channel" : "KLG"
	    };
	    $.ajax({
		type : "post",
		contentType : "application/json",
		url : "/member/sendValidationCode.ctrl",
		data : JSON.stringify(requestData),
		async : false,
		dataType : "json",
		success : function(data) {
		    if (data.error != null) {
			errorShow(data.error, null);
			// throw data.error;
			error = data.error;
		    } else {
			error = null;
		    }
		}
	    });
	    if (!error) {
		time($("#resetPasswordCodeCheck"), "resetPassword");
	    }
	}
    }

}

/**
 * 短信验证码倒计时
 * 
 * @param o
 * @param flagName:register、resetPassword
 */
var wait = 60;
function time(o, flagName) {
    if (wait == 0) {
	if (flagName == "register") {
	    registrationCodeFlag = 1;
	} else if (flagName == "resetPassword") {
	    resetPasswordCodeFlag = 1;
	}

	o.text("获取验证码");
	wait = 60;
    } else {
	if (flagName == "register") {
	    registrationCodeFlag = 0;
	} else if (flagName == "resetPassword") {
	    resetPasswordCodeFlag = 0;
	}
	o.text("重新发送(" + wait + ")");
	wait--;
	setTimeout(function() {
	    time(o, flagName);
	}, 1000);
    }
}

/** 登录提交 */
function loginSubmit() {
    var form = document.loginForm;
    var mobileNumber = form.mobileNumber.value;
    var password = form.password.value;
    if (!mobileNumber) {
	errorShow("请输入正确的手机号", null);
    } else if (!password) {
	errorShow("请输入密码", null);
    } else if (!/^1[0-9]{10}$/.test(mobileNumber)) {
	errorShow("请输入正确的手机号", null);
    } else {
	password = hex_sha1(password);
	var requestData = {
	    "mobileNumber" : mobileNumber,
	    "password" : password,
	    "campaign" : "KLG",
	    "channel" : "WEIXIN"
	};

	$.ajax({// 登录
	    type : "post",
	    contentType : "application/json",
	    url : "/member/login.ctrl",
	    data : JSON.stringify(requestData),
	    async : false,
	    dataType : "json",
	    success : function(data) {
		if (data.object != null) {
		    member = data.object;

		    if (!member.openId) {
			if (openId) {
			    try {
				bindWeixin(openId);
			    } catch (err) {
				alert(err);
			    }
			}
		    }
		    $("#login").hide();
		    window.location.href=window.location.href;
		} else {
		    errorShow(data.error, null);
		}
	    },
	    error : function(XMLHttpRequest, textStatus, errorThrown) {
		console.log("error:" + XMLHttpRequest + " " + textStatus + " " + errorThrown);
	    }
	});
    }
}

/** 注册提交 */
function registerSubmit() {
    var form = document.registerForm;
    var mobileNumber = form.mobileNumber.value;
    var verificationCode = form.verificationCode.value;
    var password = form.password.value;
    if (!mobileNumber) {
	errorShow("请输入正确的手机号", null);
    } else if (!/^1[0-9]{10}$/.test(mobileNumber)) {
	errorShow("请输入正确的手机号", null);
    } else if (!verificationCode) {
	errorShow("请输入短信验证码", null);
    } else if (!password) {
	errorShow("请输入密码", null);
    } 
    else {
	password = hex_sha1(password);
	var requestData = {
	    "mobileNumber" : mobileNumber,
	    "validationCode" : verificationCode,
	    "password" : password,
	    "campaign" : "KLG",
	    "channel" : "WEIXIN"
	};

	$.ajax({// 注册
	    type : "post",
	    contentType : "application/json",
	    url : "/member/register.ctrl",
	    data : JSON.stringify(requestData),
	    async : false,
	    dataType : "json",
	    success : function(data) {
		if (data.object != null) {
		    member = data.object;

		    if (!member.openId) {
			if (openId) {
			    try {
				bindWeixin(openId);
			    } catch (err) {
				alert(err);
			    }
			}
		    }
		    $("#register").hide();
		} else {

		    errorShow(data.error, null);
		}
	    },
	    error : function(XMLHttpRequest, textStatus, errorThrown) {
		console.log("error:" + XMLHttpRequest + " " + textStatus + " " + errorThrown);
	    }
	});
    }
}

/** 重置密码 */
function resetPassword() {
    var form = document.resetForm;
    var mobileNumber = $("#resetForm #mobileNumber").val();
    var password = $("#resetForm #password").val();
    var verifyPassword = $("#resetForm #verifyPassword").val();
    var verificationCode = $("#resetForm #verificationCode").val();
    if (!mobileNumber) {
	errorShow("请输入正确的手机号", null);
    } else if (!/^1[0-9]{10}$/.test(mobileNumber)) {
	errorShow("请输入正确的手机号", null);
    } else if (!verificationCode) {
	errorShow("请输入短信验证码", null);
    } else if (!password) {
	errorShow("请输入密码", null);
    } else {
	password = hex_sha1(password);
	var requestData = {
	    "mobileNumber" : mobileNumber,
	    "password" : password,
	    "validationCode" : verificationCode
	};
	/** 重置密码提交 */
	$.ajax({
	    type : "post",
	    contentType : "application/json",
	    url : "/member/resetPassword.ctrl",
	    data : JSON.stringify(requestData),
	    async : false,
	    dataType : "json",
	    success : function(data) {
		if (data.error) {
		    errorShow(data.error, null);
		} else {
		    resetToLogin();
		}
	    }
	});
    }
}

/** 绑定用户OpenId */
function bindWeixin(openId) {
    var requestData = {
	"openId" : openId
    };
    $.ajax({
	type : "post",
	contentType : "application/json",
	url : "/member/bindWeixin.ctrl",
	data : JSON.stringify(requestData),
	async : false,
	dataType : "json",
	success : function(data) {
	    if (data.error != null) {
		throw data.error;
	    }
	}
    });
}














