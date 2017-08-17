app.controller('assetsLandingCtrl', function($scope, $rootScope, $state, $stateParams, $filter, $location,LoginService,ACITMobileApp,AllAssetProductService,AssetService,ProductService,loadingImage,$ionicModal, timeoutFactory) {
	$scope.goBack = function() {
		  window.history.back();
	};

    $scope.errorCode = "";
    $scope.errorMsg = "";
	loadingImage.show();
  /*  $scope.logoutSession = function() {
    	clearTimeout($rootScope.timeoutVar);
    	$rootScope.timeoutVar = setTimeout(function(){
    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$location.path('/acit');
    	}, 600000);
	};
	$scope.logoutSession();*/
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	$scope.overlayHeight = document.documentElement.clientHeight * (4/5) + "px";
	var iterationCount = 1000;
	var keySize = 128;
	//var plaintext = $scope.uid;
    var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    
    var aesUtil = new AesUtil(keySize, iterationCount);
    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getUserId());
    var encryptedPassword = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getPassword());
    //added newly - Gopal Rengaraj
    $scope.getAssetProduct = function(isAuthenticated) {
        //$scope.products = [];
        //$scope.assets = [];
        //$scope.recentAssets = [];
        $scope.errorMsg = "";
        //alert("Enter---");
        //console.log("Calling Assets & Product Service", $scope);
        AssetService.fetchAllAssets(isAuthenticated).then(function(result) {
        	
        	 $scope.assets = angular.fromJson(result.Response.body);
        	 $scope.recentAssets = angular.fromJson(result.Response.body);
        	 //alert($scope.recentAssets);
        	 //alert($scope.assets);
        	 //alert($scope.recentAssets);
        	 //console.log("assets is---"+$scope.assets);
        	 //console.log("recentAssets is---"+$scope.recentAssets);
        	 $scope.solutionBriefs = $filter('filter')($scope.assets, {
                 Solution_Brief: "T"
             });
        	 $scope.solutionBriefs =angular.fromJson($scope.solutionBriefs);
        	 //alert(JSON.stringify($scope.solutionBriefs));
        	 ProductService.fetchAllProducts(isAuthenticated).then(function(result) {
             	//console.log("product is---"+JSON.stringify($scope.assets));
              	$scope.products = angular.fromJson(result.Response.body);
              	//console.log("product is---"+JSON.stringify($scope.products));
              	 $scope.selectedProduct = $filter('filter')($scope.products, {
                     Product_Id: $stateParams.id
                 })[0];
                 $scope.productItem = $stateParams.id;
                 loadingImage.hide();
              });
        });
       
        
        
        

        //Code for Product landing page 
       
               

        /*AllAssetProductService().then(function(result) {
            console.log("Got Assets & Product", result);
            console.log("Prod detaisl", result.products);

            $scope.products = result.products;
            var assetsTemp = result.assets;
            var productTemp = result.products;
            $scope.assets = assetsTemp;
            $scope.recentAssets = assetsTemp;
            $scope.solutionBriefs = $filter('filter')(assetsTemp, {
                Solution_Brief: "T"
            });
            $scope.$broadcast('scroll.refreshComplete');
            $scope.errorMsg = "";

            //Code for Product landing page 
           
            $scope.selectedProduct = $filter('filter')(productTemp, {
                Product_Id: $stateParams.id
            })[0];
            $scope.productItem = $stateParams.id;
            loadingImage.hide();
        });*/
    };
    LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
		//loadingImage.hide();
    	var response = JSON.stringify(result.Response.body);
    	var responseText = response.substring(1,response.length-1);
    	if(responseText == "true"){
    		$scope.getAssetProduct(responseText);
    	}else{
    		//alert("false");
    		loadingImage.hide();
    	}
    	
    });
    //$scope.getAssetProduct("true");
    $scope.myAsset = "Select Product";

    
    $scope.assetSearchProcess = function(product) {
    	$state.go("acit-menu.asset-search");
    };
    
    
    //redirect from products page
    $scope.selectProduct = function(product) {
    
        if ("" != product || null != product) {
            $state.go("acit-menu.assets-filter", {
                id: product
            });
        }
    };

    //global asset search
    $scope.searchAssets = function(pattern) {
        console.log(pattern);
        $scope.solutionBriefs = $filter('search')($scope.solutionBriefs, pattern);
    };

    //drop-down overlay
    $ionicModal.fromTemplateUrl('./views/assets-dropdown.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'fade-in'
    });

    //error handling
    $scope.$on('AllAssetProductService', function(event, error) {
        $scope.errorCode = error.errorCode;
        $scope.errorMsg = error.errorMsg;
        $scope.$broadcast('scroll.refreshComplete');
        loadingImage.hide();
    });
    

});


app.filter('search', function() {
    return function(assets, pattern) {
        var result = [];
        for (var ik = 0; ik < assets.length; ik++) {
            var ast = assets[ik];
            console.log(ast);
            pattern = pattern.toLowerCase();
            var desc = ast.Asset_Desc.toLowerCase();
            var name = ast.Asset_Name.toLowerCase();
            //var patt = new RegExp(pattern);
            console.log(desc.match(pattern) || name.match(pattern));
            if (desc.match(pattern) || name.match(pattern)) {
                result.push(ast);
            };
        }
        return result;
    };
});


app.filter('productAsst', function() {
    return function (assets,prodId){
    	var productAssets=[];
    	for (var io=0; io<assets.length; io++){
    	    for (var jk=0; jk< assets[io].Product_Id.length; jk++){
    	        if( assets[io].Product_Id[jk]==prodId){
    	            productAssets.push(assets[io]);
    	            }
    	    }
    	}
    	return productAssets;
    };

});