app.controller('eventsDetailsCtrl', function ($scope, $rootScope, $stateParams, loadingImage,  EventsService, timeoutFactory) {
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
	$scope.events = [];
	$scope.getEventDetails = function()
	{
		$scope.errorMsg = "";
		console.log("Calling EventService",$scope);
		EventsService.fetchEvents().then(function(data) {
			var response = data;
			console.log("Enetr inside 12---"+response);
			var x2js = new X2JS();
			var courses  = x2js.xml_str2json(response);
			var todos =courses.feed.entry;
			/*var result ={
					event : []			
			};*/
			//var result =[];
			for(var i = 0; i < todos.length;i++){
				console.log("$scope.todos[0]---"+(todos[i].content.properties.Title.__text));
				var title = todos[i].content.properties.Title.__text;
				title=title.replace(/\n/g,"<br/>").replace(/[â]/g,"").replace(/[€]/g,"").replace(/[“]/g,"-").replace(/[”]/g,"-").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/><li/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
				console.log("$scope.todos[1]---"+(todos[i].content.properties.Id.__text));
				var id = todos[i].content.properties.Id.__text;
				console.log("$scope.todos[2]---"+(todos[i].content.properties.Description.__text));
				var details = todos[i].content.properties.Description.__text;
				console.log("$scope.todos[3]---"+(todos[i].content.properties.EventDate.__text));
				var eventStrDate = todos[i].content.properties.EventDate.__text;
				console.log("$scope.todos[4]---"+(todos[i].content.properties.EndDate.__text));
				var eventEndDate =todos[i].content.properties.EndDate.__text;
				console.log("$scope.todos[5]---"+(todos[i].content.properties.Location.__text));
				var location=todos[i].content.properties.Location.__text;
				console.log("$scope.todos[6]---"+(todos[i].content.properties.Created.__text));
				var dateStr = todos[i].content.properties.Created.__text;
				
				var today = new Date();
				console.log("Today is----"+today.toISOString().substring(0,10));
				console.log("strat date is----"+eventStrDate.substring(0,10));
				var dateCompareValue = compareDateString(today.toISOString().substring(0,10),eventStrDate.substring(0,10));
				//if(dateCompareValue == 0 || dateCompareValue == 1){
				   $scope.events.push({
						id : id,
						event : title,
						date : eventStrDate,
						details : details,
						eventStrDate:eventStrDate,
						eventEndDate:eventEndDate,
						location:location
					});
				//}
			}
			
			for(var i = 0; i < $scope.events.length; i++){
    			  if($scope.events[i].id == $stateParams.id){
    				var detail = $scope.events[i].details;
    				//detail=detail.replace(/\n/g,"<br/>").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
    				$scope.details =detail;      				  
    				  
    				/*$scope.details = events[i].details;*/
    				$scope.event = $scope.events[i].event; 
    				$scope.date = $scope.events[i].date;
    				$scope.eventStrDate = $scope.events[i].eventStrDate;
    				$scope.eventEndDate = $scope.events[i].eventEndDate;
    				$scope.location = $scope.events[i].location;
    				
    			  }
    			  
    		  }
			loadingImage.hide();
		});
		/*EventsService().then(function (events)
		{
			console.log("Got Events",events);
			for(var i = 0; i < events.length; i++){
      			  if(events[i].id == $stateParams.id){
      				var detail = events[i].details;
      				//detail=detail.replace(/\n/g,"<br/>").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
      				$scope.details =detail;      				  
      				  
      				$scope.details = events[i].details;
      				$scope.event = events[i].event; 
      				$scope.date = events[i].date;
      				$scope.eventStrDate = events[i].eventStrDate;
      				$scope.eventEndDate = events[i].eventEndDate;
      				$scope.location = events[i].location;
      				
      			  }
      			  
      		  }
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});*/
	};
	$scope.getEventDetails();
	$scope.$on('EventsService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("eventsDetailsCtrl",$scope);
	
});