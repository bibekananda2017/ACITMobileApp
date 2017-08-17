app.controller('clientActivitiesCtrl', function ($scope, $rootScope, $stateParams,LoginService, ClientActivityService,ACITMobileApp,loadingImage, $window, timeoutFactory) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	/*$scope.logoutSession = function() {
    	clearTimeout($rootScope.timeoutVar);
    	$rootScope.timeoutVar = setTimeout(function(){
    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$location.path('/acit');
    	}, 600000);
	};
	$scope.logoutSession();*/
	  var iterationCount = 1000;
		var keySize = 128;
		//var plaintext = $scope.uid;
	    var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
	    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
	    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
	    
	    var aesUtil = new AesUtil(keySize, iterationCount);
	    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getUserId());
	    var encryptedPassword = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getPassword());
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	console.log("Calling clientActivitiesService",$scope);
	$scope.errorCode = "";$scope.errorMsg ="";
	loadingImage.show();
	$scope.getClientActivities = function(isAuthenticated)
	{
		$scope.clientActivities = [];
		$scope.errorMsg = "";
		console.log("Calling ClientActivity",$scope);
		/*ClientActivityService().then(function (activities)
		{
			console.log("Got Events",activities);
			$scope.clientActivities = activities;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});*/
		ClientActivityService.fetchClientDetails(isAuthenticated).then(function(result) {
	    	//alert("Success");
			//console.log("Result is---->"+JSON.stringify(result));
	    	
	    	$scope.clientActivities = angular.fromJson(result.Response.body);
	    	loadingImage.hide();
	    });
		
	};
	LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
		//loadingImage.hide();
    	var response = JSON.stringify(result.Response.body);
    	var responseText = response.substring(1,response.length-1);
    	if(responseText == "true"){
    		$scope.getClientActivities(responseText);
    	}else{
    		//alert("false");
    		loadingImage.hide();
    	}
    	
    });
	//$scope.getClientActivities();
	$scope.$on('ClientActivityService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("clientActivitiesCtrl",$scope);
	
});
 


