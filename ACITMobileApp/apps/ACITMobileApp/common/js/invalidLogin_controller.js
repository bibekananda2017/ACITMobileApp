app.controller('invalidLoginCtrl', function ($scope,$state) {
	
	$scope.reloadapp = function(){
		WL.Client.reloadApp();
		$state.go('acit-login');
	};
	
});