app.controller('activityDetailsCtrl', function ($scope, $rootScope, $stateParams, loadingImage, AnnouncementService, timeoutFactory) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	$scope.errorCode = "";$scope.errorMsg = "";
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
	$scope.getAnnouncementDetails = function()
	{
		$scope.errorMsg = "";
		console.log("Calling AnnouncementService",$scope);
		AnnouncementService.fetchAnnouncements().then(function (announcements)
		{
			console.log("Got Announcements",announcements);
			for(var i = 0; i < announcements.length; i++){
      			  if(announcements[i].properties.Id == $stateParams.id){
      				var detail = announcements[i].properties.Body;
      				//detail=detail.replace(/\n/g,"<br/>").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
      				$scope.details = detail; 
      				  
      				/*$scope.details = announcements[i].details;*/
      				$scope.activity = announcements[i].properties.Title; 
      				$scope.date = announcements[i].properties.Created;
      				$scope.expiry = announcements[i].properties.Expires;
      				
      			  }
      			  
      		  }
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});
	};
	$scope.getAnnouncementDetails();
	/*$scope.$on('AnnouncementService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("activityDetailsCtrl",$scope);*/
	
	
	
});