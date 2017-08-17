
app.controller('newsfeedListIBMCtrl', function ($scope, $stateParams, NewsFeedService, loadingImage) {	
	
	$scope.errorCode = "";$scope.errorMsg = "";
	loadingImage.show();
	
	$scope.getNewsFeeds = function()
	{
		//alert("11");
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
	    loadingImage.hide();
	 });
	
	console.log("newsfeedListIBMCtrl",$scope);
	
	
});