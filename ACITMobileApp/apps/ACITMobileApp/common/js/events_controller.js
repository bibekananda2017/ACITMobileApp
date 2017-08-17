app.controller('eventsCtrl', function ($scope,  $rootScope, $stateParams, loadingImage, EventsService, timeoutFactory) {
	
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
	$scope.events = [];
	timeoutFactory.clearTimeOut();
	timeoutFactory.setTimeOut();
	//$scope.events = EventsService.fetchEvents();
	//console.log("eventsCtrl",JSON.stringify($scope.events));
	EventsService.fetchEvents() 
	
	   .then(function(data) {
		   console.log("eventsCtrl  221----"+JSON.stringify(data));
		   //$scope.events = event;
		   //console.log("Got Events",events);
			
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
				console.log("dateCompareValue is----"+dateCompareValue);
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
			console.log("Result is----"+JSON.stringify($scope.events));
			loadingImage.hide();
	   });
    //$scope.getEvents();
	/*$scope.getEvents = function()
	{
		
		$scope.errorMsg = "";
		console.log("Calling EventsService",$scope);
		$scope.events = EventsService.fetchEvents();
		loadingImage.hide();
		EventsService().fetchEvents().then(function(events)
		{
			console.log("Got Events",events);
			$scope.events = events;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});
		return $scope.events;
	};
	$scope.events = $scope.getEvents();*/
	
	/*$scope.$on('EventsService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });*/
	
	function compareDateString(today,eventDate){
		var todayDate = today.substring(8,10);
		var todayMonth = today.substring(5,7);
		var todayYear = today.substring(0,4);
		
		var eventDte = eventDate.substring(8,10);
		var eventMnth = eventDate.substring(5,7);
		var eventYear = eventDate.substring(0,4);
		
		if(todayDate == eventDte && todayMonth==eventMnth && todayYear == eventYear){
			return 0;
		}
		if(eventYear > todayYear){
			return 1;
		}
		else if(eventYear == todayYear){
			if(eventMnth > todayMonth)
				return 1;
			else if(eventMnth == todayMonth){
				if(eventDte > todayDate)
					return 1;
				else
					return -1;
			}else{
				return -1;
			}
				
		}else{
			return -1;
		}
	}
	
});