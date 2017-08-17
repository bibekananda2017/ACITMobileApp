
/* JavaScript content from js/login_controller.js in folder common */
app.controller('loginCtrl', function ($scope,$rootScope, $stateParams, $location, $state,LoginService, ErrorBroadcastService, loadingImage,ACITRoleService,authenticateService,acitappservice,ACITMobileApp) {
    $scope.ImageURI =  "images/show-password-icon.png";
    //$scope.$apply(); 
	$scope.loginError = "";
    loadingImage.hide();
	$scope.rememberMe = "";
	$scope.LDAPRealmChallengeHandler = WL.Client.createChallengeHandler("LDAPRealm");
	$scope.redirectFlg=true;
	ACITMobileApp.getCurrentYear();
	var userName = localStorage.getItem("UserName");
	//alert(userName);
	if(userName != null || userName != undefined){
		var decryptedUserName = CryptoJS.AES.decrypt(userName, "acit@user");
		//alert("decryptedUserName--->"+decryptedUserName);
		$scope.uid = decryptedUserName.toString(CryptoJS.enc.Utf8);
	}
	var userPassword = localStorage.getItem("Password");
	//alert(userPassword);
	if(userPassword != null || userPassword != undefined){
		var decryptedUserPassword = CryptoJS.AES.decrypt(userPassword, "acit@pwd");
		//alert("decryptedUserPassword--->"+decryptedUserPassword);
		$('.saveUser, .saveUser1').prop('checked', true);
		$scope.pswd = decryptedUserPassword.toString(CryptoJS.enc.Utf8);
	}else{
		$('.saveUser, .saveUser1').prop('checked', false);
	}

    //alert("decrypted--->"+decrypted);
    //alert(decrypted.toString(CryptoJS.enc.Utf8));
	//$scope.getUserDetails();
	$scope.isCustomResponse = function(response) {
		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("4.2 -->login_controller.isCustomResponse ::--> response"+response);
		//console.log("4.2 -->login_controller.isCustomResponse ::--> response"+response);
	    if (!response || !response.responseText) {
	    	//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("inside isCustomResponse false");
	        return false;
	    }
	    
	    var idx = response.responseText.indexOf("j_security_check");
	    
	    if (idx >= 0){
	    	//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("inside isCustomResponse true");
	    	return true;
	    }
	    return false;

	};

	$scope.handleChallenge = function(response){

		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("inside handleChallenge");
		//console.log("inside handleChallenge");
		var reqURL = '/j_security_check';
		var options = {};
		    options.parameters = {
		    		j_username : $scope.uid,
		    		j_password : $scope.pswd
		};
		options.headers = {};
		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("2.handleChallenge ::-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
		//console.log("2.handleChallenge ::-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("2.handleChallenge ::-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
		//console.log("2.handleChallenge ::-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
		$scope.LDAPRealmChallengeHandler.submitLoginForm(reqURL, options, $scope.submitLoginFormCallback);
		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("2.1 -->handleChallenge ::--> options"+options);
	
	};

	$scope.submitLoginFormCallback = function(response) {
	    //loadingImage.show();
		//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("3 -->submitLoginFormCallback ::--> options"+response);
		//console.log("3 -->submitLoginFormCallback ::--> options"+response);
	    var isLoginFormResponse = $scope.LDAPRealmChallengeHandler.isCustomResponse(response);
	    if (isLoginFormResponse){
	    	//$scope.LDAPRealmChallengeHandler.submitFailure();
	    	//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("Got INVALID CREDENTIALS");
	    	displayError("Invalid Credentials");
	    	//$location.path("acit-login");
	    } else {
	    	if($scope.rememberMe) {
	    		//localStorage.setItem("UserName", $scope.uid);
	    	}else {
	    		//localStorage.removeItem("UserName");
	    	}
	    	//alert("1");
	    	var encryptedUserName = CryptoJS.AES.encrypt($scope.uid, "acit@user");
	    	//alert("1---"+encryptedUserName);
	    	localStorage.setItem("UserName", encryptedUserName);
	    	//alert("2---"+encryptedUserName);
	    	var encryptedPwd = CryptoJS.AES.encrypt($scope.pswd, "acit@pwd");
	    	//alert("3---"+encryptedPwd);
	    	if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
	    		localStorage.setItem("Password", encryptedPwd);
	    	} else{
	    		localStorage.removeItem("Password");
	    		$('.saveUser, .saveUser1').prop('checked', false);
	    	}
	    	//alert("4---"+encryptedPwd);
	    	//alert(localStorage.getItem("Password"));
	    	//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("inside submitSuccess");
	    	if(WL.Environment.IPHONE==WL.Client.getEnvironment() ||WL.Environment.IPAD==WL.Client.getEnvironment()){
	    		jQuery("#uid").focus();
	    		jQuery("#uid").blur();
	    	}
	    	$scope.LDAPRealmChallengeHandler.submitSuccess();
	    	//$scope.redirectHome();
	    	
	    }
	};
	
	$scope.chkme = function (id) {
		if($("."+id).is(':checked')){
			$('.saveUser, .saveUser1').prop('checked', true);
		}else{
			$('.saveUser, .saveUser1').prop('checked', false);
		};
		console.log($('.saveUser').is(':checked'));
		console.log($('.saveUser1').is(':checked'));
	};
	
	//$scope.LDAPRealmChallengeHandler.handleChallenge = $scope.handleChallenge;
	//$scope.LDAPRealmChallengeHandler.isCustomResponse = $scope.isCustomResponse;
	/*function authenticateUser(user, password)
	{
	    var token = user + ":" + password;

	    // Should i be encoding this value????? does it matter???
	    // Base64 Encoding -> btoa
	    var hash = window.btoa(token); 

	    return "Basic " + hash;
	}
*/	
	$scope.submitLogin1 = function(uid,pswd){
		loadingImage.show();
		$scope.uid = uid; $scope.pswd = pswd;
		//var authValue = authenticateUser($scope.uid,$scope.pswd);
		//alert("1---"+encryptDecryptFactory.encrypt($scope.uid));
		var iterationCount = 1000;
		var keySize = 128;
		var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
	    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
	    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
	    
	    var aesUtil = new AesUtil(keySize, iterationCount);
	    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase, $scope.uid);//ACITMobileApp.encrypt($scope.uid);
	    var encryptedPassword = aesUtil.encrypt(salt, iv, passphrase, $scope.pswd);//ACITMobileApp.encrypt($scope.pswd);
	    
        /*var rkEncryptionKey = CryptoJS.enc.Base64.parse('u/Gu5posvwDsXUnV5Zaq4g==');
        var rkEncryptionIv = CryptoJS.enc.Base64.parse('5D9r9ZVzEYYgha93/aUK2w==');
        		       
        var userid = CryptoJS.enc.Utf8.parse($scope.uid);
        var encryptedUserId = CryptoJS.AES.encrypt(userid.toString(), rkEncryptionKey, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: rkEncryptionIv});
        encryptedUserId=encodeURIComponent(encryptedUserId.toString());              
                                            
        var userPwd = CryptoJS.enc.Utf8.parse($scope.pswd);
        var encryptedPassword = CryptoJS.AES.encrypt(userPwd.toString(), rkEncryptionKey, {mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7, iv: rkEncryptionIv});
        encryptedPassword=encodeURIComponent(encryptedPassword.toString());*/
	    //alert(encryptedUserId);
		//alert(encryptedPassword);
	    LoginService.getUserValidation(encryptedUserId,encryptedPassword,iv,salt).then(function(result) {
	    	loadingImage.hide();
	    	var response = JSON.stringify(result.Response.body);
			//alert("response is---"+response);
			ACITMobileApp.setUserId($scope.uid);
			ACITMobileApp.setPassword($scope.pswd);
			//if(response.substring(1,response.length-1) == "Authentication Successful"){
			if(response.substring(1,response.length-1) == "true"){
				var encryptedUserName = CryptoJS.AES.encrypt($scope.uid, "acit@user");
		    	localStorage.setItem("UserName", encryptedUserName);
		    	var encryptedPwd = CryptoJS.AES.encrypt($scope.pswd, "acit@pwd");
		    	if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
		    		localStorage.setItem("Password", encryptedPwd);
		    	} else{
		    		localStorage.removeItem("Password");
		    		$('.saveUser, .saveUser1').prop('checked', false);
		    	}
				loadingImage.hide();
				if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
		    		//localStorage.setItem("Password", encryptedPwd);
		    	}else{
		    		localStorage.removeItem("Password");
		    		$('.saveUser, .saveUser1').prop('checked', false);
		    	}
				$state.go("acit-menu.home");
				
			}else{
				loadingImage.hide();
				alert("Invalid user name and password");
			}
	    	
	    });
        
		/*acitappservice.getUserAuthentication(function(dataResponse) {
			var response = JSON.stringify(dataResponse.Response.body);
			//alert("response is---"+response);
			
			
			if(response.substring(1,response.length-1) == "Authentication Successful"){
				var encryptedUserName = CryptoJS.AES.encrypt($scope.uid, "acit@user");
		    	localStorage.setItem("UserName", encryptedUserName);
		    	var encryptedPwd = CryptoJS.AES.encrypt($scope.pswd, "acit@pwd");
		    	if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
		    		localStorage.setItem("Password", encryptedPwd);
		    	} else{
		    		localStorage.removeItem("Password");
		    		$('.saveUser, .saveUser1').prop('checked', false);
		    	}
				loadingImage.hide();
				if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
		    		//localStorage.setItem("Password", encryptedPwd);
		    	}else{
		    		localStorage.removeItem("Password");
		    		$('.saveUser, .saveUser1').prop('checked', false);
		    	}
				$state.go("acit-menu.home");
				
			}else{
				loadingImage.hide();
				alert("Invalid user name and password");
			}
			
		},encryptedUserId,encryptedPassword,iv,salt);*/
	};
	
		/*$scope.submitLogin = function(uid,pswd){
		$scope.uid = uid; $scope.pswd = pswd;
		
		console.log("Checking is authenticated-->"+WL.Client.isUserAuthenticated("LDAPRealm"));

		WL.Client.connect(
			{
				onSuccess: function(){
					//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("5.1 -->submitLogin onSuccess-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
					//console.log("5.1 -->submitLogin onSuccess-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
				
					//$state.go("acit-menu.home");
					authenticateService().then(function() {
					
						ACITRoleService.setUserProfile(
								{
									name:WL.Client.getUserName("LDAPRealm"),
									roles:WL.Client.getUserInfo("LDAPRealm","attributes").roles,
									privilege:WL.Client.getUserInfo("LDAPRealm","attributes").privilege
								});
						
						//$scope.saveUserDetails($scope.uid,$scope.pswd);
						if($(".saveUser").is(':checked') || $(".saveUser1").is(':checked')){ 
				    		//localStorage.setItem("Password", encryptedPwd);
				    	}else{
				    		localStorage.removeItem("Password");
				    		$('.saveUser, .saveUser1').prop('checked', false);
				    	}
						$scope.redirectHome();
						
						
						
					});
					
				
					
				},
				onFailure: function(error){
					//console.log();
					//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("unsuccessful connection " +error);
					//WL.Logger.ctx({pkg: 'loginCtrl'}).warn("5.2 -->submitLogin onfailure-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
					//console.log("5.2 -->submitLogin onfailure-->USED uid = "+$scope.uid+ " and pswd = " +((null||undefined)==$scope.pswd?"null":$scope.pswd.length));
					//WL.Client.reloadApp();
					displayError("Connection failure please retry");
					//WL.Logger.send();
			},
			timeout:60000
			
		});
	
				
	};*/
	
	/*$scope.redirectHome =function(){
		if(WL.Client.isUserAuthenticated("LDAPRealm")&& $scope.redirectFlg){
			$scope.redirectFlg = false;
			$state.go("acit-menu.home");
		}
	};*/
	
/*	$scope.saveUserDetails = function(userName,passWord){
		//var collectionName = 'user';
		alert("user name is--->"+userName);
		alert("password name is--->"+passWord);
		// Object that defines all the collections.
		var collections = {

		  // Object that defines the 'people' collection.
		  people : {

		    // Object that defines the Search Fields for the 'people' collection.
		    searchFields : {name: 'string', pwd: 'string'}
		  }
		};

		// Optional options object.
		var options = {

		  // Optional username, default 'jsonstore'.
		  username : 'acit',

		  // Optional password, default no password.
		  password : 'acit@123',

		  // Optional local key generation flag, default false.
		  localKeyGen : false
		};

		WL.JSONStore.destroy(collections,options).then(function () {
			  // handle success
			alert("destroy success");
			WL.JSONStore.init(collections,options).then(function (collections) {
				  // handle success - collection.people (people's collection)
				alert("initialize success");
				var collectionName = 'people';
				
				 
				var data = {name: userName, pwd: passWord};
				 
				WL.JSONStore.get(collectionName).add(data, options).then(function () {
				 // handle success
					alert("added successfully");
					$scope.redirectHome();
				}).fail(function (error) {
				 // handle failure
					alert("error in adding--"+JSON.stringify(error));
				});
			}).fail(function (error) {
				  // handle failure
				alert("error in init-->"+JSON.stringify(error));
			});
			}).fail(function (error) {
			  // handle failure
				alert("error in destroy-->"+JSON.stringify(error));
		});
		
		
	};
	
*/	function displayError(errorString) {
		  var dialogTitle = "Login Error";
		  WL.SimpleDialog.show(dialogTitle, errorString, [ {
		    text : 'OK',
		    handler : simpleDialogButton1Click
		  }
		  ]);
		}
		function simpleDialogButton1Click() {
			WL.Client.reloadApp();
		}

	$scope.goToOption = function(path){
		$location.path(path);
	};
	
	$scope.logout = function(){
		WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$state.go("acit-login");
	};
	
	
})
;

app.controller('menuCtrl', function ($scope, $stateParams, $location, $state, $ionicSideMenuDelegate, ErrorBroadcastService) {
	if(localStorage.getItem("UserName") != null || localStorage.getItem("UserName") != undefined){
		var userName= localStorage.getItem("UserName");
		var decryptedUserName = CryptoJS.AES.decrypt(userName, "acit@user");
		$scope.entrId = decryptedUserName.toString(CryptoJS.enc.Utf8);
	}
		
	else
		$scope.entrId = "ACIT User";
	if($scope.entrId.indexOf("@") > -1)
		$scope.entrId = $scope.entrId.substring(0,$scope.entrId.indexOf("@"));
	$scope.leftMenuWidth = document.documentElement.clientWidth - (25/100) * document.documentElement.clientWidth;
	
	$scope.toggleProjects = function() {
	        
	        $ionicSideMenuDelegate.toggleLeft();
	    };
	 $scope.logout = function(){
			//WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
			$state.go("acit-login");
		};
});

app.service(
		'acitappservice',
		function($http) {
			// delete $http.defaults.headers.common['X-Requested-With'];
			this.getUserAuthentication = function(callbackFunc,userid,password,iv,salt) {
				//alert(userid);
				//alert(password);
				//var accounturl = "https://acitmobileappservice.mybluemix.net/AuthenticationService";//?"+"username="+userid+"&tokenid="+password;
				//var accounturl="http://eso-authenticator.mybluemix.net/AuthenticationService?"+"username="+userid+"&tokenid="+password;
				var accounturl = "http://acitmobileapp.mybluemix.net/api/Userlogin/login";
				$http(
						{
							
							method : 'POST',
							url:accounturl,
							headers : {
								"Content-Type" : "application/json",
								"username":userid,
								"password":password,
								"iv":iv,
								"salt":salt
								
							}
							
							
						}).success(function(data) {
							
							//alert(JSON.stringify(data));
							console.log("Successs---"+JSON.stringify(data));
					callbackFunc(data);
				}).error(function(data) {
					//loadingImage.hide();
					console.log("Error--"+JSON.stringify(data));
					//alert("Response Error from Account---"+JSON.stringify(data));
					
				});
			};
			
		});
