

areaAction()


/** 设置省市区联动 */
function areaAction() {
    $("#selProvince option:gt(0)").remove();
    $.each(provinceJson, function(k, p) {
	var option = "<option value='" + p.id + "'>" + p.province + "</option>";
	$("#selProvince").append(option);
    });
    $("#selProvince").change(function() {
	var selValue = $(this).val();
	$("#selCity option:gt(0)").remove();
	$("#selDistrict option:gt(0)").remove();
	$.each(cityJson, function(k, p) {
	    // 直辖市处理.|| p.parent == selValue，直辖市为当前自己
	    if (p.id == selValue || p.parent == selValue) {
		var option = "<option value='" + p.id + "'>" + p.city + "</option>";
		$("#selCity").append(option);
	    }
	});
    });
    $("#selCity").change(function() {
	var selValue = $(this).val();
	$("#selDistrict option:gt(0)").remove();
	$.each(countyJson, function(k, p) {
	    if (p.parent == selValue) {
		var option = "<option value='" + p.id + "'>" + p.county + "</option>";
		$("#selDistrict").append(option);
	    }
	});
    });
}

/**
 * 确认省市区
 * */
function sureAdress(){
	var province=$("#selProvince option:selected").text();
	var city=$("#selCity option:selected").text();
	var district=$("#selDistrict option:selected").text();
	if($("#selProvince").val()!=0){
		$("#addressShen").text(province);
	}
	if($("#selCity").val()!=0){
		$("#addressShi").text(city);
	}
	if($("#selDistrict").val()!=0){
		$("#addressQu").text(district);
	}
	
	$("#addressAlert").hide();
}

/**地址提交**/
function sureInfo(){
	var aa=validateAddressForm();
	if(aa.name){
		window.location.href="personalCenter.html"
	}
	
}

/** 验证地址表单 */
function validateAddressForm() {
    var address = new Object();
    var formCode = $('#addressForm input[name="code"]').val();
    var formName = $('#addressForm input[name="name"]').val();
    var formReceiverName = $('#addressForm input[name="receiverName"]').val();
    var formReceiverMobileNumber = $('#addressForm input[name="receiverMobileNumber"]').val();
    var formProvinceVal = $('#addressForm #selProvince option:selected').val();
    var formProvinceText = $('#addressForm #selProvince option:selected').text();
    var formCityVal = $('#addressForm #selCity option:selected').val();
    var formCityText = $('#addressForm #selCity option:selected').text();
    var formDistrictVal = $('#addressForm #selDistrict option:selected').val();
    var formDistrictText = $('#addressForm #selDistrict option:selected').text();
    var formStreet = $('#addressForm input[name="street"]').val();
    if (!formName) {
		errorShow("地址名称不能为空",null);
    } else if (formName.length >= 10) {
		errorShow("地址名称长度小于10",null);
    } else if (!formReceiverName) {
		errorShow("收货人姓名不能为空",null);
    } else if (formReceiverName.length >= 20) {
		errorShow("收货人姓名长度小于10",null);
    } else if (!formReceiverMobileNumber) {
		errorShow("收货人手机号码不能为空",null);
    } else if (!/^1[0-9]{10}$/.test(formReceiverMobileNumber)) {
		errorShow("请输入正确的收货人手机号码",null);
    } else if (formProvinceVal == 0) {
		errorShow( "请选择省份",null);
    } else if (formCityVal == 0) {
		errorShow("请选择城市",null);
    } else if (formDistrictVal == 0) {
		errorShow("请选择区/县",null);
    } else if (!formStreet) {
		errorShow("详细地址不能为空",null);
    } else if (formStreet.length >= 30) {
		errorShow("详细地址长度小于30",null);
    } else {
	if (formCode) {
	    address['code'] = formCode;
	}
	address['name'] = formName;
	address['receiverName'] = formReceiverName;
	address['receiverMobileNumber'] = formReceiverMobileNumber;
	address['province'] = formProvinceText;
	address['city'] = formCityText;
	address['district'] = formDistrictText;
	address['street'] = formStreet;
	address['isDefault'] = false;
	return address;
    }
}

function addSaveAddress() {
	
		address = validateAddressForm();

		$.ajax({
			type : "post",
			contentType : "application/json",
			url : "/address/add.ctrl",
			data : JSON.stringify(address),
			async : false,
			dataType : "json",
			success : function(data) {
				if (data.error) {
					throw data.error;
				} else {
					errorShow("添加成功", null);
				}
			}
		});
	}