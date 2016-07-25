var draftCode = GetQueryString("draftCode");

$(function() {
	if (!memberProfile()) {
		loginShow();
	}else{
		addShopCar();
		redayAddress();
		addressListRefresh();
		getOrderPrice();
	}
});




function addShopCar(){
	var order=getProduct(draftCode);
	var items=order.items;
	var html="";
	for(var i=0;i<items.length;i++){
		var ean=items[i].productEAN;
		var name=items[i].productName;
		var price=items[i].price;
		var quantity=items[i].quantity;
		html += '<div class="shop_car_item clearfix">';
		html += '<div class="product_img">';
		html += '<img src="images/car_product.png">';
		html += '</div>';
		html += '<div class="product_right">';
		html += '<span class="product_name">'+name+'</span>';
		html += '<div class="product_details clearfix">';
		html += '<label>￥'+price+'</label>';
		html += '<label>X'+quantity+'</label>';
		html += '<label class="product_item_price">￥'+((price*100)*quantity)/100+'</label>';
		html += '</div>';
		html += '</div>';
		html += '</div>';
	}
	$(".show_shop_car").append(html);
}

/**获取订单总价**/
function getOrderPrice(){
	var count=getWb(draftCode);
	
	$(".order_price_box span").text(count);
}

/***获取订单总额**/
function getWb(draftCode) {
	var result;
	$.ajax({
		type : "post",
		contentType : "application/json",
		url : "/order/allowedWbCeiling.ctrl",
		data : JSON.stringify({
			"code" : draftCode
		}),
		async : false,
		dataType : "json",
		success : function(data) {
			if (data.error != null) {
				throw data.error;
			} else {
				result = data.object;
			}
		}
	});
	return result;
}

/**
 * 获取订单产品列表
 * 
 * @param itmes[{ean,quantity}]
 */

function getProduct(draftCode) {
	var result;
	if (draftCode) {
		var requestData = {
			"code" : draftCode
		};
		$.ajax({
			type : "post",
			contentType : "application/json",
			url : "/order/selectDraft.ctrl",
			data : JSON.stringify(requestData),
			async : false,
			dataType : "json",
			success : function(data) {
				if (data.error != null) {
					// alertMsg(data.error, "error");
					throw data.error;
				} else {
					result = data.object;
				}
			}
		});
	} else {
		throw "订单错误";
	}
	return result;
}


/** *******************地址管理****************** */

var receiverAddress; // 存放收货地址
var addressList; // 

function redayAddress(){
	addressList=getAddressList();
	if(addressList != null&&addressList.length > 0){
		receiverAddress = addressList[0];
		settTopAddress(receiverAddress);
		$("#default_add").show();
		$("#add_new_address").hide();
		/**
		 * 点击默认地址时，控制地址列表出现与消失
		 * */
		$(".default_add").on('click',function(){
			if($(".all_address").is(':hidden')){
				$('.default_add_right img').css({
					"-webkit-transform" : "rotate(90deg)"
				});
				$("#add_new_address").show();
			} else {
				$('.default_add_right img').css({
					"-webkit-transform" : "rotate(0deg)"
				});
				$("#add_new_address").hide();
			}
			$(".all_address").slideToggle();
			
		});
		
		/**
		 * 地址列表消失
		 **/
		
	} else {//地址列表为空
		$("#default_add").hide();
		$("#add_new_address").show();
		receiverAddress = null;
			$('#addressForm')[0].reset();
			areaAction(); // 设置省市区联动
			$(".all_address").hide();
			$("#address_edit").fadeIn();
			
		
	}
	$("#add_new_address").on("click",function(){
			$("#add_new_address").hide();
			$(this).hide();
			$('#addressForm')[0].reset();
			areaAction(); // 设置省市区联动
			$(".all_address").hide();
			$("#address_edit").fadeIn();
			$(".address_save").show();
			$(".address_changfe_or_clear").hide();
			 
		});
		$("#address_edit h1").on("click",function(){
			$("#address_edit").hide();
			$('.address-item_right img').css({
					"-webkit-transform" : "rotate(0deg)"
				});
				
		})
}


/**
 * 刷新地址列表
 * */

function addressListRefresh(){
	if (addressList != null && addressList.length > 0){
		
		$(".all_address").children().remove();
		addressList="";
		addressList=getAddressList();
		var html="";
		for(var i=0;i<addressList.length;i++){
			var addressName=addressList[i].name;
			html += '<div class="address_item clearfix" id="'+addressList[i].code+'">';
			html += '<div class="address_item_left">';
			html += '<img src="images/shopcart_10.jpg">';
			html += '</div>';
			html += '<div class="address_item_center">';
			html += '<div class="add_name_phone">';
			html += '<span>'+addressList[i].receiverName+'</span>';
			html += '<span>'+addressList[i].receiverMobileNumber+'</span>';
			html += '</div>';
			html += '<div class="details_add">';
			html += '<span>'+addressList[i].province+addressList[i].city+addressList[i].district+addressList[i].street+'</span>';
			html += '</div>';
			html += '</div>';
			html += '<div class="address_item_right">';
			html += '<img src="images/add_icon_06.png">';
			html += '</div>';
			html += '</div>';
		}
		$(".all_address").append(html);
		/** 选择地址 */
		$(".address_item_left").click(function(){
			$(".address_item_left").find("img").attr("src","images/shopcart_10.jpg");
			$(this).find("img").attr('src', 'images/dztx_checked.png');
			var code=$(this).parent().attr("id");
			receiverAddress=findAddress(addressList, code);
			settTopAddress(receiverAddress);
		})
		
		/** 编辑地址 */
		$('.address_item_right img').on('click', function() {
			$('#addressForm')[0].reset();
			areaAction(); // 设置省市区联动
			var addressCode = $(this).parent().parent().attr('id');
			var address = findAddress(addressList, addressCode);

			editAddress(address);

			$('.all_address').hide();
			$('#address_edit').fadeIn();

		});
	}
}
/**
 * 获取地址列表
 * 
 **/
function getAddressList(){
	var result;
	$.ajax({
		type : 'post',
		url : "/address//list.ctrl",
		contentType : "application/json",
		async : false,
		dataType : 'json',
		success : function(data) {
			if (data.error) {
				// throw data.error;
			} else {
				result = data.object;
			}
		}
	});
	return result;
}

/**
 * 查询地址
 * 
 * @param list
 * @param code
 */
function findAddress(list, code) {
	var reslut;
	if (list && list.length > 0) {
		$.each(list, function(i, o) {
			if (o.code == code) {
				reslut = o;
			}
		});
	}
	return reslut;
}
/** 设置顶部地址 */
function settTopAddress(address) {
	$(".default_add #receiverName").text(address.receiverName);
	$(".default_add #receiverMobileNumber").text(address.receiverMobileNumber);
	$(".default_add #addressDetails").text(address.province + address.city + address.district + address.street);
}



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

/**添加地址**/
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
				errorAlert("添加成功", 500);
				if($("#default_add").is(":hidden")){
					redayAddress();
				}else {
					addressList = getAddressList();
					// addressList不为空
					if (addressList != null && addressList.length > 0) {
						receiverAddress = addressList[0];
						settTopAddress(receiverAddress);
					}
				}
				$(".default_add").click();
				$("#address_edit").hide();
				addressListRefresh();
			}
		}
	});
}

/** 编辑地址 */
function editAddress(address) {
	$('#addressForm input[name="code"]').val(address.code);
	$('#addressForm input[name="name"]').val(address.name);
	$('#addressForm input[name="receiverName"]').val(address.receiverName);
	$('#addressForm input[name="receiverMobileNumber"]').val(address.receiverMobileNumber);

	$.each($("#selProvince option"), function(i, o) {
		if ($(this).text() == address.province) {
			var val = $(this).val();
			$("#selProvince").val(val);
			$("#selProvince").change();
		}
	});

	$.each($("#selCity option"), function(i, o) {
		if ($(this).text() == address.city) {
			var val = $(this).val();
			$("#selCity").val(val);
			$("#selCity").change();
		}
	});

	$.each($("#selDistrict option"), function(i, o) {
		if ($(this).text() == address.district) {
			var val = $(this).val();
			$("#selDistrict").val(val);
		}
	});

	$('#addressForm input[name="street"]').val(address.street);
	if (address.isDefault) {
		$('#isDefault').attr('src', 'images/dztx_checked.png');
	} else {
		$('#isDefault').attr('src', 'images/dztx_checkout.png');
	}
	$(".address_save").hide();
	$("#add_new_address").hide();
	$(".address_changfe_or_clear").show();
}
var sub = false;
/** 编辑保存 */
function updateSaveAddress() {
	try {
		if (sub == true) {
			return;
		}
		sub = true;
		address = validateAddressForm();

		$.ajax({
			type : "post",
			contentType : "application/json",
			url : "/address/update.ctrl",
			data : JSON.stringify(address),
			async : false,
			dataType : "json",
			success : function(data) {
				sub = false;
				if (data.error) {
					throw data.error;
				} else {
					errorAlert("修改成功", 500);
					$('.edit-address img.close').click();// 关闭新增
					addressList = getAddressList();
					// addressList不为空
					if (addressList != null && addressList.length > 0) {
						receiverAddress = addressList[0];
						settTopAddress(receiverAddress);
						$("#address_edit").hide();
					}
					$('.address-infor').click(); // 显示列表
				}
				addressListRefresh();
				$("#add_new_address").hide();
			}
		});
	} catch (err) {
		sub = false;
		errorAlert(err);
	}
}
	
/** 删除地址 */
function removeAddress() {
	
	address = validateAddressForm();

	$.ajax({
		type : "post",
		contentType : "application/json",
		url : "/address/remove.ctrl",
		data : JSON.stringify(address),
		async : false,
		dataType : "json",
		success : function(data) {
			sub = false;
			if (data.error) {
				throw data.error;
			} else {
				errorAlert("删除成功", 500);
				$('.edit-address img.close').click();// 关闭新增
				var al = addressList.length;
				if ((al - 1) > 0) {
					addressList = getAddressList();
					// addressList不为空
					if (addressList != null && addressList.length > 0) {
						receiverAddress = addressList[0];
						settTopAddress(receiverAddress);
					}
					$('.address-infor').click(); // 显示列表
					
					$("#address_edit").hide();
				} else {
					readyAddress();
				}
				addressListRefresh();
				$("#add_new_address").hide();
			}
		}
	});
}