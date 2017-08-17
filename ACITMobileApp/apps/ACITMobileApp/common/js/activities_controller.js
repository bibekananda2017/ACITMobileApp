app.controller('activitiesCtrl', function ($scope, $rootScope, $stateParams, loadingImage, AnnouncementService, timeoutFactory) {
	$scope.errorCode = ""; $scope.errorMsg = "";
	loadingImage.show();
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	alert("Enter");
	$scope.getAnnouncements = function()
	{
		$scope.announcements = [];
		$scope.data = [];
		$scope.errorMsg = "";
		console.log("Calling AnnouncementService",$scope);
		AnnouncementService.fetchAnnouncements().then(function (announcements){
			console.log("Got Announcements---"+JSON.stringify(announcements));
			//$scope.announcements = announcements;
			
			
			for(var i = 0; i < announcements.length; i++){
    			  	var detail = announcements[i].properties.Body;
    			  	if(detail){
						//details=details.replace(/\n/g,"<br/>").replace(/[â]/g,"").replace(/[€]/g,"").replace(/[“]/g,"-").replace(/[”]/g,"-").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/><li/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"").replace( /[x93]/g,"").replace( /["]/g,"");
						detail=detail.replace(/\n/g,"<br/>").replace(/[â]/g,"").replace(/[€]/g,"").replace(/[“]/g,"-").replace(/[”]/g,"-").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/><li/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
					}else{
						detail="";
					}
    				$scope.details = detail; 
    				  
    				$scope.id = announcements[i].properties.Id;
    				var title = announcements[i].properties.Title;
    				if(title)
    					title=title.replace(/\n/g,"<br/>").replace(/[â]/g,"").replace(/[€]/g,"").replace(/[“]/g,"-").replace(/[”]/g,"-").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/><li/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
    				else
    					title="";
    				$scope.activity = title;
    				$scope.date = announcements[i].properties.Created;
    				$scope.expiry = announcements[i].properties.Expires;
    				
    				$scope.announcements.push({
						id : $scope.id,
						activity : $scope.activity,
						date : $scope.date,
						details : $scope.details,
						expiry:$scope.expiry
					});
    			  
    		}
			loadingImage.hide();
		});
	};
	$scope.getAnnouncements();
	/*$scope.$on('AnnouncementService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });*/
	console.log("activitiesCtrl",$scope);
	
	
});