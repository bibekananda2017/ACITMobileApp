app.controller('assetDetailsCtrl', function ($scope, $rootScope, $stateParams, loadingImage, AssetsByid, timeoutFactory,LoginService,ACITMobileApp) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	  loadingImage.show();
	/*  $scope.logoutSession = function() {
	    	clearTimeout($rootScope.timeoutVar);
	    	$rootScope.timeoutVar = setTimeout(function(){
	    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
			$location.path('/acit');
	    	}, 600000);
		};
		$scope.logoutSession();	*/
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	var iterationCount = 1000;
	var keySize = 128;
	//var plaintext = $scope.uid;
    var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    
    var aesUtil = new AesUtil(keySize, iterationCount);
    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getUserId());
    var encryptedPassword = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getPassword());
	$scope.getAssets = function(id)
	{
		console.log("Calling id"+id);
		$scope.name = "";
		$scope.details ="";
		$scope.sbFlg = "";
		$scope.sbid ="";
		$scope.errorMsg = "";
		//alert("Enter inside asset details---"+$stateParams.id);
		console.log("Calling AssetsService");
		LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
			//loadingImage.hide();
			console.log("Asset id is 1---"+$stateParams.id);
			console.log("Asset id is 1---"+id);
	    	var response = result.Response.body;
	    	console.log("Asset id is 2---"+response);
	    	var responseText = response
	    	console.log("responseText id is---"+responseText);
	    	if(responseText == "true"){
	    		AssetsByid.getAssetByID(responseText,id).then(function (assets)
				{
					assets = angular.fromJson(assets.Response.body);
					//console.log("Got Assets"+JSON.stringify(assets));
					$scope.name = assets[0].Asset_Name;//$stateParams.name;
					$scope.details =assets[0].Asset_Desc ;//$stateParams.description;
					$scope.sbFlg = assets[0].Solution_Brief;
					if("T"==$scope.sbFlg){
						$scope.sbid=assets[0].Solution_Brief_Id;
					}
					
					$scope.$broadcast('scroll.refreshComplete');
					$scope.errorMsg = "";
					loadingImage.hide();
				});
	    	}else{
	    		//alert("false");
	    		loadingImage.hide();
	    	}
	    	
	    });
		
	};
	
	$scope.getAssets($stateParams.id);
	
    $scope.downLink = function(link) {
    	
    	var url="https://acitmobileappservice.mybluemix.net/sbs?id="+$scope.sbid;
    	if(WL.Environment.IPHONE==WL.Client.getEnvironment() ||WL.Environment.IPAD==WL.Client.getEnvironment()){
    		WL.App.openURL(url, '_blank');
    		console.log(url); 
    	}else{
    	//var url=window.location.protocol+"//"+window.location.hostname+"/SolutionBrief/sbs?id="+$scope.sbid;    
    	console.log(url);    
    	var ref = window.open("https://docs.google.com/viewer?url="+url, '_system', 'location=yes,closebuttoncaption=Close,enableViewportScale=yes');    	
    	ref.addEventListener('loadstart', function(event) { console.log('start: ' + event.url); });
        ref.addEventListener('loadstop', function(event) { console.log('stop: ' + event.url); });
        ref.addEventListener('loaderror', function(event) { console.log('error: ' + event.message); });
        ref.addEventListener('exit', function(event) { console.log(event.type);console.log(event); });
    	}
	};

});