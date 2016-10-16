var app = angular.module('mylogin',[]);

app.controller('login',['$scope','$http','$window',function($scope,$http,$window){
	
	$scope.invalid_login = true;
	$scope.unexpected_error = true;
	$scope.error_register =true;
	$scope.success_register = true;
	
	$scope.submit= function(){
		//console.log("hi");
	
		$http({
			"method":"POST",
			"url":"/aftersignin",	
			"headers": {
			    "content-type": "application/json"
			   },
			"data":{
				"username" : $scope.username,
				"password" : $scope.password
			}
		}).success(function(response){
			console.log("Hi1");
			console.log(response.status);
			if(response.status == 200){
				$window.location.assign('/homepage');
			}
			else{
				console.log("hi mansi");
				$scope.invalid_login = false;
				$scope.unexpected_error = true;
				
				}
		}).error(function(error){
			console.log("from error");
			$scope.invalid_login = false;
			$scope.unexpected_error = true;
		});
	};
	$scope.register= function(){
		//console.log("hi");
	
		$http({
			"method":"POST",
			"url":"/save",	
			"headers": {
			    "content-type": "application/json"
			   },
			"data":{
				"email" : $scope.email1,
				"password" : $scope.password1,
				"firstname":$scope.firstname,
				"lastname":$scope.lastname,
				"mobile": $scope.mobile
			}
		}).success(function(response){
			console.log("Hi1");
			console.log(response.status);
			if(response.status == 200){
				$scope.success_register = false;
				$window.location.assign('/homepage');
			}
			else{
				$scope.error_register =false;
				}
		}).error(function(error){
			console.log("from error");
			$scope.invalid_login = false;
			$scope.unexpected_error = true;
		});
	};
}]);