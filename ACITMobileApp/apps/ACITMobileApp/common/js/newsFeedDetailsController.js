app.controller('newsfeedDetailsCtrl', function ($scope, $rootScope, $stateParams, NewsFeedService,LoginService,loadingImage, timeoutFactory,ACITMobileApp) {
	$scope.goBack = function() {
		  window.history.back();
	  };
	$scope.errorCode = "";$scope.errorMsg = "";
	loadingImage.show();
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
	console.log("Calling NewsfeedDetails Controller", $stateParams.heading);
	if($stateParams.heading == 'IBM NewsFeed'){
	$scope.getNewsfeedDetails = function()
	{
		$scope.errorMsg = "";
		$scope.newsfeeds = [];
		console.log("Calling Details NewsFeedService",$scope);
		LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
			//loadingImage.hide();
	    	var response = JSON.stringify(result.Response.body);
	    	var responseText = response.substring(1,response.length-1);
	    	if(responseText == "true"){
	    		
	    		NewsFeedService.fetchIBMNews(responseText).then(function (newsfeeds)
				{
	    			console.log("news feed is---"+newsfeeds);
					var response = newsfeeds.Response.body;
					console.log("Enetr inside 12---"+response);
					var x2js = new X2JS();
					var courses  = x2js.xml_str2json(response);
					console.log("ibm response is----"+JSON.stringify(courses));
					var todos =courses.rss.channel.item;
					console.log("length is----"+todos.length);
					for(var i = 0; i < todos.length;i++){
						var id = i + 1;
						var title = todos[i].title;
						var description = todos[i].description.__cdata;
						var pubDate = new Date(todos[i].pubDate);
						console.log("description is---"+(todos[i].description));
						$scope.newsfeeds.push({
							id : id,
							title : title,
							date : pubDate.toISOString(),
							details : description,
						});
					}
					for(var i = 0; i < $scope.newsfeeds.length; i++){
		      			  if($scope.newsfeeds[i].id == $stateParams.id){
		      				$scope.details = $scope.newsfeeds[i].details;
		      				$scope.newsfeed = $scope.newsfeeds[i].title; 
		      				$scope.date = $scope.newsfeeds[i].date; 
		      			  }      			  
		      		  }
					//$scope.$broadcast('scroll.refreshComplete');
					//$scope.errorMsg = "";
					loadingImage.hide();
				});
		
	}else{
		//alert("false");
		loadingImage.hide();
	}
	
});
	};
	$scope.getNewsfeedDetails();
	}
	else if($stateParams.heading == 'Accenture NewsFeed'){
		$scope.getNewsfeedDetails = function()
		{
			$scope.errorMsg = "";
			console.log("Calling Details NewsFeedService",$scope);
			$scope.newsfeeds = [];
			LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
				//loadingImage.hide();
		    	var response = JSON.stringify(result.Response.body);
		    	var responseText = response.substring(1,response.length-1);
		    	if(responseText == "true"){
		    	
					NewsFeedService.fetchACNNews(responseText).then(function (newsfeeds)
					{
						console.log("news feed is---"+newsfeeds);
						var response = newsfeeds.Response.body;
						console.log("Enetr inside 12---"+response);
						var x2js = new X2JS();
						var courses  = x2js.xml_str2json(response);
						console.log("ACN response----"+JSON.stringify(courses));
						var todos =courses.rss.channel.item;
						console.log("length is----"+todos.length);
						for(var i = 0; i < todos.length;i++){
							var id = i + 1;
							var title = todos[i].title;
							var description = todos[i].description;
							var pubDate = new Date(todos[i].pubDate);
							console.log("description is---"+(todos[i].description));
							$scope.newsfeeds.push({
								id : id,
								title : title,
								date : pubDate.toISOString(),
								details : description,
							});
						}
						for(var i = 0; i < $scope.newsfeeds.length; i++){
			      			  if($scope.newsfeeds[i].id == $stateParams.id){
			      				$scope.details = $scope.newsfeeds[i].details;
			      				$scope.newsfeed = $scope.newsfeeds[i].title; 
			      				$scope.date = $scope.newsfeeds[i].date; 
			      			  }      			  
			      		  }
						//$scope.$broadcast('scroll.refreshComplete');
						//$scope.errorMsg = "";
						loadingImage.hide();
					});
			
				}else{
					//alert("false");
					loadingImage.hide();
				}
		
			});
		};
		$scope.getNewsfeedDetails();
	
		
		}	
});
