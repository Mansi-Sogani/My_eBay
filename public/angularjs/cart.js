var app= angular.module("ebay",[]);
app.controller('addtocart',['$scope','$http',function($scope,$http){
	
	$scope.addtocart = function(items){
		$http({
	        url:'/addtocart',
	        method:"POST",
	        data : {
	          items : items
	        }
	      }).success(function(data){
	    	  console.log("in success");
	    	  console.log(data);
	    	  if(data==="womenclothing"){
	    		  window.location.assign("/womenclothing");
	    	  }
	    	  });
	    	  
	};  
	$scope.getData=function(){
		$http({
			url:'/getdata',
			method:"post",
			data:{
				
			}
		}).success(function(data){
	    	  console.log("in success");
	    	  console.log(data);
	    	  if(data.productlist){
	    		  // add location.assign
	    		  $scope.productlist= data.productlist;
	    	//	  $scope.total = data.total;
	    	  //}
	    	  }
		});
	};
	
	
}]);

app.controller('getcart',['$scope','$http',function($scope,$http){

	var total=0; 
	$scope.person;
	$scope.cartdata;
	//$scope.userlist;
	$scope.getcartdata= function(){
		$http({
			url:'/getcartdata',
			method:"post",
			data:{
				
			}
		}).success(function(data){
	    	  console.log("in success");
	    	  console.log(data);
	    	  if(data.userlist){
	    		  console.log(JSON.stringify(data.userlist));
	    		  $scope.cartdata=data.userlist;
	    		  console.log("This is cartdata:----");
	    		  console.log(JSON.stringify($scope.cartdata));
	    		  
	    		  $scope.userlist=data.userlist;
	    	  //$scope.total = 0;
	    	  //}
	    	  }
		});
	};
	
	$scope.getvalues=function(x){
		console.log("Changed function called:");
		var price= x.itemprice;
		var quantity = this.number;
		var subtotal;		
		
		if(quantity===1){
			subtotal=0;
			console.log("Inside if");
			 subtotal= price * quantity;
			 this.subtotal = subtotal;
		}
		else{
			console.log("inside else");
			subtotal=+price;
			this.subtotal = subtotal;
			
		}
		console.log(subtotal);
		total+=subtotal;
		$scope.total=total;
		for(var k=0;k<$scope.cartdata.length;k++){
		if($scope.cartdata[k].itemid=== x.itemid){
			$scope.cartdata[k].quantityneeded= quantity;
			console.log("this is the changed quantity in ng-change function"+ $scope.cartdata[k].quantityneeded);
		}
		}
		
	};
	$scope.removeitemfromcart=function(x){
		console.log("Inside remove items");
			 x=x;
			 var n = this.number;
			 console.log("this is the value of quantity:" + n);
			 console.log("Before doing anything in removing items:---"+ JSON.stringify($scope.cartdata));
   			 var cartdata=$scope.cartdata;
   			 var total=$scope.total;
   			 console.log("this is total before splicing:" +total);
   		 console.log(JSON.stringify(cartdata));
   		for(var i =0; i<cartdata.length;i++){
   			if(cartdata[i].itemid === x.itemid){
   				console.log("Its Working @" + i);
   				 total=total-cartdata[i].itemprice;
   			console.log("this is total after splicing:" +total);
   				cartdata.splice(i,1);
   			}
   		}
   		console.log("After splicing:");
   		console.log(cartdata);
   		 $scope.cartdata=cartdata;
   		 console.log("cartdata after splaicing:" + JSON.stringify($scope.cartdata));
   		$scope.total = total;
	};
	
	$scope.proceedtocheckout=function(){
		console.log("sending request to /checkoutdata");
		//console.log("I m printing cart data after clicking on proceedtocart"+ cartdata);
		//console.log("this is the changed value:-----" + $scope.cartdata[0].quantityneeded);
		$http({
			url:'/checkoutdata',
			method:'post',
			data:{
					cartdata:$scope.cartdata
				}
		}).success(function(data){ 
			
			console.log(JSON.stringify(data));
			window.location.assign("/checkout");
			
			
		});
	};
	
	$scope.checkoutdisplay= function(){
		console.log("calling checkoutdisplay");
		$http({
			url:'/checkoutdisplay',
			method:'post',
			data:{
				
			}
		}).success(function(data){
			console.log("i m in success of displaycheckout");
			console.log(JSON.stringify(data));
			$scope.user=data.user;
			$scope.person=data.user;
			$scope.items = data.itemlist;
		});
	};
	
	$scope.creditcarddetails=function(){
		$scope.message = false;
		console.log("I m inside creditcarddetails");
		$http({
			url:'/loadcarddetails',
			method: 'get',
			data:{
				
			}
		}).success(function(data){
			console.log("I m in credit card details angular function");
			if(data === "Enter credit card details"){
				$scope.msg=data;
				$scope.message = true;
			}
			else{
				console.log(JSON.stringify(data.card[0].cardnumber));
				$scope.cardnumber=data.card[0].cardnumber;
				$scope.date=data.card[0].date;
				$scope.cvv=data.card[0].cvv;
				$scope.firstname=$scope.person[0].firstname;
				$scope.lastname=$scope.person[0].lastname;
				$scope.address= $scope.person[0].address;
				}
		});
	};
}]);