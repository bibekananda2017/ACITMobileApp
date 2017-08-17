app.controller('productsCtrl', function ($scope, $rootScope, $stateParams, ProductsService, loadingImage, timeoutFactory) {
	
	$scope.errorCode = ""; $scope.errorMsg = "";
    loadingImage.show();
	/*$scope.logoutSession = function() {
    	clearTimeout($rootScope.timeoutVar);
    	$rootScope.timeoutVar = setTimeout(function(){
    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$location.path('/acit');
    	}, 600000);
	};
	$scope.logoutSession();*/
    timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	$scope.getProducts = function()
	{
		$scope.products = [];
		$scope.errorMsg = "";
		console.log("Calling ProductsService",$scope);
		ProductsService().then(function (products)
		{
			console.log("Got Products",products);
			$scope.products = products;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
		    loadingImage.hide();
		});
	};
	$scope.getProducts();
	$scope.$on('ProductsService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("productsCtrl",$scope);
});