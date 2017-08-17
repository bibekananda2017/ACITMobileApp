
app.controller('newsfeedListCtrl', function ($scope, $rootScope,  $stateParams, NewsFeedService,LoginService,loadingImage,timeoutFactory,ACITMobileApp) {	
	
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
	
	var iterationCount = 1000;
	var keySize = 128;
	//var plaintext = $scope.uid;
    var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    
    var aesUtil = new AesUtil(keySize, iterationCount);
    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getUserId());
    var encryptedPassword = aesUtil.encrypt(salt, iv, passphrase, ACITMobileApp.getPassword());
    //alert(encryptedUserId);
    //alert(encryptedPassword);
	$scope.getAccentureNewsFeeds = function(isAuthenticated)
	{
		$scope.newsfeeds = [];
		$scope.heading = "Accenture NewsFeed";
		$scope.errorMsg = "";
		//console.log("Calling Accenture NewsFeedService",$scope);
		//alert("1");
		NewsFeedService.fetchACNNews(isAuthenticated).then(function (newsfeeds)
		{
			/*console.log("Got Accenture NewsFeeds",newsfeeds);
			$scope.newsfeeds = newsfeeds;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();*/
			var response = newsfeeds.Response.body;
			//console.log("Enetr inside 12---"+response);
			var x2js = new X2JS();
			var courses  = x2js.xml_str2json(response);
			//console.log("response is----"+JSON.stringify(courses));
			var todos =courses.rss.channel.item;
			//console.log("length is----"+todos.length);
			for(var i = 0; i < todos.length;i++){
				var id = i + 1;
				var title = todos[i].title;
				var description = todos[i].description;
				var pubDate = new Date(todos[i].pubDate);
				//console.log("description is---"+(todos[i].description));
				$scope.newsfeeds.push({
					id : id,
					title : title,
					date : pubDate.toISOString(),
					details : description,
				});
			}
			loadingImage.hide();
		});
	};
	/*$scope.getAccentureNewsFeeds = function()
	{
		$scope.newsfeeds = [];
		$scope.heading = "Accenture NewsFeed";
		$scope.errorMsg = "";
		console.log("Calling Accenture NewsFeedService",$scope);
		
		NewsFeedService.getAccentureNewsFeed().then(function (newsfeeds)
		{
			console.log("Got Accenture NewsFeeds",newsfeeds);
			$scope.newsfeeds = newsfeeds;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});
	};*/
	
	//$scope.getAccentureNewsFeeds();
	/*$scope.$on('AccentureNewsFeedService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });*/
	
	
	
	
	
	$scope.getNewsFeeds = function(isAuthenticated)
	{
		$scope.IBMnewsfeeds = [];
		$scope.heading = "IBM NewsFeed";
		$scope.errorMsg = "";
		//console.log("Calling NewsFeedService",$scope);
		//alert("2");
		NewsFeedService.fetchIBMNews(isAuthenticated).then(function (IBMnewsfeeds)
				{
					/*console.log("Got IBM NewsFeeds",IBMnewsfeeds);
					$scope.IBMnewsfeeds = IBMnewsfeeds;
					$scope.$broadcast('scroll.refreshComplete');
					$scope.errorMsg = "";*/
					var response = IBMnewsfeeds.Response.body;
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
						//console.log("description is---"+(todos[i].description));
						$scope.IBMnewsfeeds.push({
							id : id,
							title : title,
							date : pubDate.toISOString(),
							details : description,
						});
					}
					loadingImage.hide();
				}
				);
		
		/*NewsFeedService.getIBMNewsFeed().then(function (IBMnewsfeeds)
		{
			console.log("Got IBM NewsFeeds",IBMnewsfeeds);
			$scope.IBMnewsfeeds = IBMnewsfeeds;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		}
		);*/
	};
	//$scope.getNewsFeeds();
	/*$scope.$on('IBMNewsFeedService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });*/
	
	console.log("newsfeedListCtrl",$scope);
	//alert(encryptedUserId);
	//alert(encryptedPassword);
	LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
		//loadingImage.hide();
    	var response = JSON.stringify(result.Response.body);
    	var responseText = response.substring(1,response.length-1);
    	if(responseText == "true"){
    		$scope.getAccentureNewsFeeds(responseText);
    		$scope.getNewsFeeds(responseText);
    	}else{
    		//alert("false");
    		loadingImage.hide();
    	}
    	
    });
	
});



app.controller('newsfeedListibmCtrl', function ($scope, $rootScope, $stateParams, NewsFeedService) {	
	$scope.goBack = function() {
		  window.history.back();
	  };
	$scope.errorCode = "";$scope.errorMsg = "";
	loadingImage.show();
	$scope.logoutSession = function() {
    	clearTimeout($rootScope.timeoutVar);
    	$rootScope.timeoutVar = setTimeout(function(){
    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$location.path('/acit');
    	}, 1200000);
	};
	$scope.logoutSession();
	$scope.getAccentureNewsFeeds = function()
	{
		//alert("3");
		$scope.newsfeeds = [];
		$scope.heading = "Accenture NewsFeed";
		$scope.errorMsg = "";
		console.log("Calling Accenture NewsFeedService",$scope);
		
		NewsFeedService.getAccentureNewsFeed().then(function (newsfeeds)
		{
			console.log("Got Accenture NewsFeeds",newsfeeds);
			$scope.newsfeeds = newsfeeds;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		});
	};
	$scope.getAccentureNewsFeeds();
	$scope.$on('AccentureNewsFeedService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide();
	 });
	
	
	
	
	
	$scope.getNewsFeeds = function()
	{
		//alert("4");
		$scope.IBMnewsfeeds = [];
		$scope.heading = "IBM NewsFeed";
		$scope.errorMsg = "";
		console.log("Calling NewsFeedService",$scope);
		
		NewsFeedService.getIBMNewsFeed().then(function (IBMnewsfeeds)
		{
			console.log("Got IBM NewsFeeds",IBMnewsfeeds);
			$scope.IBMnewsfeeds = IBMnewsfeeds;
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			loadingImage.hide();
		}
		);
	};
	$scope.getNewsFeeds();
	$scope.$on('IBMNewsFeedService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    loadingImage.hide
	 });
	
	console.log("newsfeedListibmCtrl",$scope);
	
	
});