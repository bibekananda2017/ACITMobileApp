app.controller('assetSearchCtrl', function ($scope, $rootScope, $stateParams, loadingImage, AllAssetService, $window, timeoutFactory) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	console.log("Calling AssetsService",$scope);
	$scope.errorCode = "";$scope.errorMsg ="";
	loadingImage.show();
	/* $scope.logoutSession = function() {
	    	clearTimeout($rootScope.timeoutVar);
	    	$rootScope.timeoutVar = setTimeout(function(){
	    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
			$location.path('/acit');
	    	}, 600000);
		};
		$scope.logoutSession();*/
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	$scope.getAssetSearch = function()
	{
		$scope.assetSearches = [];
		$scope.errorMsg = "";
		console.log("Calling searchAssets",$scope);
		AllAssetService().then(function (activities)
		{
			
			$scope.assetSearches = activities;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});
		alert($scope.assetSearches);
		
	};
	$scope.getAssetSearch();
	$scope.$on('AllAssetService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("assetSearchCtrl",$scope);
	
	
});
 


