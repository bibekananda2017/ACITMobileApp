app.controller('subCtrl', function ($scope, $rootScope, $stateParams,GetSubscriptionService,RemoveUserSubscriptions,AddSubscriptionService,loadingImage, timeoutFactory) {

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
	var deviceID = localStorage.getItem("deviceID");
	//var isSubscribed = localStorage.getItem("isSubscribe");
	//var deviceID = '55558e561fde007c80210182';
	$scope.getSubs = function()
	{
		$scope.Subscription = [];
		$scope.errorMsg = "";
		console.log("Calling Subscription",$scope);
		
		if(deviceID != null || deviceID != undefined){    
			GetSubscriptionService(deviceID).then(function (subs)
					{
						
						console.log("Got Events",subs);
						$scope.Subscription = $scope.transform(subs);
						$scope.$broadcast('scroll.refreshComplete');
						$scope.errorMsg = "";
						loadingImage.hide();
					
					});
			

    		}else{
    			//var error={errorCode:121,errorMsg:};
    			 $scope.errorCode = 121;
    			 $scope.errorMsg = "Device id could not be retrieved";
    			 loadingImage.hide();
		};
	};
	$scope.getSubs();
	
	$scope.$on('GetSubscriptionService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	console.log("GetSubscriptionService",$scope);
	
	$scope.transform=function(subs){
		var res, tags,subscriptions;
		res=[];
		tags =subs.tags;
		subscriptions=subs.subscriptions;
		var flgChecked =false;
		//console.log(subscriptions[0].tagName==tags[1].name);
		for(var isub=0; isub<tags.length ;isub++){
			for(var isubscript=0;subs.subscriptions!=undefined && isubscript<subscriptions.length;isubscript++ ){		          
	        if(tags[isub].name == subscriptions[isubscript].tagName){
	        	flgChecked= true;
			          }
				}
			/*if(subscriptions.length==0 && isSubscribed==null){

                localStorage.setItem("isSubscribe","true");

                flgChecked= true;

                $scope.changeHandler(tags[isub].name,flgChecked);

			}*/

			res.push({ text: tags[isub].name, checked: flgChecked });
			flgChecked =false;
			}		
		console.log(res);
		return res;
	};
	
	$scope.changeHandler = function(inp,sta){
		console.log(inp +sta);
		if(sta){
				AddSubscriptionService(inp,deviceID).then(function(result){
					console.log(result);
				});
		}else{
			RemoveUserSubscriptions(inp,deviceID).then(function(result){
				console.log(result);
			});
		}
	};

});

app.controller('msgCtrl', function ($scope, $stateParams, $location, $state, $http, loadingImage, $ionicScrollDelegate) {
	
	//$scope.$watch('chatMessages', $scope.getMsg());
	//$httpProvider.defaults.headers.common['Access-Control-Allow-Origin'] = '*';
	$http.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
	$scope.entrIdName = WL.Client.getUserName("LDAPRealm");
	$scope.counter = 0;
	$scope.getMsg = function () {
		$http({
			  method: 'POST',
			  url: 'https://slack.com/api/channels.history?token=xoxp-12628491799-20869731683-22134509059-a80605b190&channel=C0N3XS4UB&count=1000',
			  headers : {
				  'Content-Type' : 'application/x-www-form-urlencoded;charset=utf-8'
              }
			}).then(function successCallback(response) {
				$scope.leng = response.data.messages.length;
				
				//console.log(response.data);
				var date = new Date(response.data.messages[0].ts*1000);
				var hours = date.getHours();
				// Minutes part from the timestamp
				var minutes = "0" + date.getMinutes();
				// Seconds part from the timestamp
				var seconds = "0" + date.getSeconds();
				$scope.datee = hours + ':' + minutes.substr(-2) + ':' + seconds.substr(-2);
				if($scope.datee!=$scope.oldDate){
					$scope.chatMessages = response.data.messages;
					setTimeout(function(){ $ionicScrollDelegate.scrollBottom(1); }, 200);
					console.log("Db Updates");
				}else{
					console.log("No Db Updates");
				}
				$scope.oldDate = $scope.datee;	
				if($scope.counter==0){
					$ionicScrollDelegate.scrollBottom();
				}else if($scope.counter==2){
					setTimeout(function(){ $ionicScrollDelegate.scrollBottom(1); }, 200);
				}else{
					
				}
				$scope.counter = 1;
			  }, function errorCallback(response) {
				  console.log(JSON.stringify(response));
			  });		
		}
		/*
		$scope.$watch('chatMessages', function() {
			//console.log(Object.keys(JSON.stringify($scope.chatMessages)).length);
			$scope.getMsg();
		}, true);
		*/
		
		setInterval(function(){ $scope.getMsg(); }, 4000);
	
		$scope.mesgsubmit = function() {
			
			$scope.list = {};
			if($scope.entrId!=""){
	        if ($scope.msgs) {
	          $scope.list = {'username':$scope.entrId, 'text': this.msgs};
	          loadingImage.show();
	          $http( {
	  			method: 'POST',
	  			url: 'https://hooks.slack.com/services/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',
	  			headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
	  			data: JSON.stringify($scope.list)
	  		} ).success( function( data ) { console.log("Working"); $scope.getMsg(); loadingImage.hide();  $scope.counter=2;  } ).error(function(res){
	  			console.log(JSON.stringify(res));
	  		});
	              $scope.msgs = '';
	        }
		}else{
			alert("Please enter a Name First");
		}
	      };
	});