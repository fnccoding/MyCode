 /*获取购物车列表*/
var cart, cartLength = 0;
$('.order-ul').ready(function(){
 	try {
 		cart = getShopcartList();
 		if (!cart) {
 			$('.cart-cont').hide();
 			$('.null-cart').show();
 			return;
 		}

		 cartLength = cart.items.length;
		 var items = cart.items;
		 var html = '';
		 $.each(items, function(i, o) {
		 	// 产品名称
		 	var proName = o.product.name;
		 	if (o.product.flavour)
		 		proName += (" " + o.product.flavour);
		 	 if (o.product.spec)
		 		proName += (" " + o.product.spec);
		 	html +='<li>',
		 	html +='<div class="li-main" id="'+o.product.ean+'">',
		 	html +='<div class="good-name">',
		 	html +='<img src="product/'+o.product.ean+'/">',
		 	html +='</div>',
		 	html +='<div class="good-description">',
		 	html +='<h4 class="order">'+proName+'</h4>',
		 	html +='<p class="good-wb">￥<span class="good_price">'+o.product.price+'</span></p>',
		 	html +='<div class="edit-good">',
		 	html +='<span class="good_quantity">'+o.quantity+'</span>',
		 	html +='<p><i>|</i><a href="javascript:;" class="edit">编辑</a></p>',
		 	html +='</div>',
		 	html +='</div>',
		 	html +='<div class="good-description good-descript-edit">'
		 	html +='<h4 class="order">'+proName+'</h4>',
		 	html +='<p class="good-wb">￥'+o.product.price+'</p>',
		 	html +='<div class="edit-good">',
		 	html +='<p><a href="#" class="delete">删除</a><i>|</i><a href="#" class="edit-finished">完成</a></p>',
		 	
		 	html +='<div class="good-num">',
		 	html +='<button class="minus"></button>',
		 	html +='<input type="text" value="'+o.quantity+'" class="good_num" maxlength="1">',
		 	html +='<button class="additive"></button>',
		 	html +='</div>',
		 	html +='</div>',
		 	html +='</div>',
		 	html +='</div>';
		 	html +='</li>';
		   })
		   $(".order-ul").append(html);
		   
		  
			
	}catch (err) {
		errorShow(err);
	}
});
/** 获取购物车列表 */
function getShopcartList() {
	var result;
	$.ajax({
		type : 'post',
		url : '/cart/select.ctrl',
		contentType : 'application/json',
		async : false,
		dataType : 'json',
		success : function(data) {
			if (data.error) {
				console.log(data.error);
			} else {
				result = data.object;
			}
		}
	});
	return result;
}
/** 更新购物车 */
function updateShopcart(cartItem) {
	if (memberProfile()) {
		if (cartItem.quantity != null && cartItem.product.ean != null) {
			$.ajax({
				type : 'post',
				url : '/cart/updateItem.ctrl',
				data : JSON.stringify(cartItem),
				contentType : 'application/json',
				async : false,
				dataType : 'json',
				success : function(data) {
					if (data.error) {
						throw data.error;
					}
				}
			});
		} else {
			throw "cartItem错误";
		}
	} else {
		loginShow();
	}

}


$(function(){
	$('.edit').click(function(){
		$(this).parent().parent().parent().hide();
		$(this).parent().parent().parent().siblings().show();
	});
	$('.edit-finished').click(function(){
		var goodNum=parseInt($(this).parent().siblings().find(".good_num").val());
		$(this).parent().parent().parent().parent().find(".good_quantity").text(goodNum);
		$(this).parent().parent().parent().hide();
		$(this).parent().parent().parent().siblings().show();
		getPriceCount();
	});
	$('.delete').click(function(){
		var ean=$(this).parent().parent().parent().parent().attr("id");
		var requestData={
			"product":{
				"ean":ean
			},
			"quantity": 0
		};
		updateShopcart(requestData);
		location.reload();
	});
	 getPriceCount();
	$(".minus").on("click",function(){//减去数量
		var input=$(this).parent().find(".good_num");
		if(parseInt(input.val())>1){
			var count=parseInt(input.val())-1;
			input.val(count);
			var ean=$(this).parent().parent().parent().parent().attr("id");
			var requestData = {
				'product' : {
					'ean' : ean
				},
				'quantity' : count
			};
			updateShopcart(requestData);//更新购物车
			getPriceCount();
		}
	})
	$(".additive").on("click",function(){//加数量
		var input=$(this).parent().find(".good_num");
		if(parseInt(input.val())<9){
			var count=parseInt(input.val())+1;
			input.val(count);
			var ean=$(this).parent().parent().parent().parent().attr("id");
			var requestData = {
				'product' : {
					'ean' : ean
				},
				'quantity' : count
			};
			updateShopcart(requestData);//更新购物车
			getPriceCount();
		}
	})
	/**input输入验证*/
	$('.good_num').keyup(function() {
			try {
				if (event.keyCode == "13") {
					// 回车执行查询
					$(this).parent().parent().find('.complete').click();
					return;
				}

				$(this).val($(this).val().replace(/^0|[^\d*]/g, ''));
				var ean = $(this).parent().parent().parent().parent().attr('id');
				var quantity = $(this).val();
				var requestData = {
					'product' : {
						'ean' : ean
					},
					'quantity' : quantity
				};

				updateShopcart(requestData);
				$(this).parent().parent().parent().parent().parent().find('.good_quantity').text(quantity);
				// 合计购物选中商品的价格和数量
				getPriceCount()
			} catch (err) {
				errorShow(err);
			}
		});
	function getPriceCount(){//获取总金额
		var money=0;//总金额
		$(".li-main").each(function(){
			var price=$(this).find(".good_price").text();
			var num=parseInt($(this).find(".good_quantity").text());
			var price=price*100;
			cost=(price*num)/100;
			money+=cost;
		})
		$(".money").text(money)
	}
});

/** 结算 */
function settlement() {
	if (memberProfile()) {
		try {
			var itemsCheck = $(".li-main");
			if (itemsCheck.length > 0) {
				var items = new Array();
				$.each(itemsCheck, function(i, o) {
					items.push({
						'productEAN' : $(o).attr('id'),
						'quantity' : $(o).find('.good_quantity').text()
					});
				});
				console.log(items)

				$.ajax({
					type : 'post',
					url : '/order/draft.ctrl',
					contentType : 'application/json',
					data : JSON.stringify({
						channel : "WEB",
						"items" : items
					}),
					async : false,
					dataType : 'json',
					success : function(data) {
						if (data.error) {
							errorAlert(data.error);
						} else {
							window.location.href = "selectAdress.html?draftCode=" + data.object;
						}
					}
				});
			} else {
				errorShow("请选中商品，进行结算");
			}
		} catch (err) {
			errorShow(err);
		}
	} else {
		loginShow();
	}
}