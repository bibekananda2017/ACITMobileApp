app.controller('productAssetsCtrl', function ($scope, $rootScope, $stateParams, $location, AssetsService, loadingImage, timeoutFactory) {
	
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
	$scope.getAssets = function()
	{
		$scope.products = [];
		$scope.errorMsg = "";
		console.log("Calling AssetsService",$scope);
		AssetsService.getProductAssets($stateParams.id).then(function (assets)
		{
			console.log("Got Assets",assets[0].Asset);
			$scope.assets = assets[0].Asset;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
		    loadingImage.hide();
		});
	};
	$scope.getAssets();
	$scope.$on('AssetsService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    loadingImage.hide();
	    $scope.$broadcast('scroll.refreshComplete');
	 });
	console.log("productAssetsCtrl",$scope);
	
	$scope.showDetails = function(name,details){
		console.log("NAME "+name);
		console.log("DETAILS "+details.replace(/,/g , " "));
		$location.path('/acit/assets/details/'+name+','+details.replace(/,/g , " "));
	};
});