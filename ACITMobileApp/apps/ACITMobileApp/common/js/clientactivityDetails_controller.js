app.controller('clientactivityDetailsCtrl', function ($scope, $rootScope, $stateParams, loadingImage, ClientActivityService, timeoutFactory) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	$scope.errorCode = "";$scope.errorMsg ="";
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
	$scope.getClientActivityDetails = function()
	{
		$scope.errorMsg = "";
		console.log("Calling ClientActivityService",$scope);
		ClientActivityService.fetchClientDetails("true").then(function(clientActivities) {
	    	//alert("Success--"+JSON.stringify(clientActivities));
			console.log("Got clientActivities",clientActivities);
			clientActivities = angular.fromJson(clientActivities.Response.body);
			for(var i = 0; i < clientActivities.length; i++){
      			  if(clientActivities[i].ID == $stateParams.id){
      				  
      				var detail = clientActivities[i].details;
      				if (null != detail) {
    					if (detail.charAt(0) =='?') {
    						detail =
    							detail
    							.substr(
    								1,
    								detail
    								.length -
    								1);
    					}
    					detail =
    						detail.replace(
    							/<.*?>/g,
    							"").replace(
    							/\n/g,
    							"\\n")
    						.replace(
    							/\r/g,
    							"").replace(
    							/\s{2,}/g,
    							' ');


    				} else {
    					detail = "";
    				}

      				detail=detail.replace(/\\n/g,"<br/>");
      				$scope.details =detail;
      				
      				var product = clientActivities[i].product;
      				product=product.replace(/[^a-zA-Z ]/g, "");
      				$scope.product =product;
      				
      				
      				
      				var product = clientActivities[i].product;
      				var product = product.split('#').filter(function(string){return isNaN(parseInt(string))}).join('');
      				$scope.product =product;

      				      				
      				$scope.client = clientActivities[i].Client; 
      				$scope.project = clientActivities[i].Project;
      				$scope.requestType = clientActivities[i].request_type; 
      				$scope.contactName = clientActivities[i].Contact_Name; 
      				$scope.product = clientActivities[i].product;
      				$scope.dateLastContacted = clientActivities[i].Date_Last_Contacted;
      				 
      				console.log("Calling ClientActivityService",$stateParams.id+" "+clientActivities[i].details);
      			  }
      			  
      		  }
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
	    });
		/*ClientActivityService().then(function (clientActivities){
			console.log("Got clientActivities",clientActivities);
			for(var i = 0; i < clientActivities.length; i++){
      			  if(clientActivities[i].ID == $stateParams.id){
      				  
      				var detail = clientActivities[i].details;
      				detail=detail.replace(/\\n/g,"<br/>");
      				$scope.details =detail;
      				
      				var product = clientActivities[i].product;
      				product=product.replace(/[^a-zA-Z ]/g, "");
      				$scope.product =product;
      				
      				
      				
      				var product = clientActivities[i].product;
      				var product = product.split('#').filter(function(string){return isNaN(parseInt(string))}).join('');
      				$scope.product =product;

      				      				
      				$scope.client = clientActivities[i].Client; 
      				$scope.project = clientActivities[i].Project;
      				$scope.requestType = clientActivities[i].request_type; 
      				$scope.contactName = clientActivities[i].Contact_Name; 
      				$scope.product = clientActivities[i].product;
      				$scope.dateLastContacted = clientActivities[i].Date_Last_Contacted;
      				 
      				console.log("Calling ClientActivityService",$stateParams.id+" "+clientActivities[i].details);
      			  }
      			  
      		  }
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});*/
	};
	$scope.getClientActivityDetails();
	$scope.$on('ClientActivityService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("clientactivityDetailsCtrl",$scope);
	
});