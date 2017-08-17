/**
 * 
*/
angular.module('acitapp.directive', [])
	.directive('acitRole',function(){
		return{
			restrict:"A",
			scope:"=",
			//transclude:false,
			/*link:function(scope,_element,attrs){			
				scope.test=false;
				scope.currentrole=attrs.acitRole;
				scope.isAuthorized();
			},*/
			controller:function($scope,RoleService,ACITRoleService,RecentAssetService,authenticateService){
				$scope.test=false;
				RoleService.fetchAllUsers().then(function(result) {
				    	
				    	$scope.users = JSON.stringify(result[0].users);
				    	if(localStorage.getItem("UserName") != null || localStorage.getItem("UserName") != undefined){
				    		var userName= localStorage.getItem("UserName");
				    		var decryptedUserName = CryptoJS.AES.decrypt(userName, "acit@user");
				    		$scope.entrId = decryptedUserName.toString(CryptoJS.enc.Utf8);
				    	}
				    		
				    	else
				    		$scope.entrId = "ACIT User";
				    	
				    	if($scope.entrId.indexOf("@") > -1)
				    		$scope.entrId = $scope.entrId.substring(0,$scope.entrId.indexOf("@"));
				    	
				    	if($scope.users.indexOf($scope.entrId) > -1){
				    		
				    		$scope.test=true;
				    	}else{
				    		
				    		$scope.test=false;
				    	}
				    	
				 });
				/*$scope.isAuthorized=function(){
					if	(null!=ACITRoleService.getUserProfile()){
						alert("Enter 2");
					var authFlg = ACITRoleService.isAuthorized(ACITRoleService.convertTOArray(ACITRoleService.getUserProfile().roles),ACITRoleService.convertTOArray(ACITRoleService.getUserProfile().privilege),$scope.currentrole);
					$scope.test=authFlg;									
					$scope.$parent.entrId=ACITRoleService.getUserProfile().name;
					}else{				
						alert("Enter 3");
						authenticateService().then(function(assets) {
							ACITRoleService.setUserProfile(
									{
										name:WL.Client.getUserName("LDAPRealm"),
										roles:WL.Client.getUserInfo("LDAPRealm","attributes").roles,
										privilege:WL.Client.getUserInfo("LDAPRealm","attributes").privilege
									});
							$scope.$parent.entrId=WL.Client.getUserName("LDAPRealm");
							var authFlg = ACITRoleService.isAuthorized(ACITRoleService.convertTOArray(ACITRoleService.getUserProfile().roles),ACITRoleService.convertTOArray(ACITRoleService.getUserProfile().privilege),$scope.currentrole);
							$scope.test=authFlg;
							$scope.entrId=ACITRoleService.getUserProfile().name;
							$scope.$parent.entrId=ACITRoleService.getUserProfile().name;
						});
					}
				};*/

		}
		};
	})
.service('ACITRoleService', function() {
	return {
		tempUserProfile:null,
        getUserProfile: function() {            
	            if(typeof tempUserProfile !== 'undefined'){
	            	return tempUserProfile;
	            }else{	            	
	            	return null;
	            	}
        },
        setUserProfile: function(newUserProfile) {
            tempUserProfile = newUserProfile;        
        },
        convertTOArray:function(inp){
        	if(Array.isArray(inp)){
        		return inp;
        	}else if(null!=inp){       		
        		var temp = inp.substring(1,inp.length -1);
        		return temp.split(',');
        	}else{
        		
        		return [];
        	}
        },
        isAuthorized:function(roles, prev, currentRole){       	
        	if(roles && prev){
        		var aclroles =[];
        		for (var indexPrev=0;indexPrev<prev.length;indexPrev++){
        			var urlrole = prev[indexPrev].split('-');       			
        			if (urlrole.length=2 && currentRole ==urlrole[1] ){
        				var tempPrefrole= urlrole[0].split('@');
        				if(tempPrefrole.length =2 ){
        					aclroles.push(tempPrefrole[0]);
	        					for(var indexRole=0;indexRole<roles.length;indexRole++){
	        	        			if(roles[indexRole]==tempPrefrole[0]){
	        	        				console.log(tempPrefrole[0]);
	        	        				return true;
	        	        			}
	        	        		}
        	        	
        					}
        			}
        		}
        		
        	}
        	return false;
        }
       
    };
	
});
