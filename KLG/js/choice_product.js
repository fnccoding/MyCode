

var issuccess;
var isflase;
addListToHtml();
addXianshiToHtml();
	function addListToHtml(){/**向页面添加每一条热销商品**/
		var product=getHotProductList();
		for(var i=0;i<3;i++){
			var ean=product[i].ean;
			var name=product[i].name;
			var price=product[i].price;
			addHotProductItem(ean,name,price);
		}
	}
	function getHotProductList(){/**获取热销产品*/
		var result;
		$.ajax({
			type : 'post',
			url : "/product/listHot.ctrl",
			data : {},
			contentType : "application/json",
			async : false,
			dataType : 'json',
			success : function(data) {
			    if (data.error) {
			       	 	alert(data.error);
			    	} else {
			        	result = data.object;
			        	console.log(result)
			    	}
			    }
		});
		return result;
	}
	function addHotProductItem(ean,name,price){/**添加单条热销商品*/
		var html="";
		html+='<li id="'+ean+'">',
		html+='<div class="all" id="productone">',
		html+='<div class="hot-name">',
		html+='<img src="../store/product/'+ean+'/small_1.jpg" alt="" />',
		html+='</div>',
		html+='<div class="depict">',
		html+='<span class="depict-name">'+name+'</span>',
		html+='<span class="wb">旺币<span class="wb_price">'+price+'</span></span>',
		html+='</div>',
		html+='</div>',
		html+='</li>';
		$(".hot-list").append(html);
	};



	function addXianshiToHtml(){/**向页面添加限时商品*/
		var product=getXianshiList();
		var num= product.length > 3 ? 3 : product.length;
		for(var i=0;i<num;i++){
			var ean=product[i].ean;
			var name=product[i].name;
			var price=product[i].price;
			addLimitProductItem(ean,name,price);
		};
		var hope=3-num;
		if(hope>0){
			for(var i=0;i<hope;i++){
				addHopeProduct();
			}
		}
	}
	function getXianshiList(){/**获取限时商品**/
		var result;
		$.ajax({
			type : 'post',
			url : "/product/listNew.ctrl",
			data : {},
			contentType : "application/json",
			async : false,
			dataType : 'json',
			success : function(data) {
			    if (data.error) {
			       	 	alert(data.error);
			    	} else {
			        	result = data.object;
			        	console.log(result)
			    	}
			    }
		});
		return result;
	}
	function addHopeProduct(){/**限时商品不足三个时，用敬请期待替代**/
		var html = "";
		html +='<li class="limit-all">',
		html +='<div class="limit-name">',
		html +='<img src="images/wz.png" alt="" />',
		html +='</div>',
		html +='<div class="limit-depict hope_box">',
		html +='<span class="hope">敬请期待</span>',
		html +='</div>',
		html +='</li>';
		$(".limit-list").append(html);
	};
	function addLimitProductItem(ean,name,price){/**添加限时商品单条限时商品***/
		var html = "";
		html += '<li id="'+ean+'">',
		html +='<div class="limit-all" id="productfour">',
		html +='<div class="limit-name">',
		html +='<img src="../store/product/'+ean+'/small_2.jpg" alt="" />',
		html +='</div>',
		html +='<div class="limit-depict">',
		html +='<span class="limit-good-name">'+name+'</span>',
		html +='<span class="Wb">旺币<span class="Wb_price">'+price+'</span><s>旺币<span class="Wb_pre-price">'+price+'</span></s></span>',
		html +='<span class="surplus">剩余<span class="surplus_num">768</span>件</span>',
		html +='</div>',
		html +='</div>',
		html +='</li>';
		$(".limit-list").append(html);
	
	}


$(function(){
	$(".hot-list li").click(function(){
		if($(this).attr("class")=="hot-active"){
			$(this).removeClass("hot-active");
			$(this).find(".true").remove();
		}else{
			$(this).addClass("hot-active");
			var html='<div class="true"><img src="images/true.png" alt=""></div>';
			$(this).append(html);
		}
	})

	$(".limit-list li").click(function(){
		if($(this).attr("class")=="limit-active"){
			$(this).removeClass("limit-active");
			$(this).find(".truth").remove();
		}else{
			$(this).addClass("limit-active");
			var html='<div class="truth"><div class="limit-bg"><img src="images/bg021.png" alt=""></div><div class="true"><img src="images/true.png" alt=""></div></div>';
			$(this).append(html);
		}
	});
	$("#addCat").click(function(){
		addCats();
	})
	function addCats(){/**添加购物车**/
		if(memberProfile()){
			var hotbeChecked = $(".hot-active");
			if (hotbeChecked.length > 0){
				$.each(hotbeChecked, function(i, o) {
					var productEan=$(this).attr("id");
					addShopcart(productEan,1);
				});
			}
			var xianshibeChecked = $(".limit-active");
			if (xianshibeChecked.length > 0){
				$.each(xianshibeChecked, function(i, o) {
					var productEan=$(this).attr("id");
					addShopcart(productEan,1);
				});
			}
			if(issuccess){
				window.location.href="ensureorder.html";
			}
			
		} else {
			loginShow();
			addCats();
		}
	}
	
});




/**更改购物车*/
function addShopcart(productEan,num) {
	issuccess=0;
	var requestData = {
		'product' : {
			'ean' : productEan
		},
		'quantity' : num
	};
	$.ajax({
		type : 'post',
		url : '/cart/updateItem.ctrl',
		data : JSON.stringify(requestData),
		contentType : 'application/json',
		async : false,
		dataType : 'json',
		success : function(data) {
			if (data.error) {
				errorShow(data.error,null);
			}else if(num!=0){
				issuccess=1;
			}else{
				
			}
		}
	});
}