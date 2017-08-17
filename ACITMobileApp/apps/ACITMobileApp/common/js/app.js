// angular.module is a global place for creating, registering and retrieving Angular modules
// 'directory' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'directory.services' is found in services.js
// 'directory.controllers' is found in controllers.js
var app = angular.module('acitapp', ['ionic', 'acitapp.services','acitapp.directive']);
app.factory('timeoutFactory', function() {
    return {
        setTimeOut: function() {
        	this.timeoutVar = setTimeout(function(){
            	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
        		$location.path('/acit');
            }, 900000);
        },
	    clearTimeOut: function() {
	    	clearTimeout(this.timeoutVar);
	    }
    };
});
app.factory('encryptDecryptFactory', function() {
    return {
        encrypt: function(textToBeEncrypted) {
        	alert("Enter 1");
        	var iterationCount = 1000;
    		var keySize = 128;
    		//var plaintext = $scope.uid;
    	    var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
    	    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    	    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
    	    
    	    var aesUtil = new AesUtil(keySize, iterationCount);
    	    var encryptedUserId = aesUtil.encrypt(salt, iv, passphrase,textToBeEncrypted);
    	    return encryptedUserId;
        },
	    decrypt: function() {
	    	alert("Enter 2");
	    }
    };
});
app.factory('ACITMobileApp',  [ '$rootScope', function ($rootScope) {
	$rootScope.userID = "";
	$rootScope.pwd = "";
	$rootScope.encryptedValue = "";
	$rootScope.decryptedValue = "";
	$rootScope.currentYear = "";
	return {
		getCurrentYear: function() {
			var d = new Date();
			$rootScope.currentYear = d.getFullYear();
			return $rootScope.currentYear;
	    },
       	setUserId: function(value) {
       		$rootScope.userID = value;
	    },
	    getUserId: function() {
	    	//alert("get user id---");
	        return $rootScope.userID;
	    },
	    setPassword: function(value) {
	    	$rootScope.pwd = value;
	    },
	    getPassword: function() {
	    	return $rootScope.pwd;
	    },
	    encrypt:function(value){
	    	var iterationCount = 1000;
			var keySize = 128;
			var passphrase = "u/Gu5posvwDsXUnV5Zaq4g==";
		    var iv = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		    var salt = CryptoJS.lib.WordArray.random(128/8).toString(CryptoJS.enc.Hex);
		    
		    var aesUtil = new AesUtil(keySize, iterationCount);
		    $rootScope.encryptedValue = aesUtil.encrypt(salt, iv, passphrase,value);
		   	return $rootScope.encryptedValue;
	    },
	    decrypt:function(value){
	    	return $rootScope.decryptedValue;
	    }
       };	
    
}]);
app.config(function($stateProvider, $urlRouterProvider) {
    // Ionic uses AngularUI Router which uses the concept of states
    // Learn more here: https://github.com/angular-ui/ui-router
    // Set up the various states which the app can be in.
    // Each state's controller can be found in controllers.js
    $stateProvider
        .state('invalid-login', {
            url: '/acit-invalid-login',
            templateUrl: 'views/invalid-login.html',
            controller: 'invalidLoginCtrl'
        })
        .state('acit-login', {
            url: '/acit',
            templateUrl: 'views/login.html',
            controller: 'loginCtrl'
        })
        .state('acit-menu.asset-search', {
            url: '/acit/asset-search',
            views: {
                'menuContent': {
                    templateUrl: 'views/asset-search.html',
                    controller: 'assetsLandingCtrl'
                }
            }
        })
        .state('acit-menu', {
            url: '/acit/menu',
            abstract: true,
            templateUrl: 'views/acit-menu.html',
            controller: 'menuCtrl'

        })
        .state('acit-menu.home', {
            url: '/home',
            views: {
                'menuContent': {
                    templateUrl: 'views/home.html',
                    controller: 'homeCtrl'
                }
            }
        })
        .state('home-overlay', {/*
        	url: '/overlay/:items',*/
            templateUrl: 'views/testimonial-overlay.html',
            controller: 'homeCtrl'
        })
        
                
        
        .state('acit-menu.activities-list', {
            url: '/activities',
            views: {
                'menuContent': {
                    templateUrl: 'views/list-activities.html',
                    controller: 'activitiesCtrl'
                }
            }
        })
        .state('acit-menu.activities-detail', {
            url: '/activities/:id',
            views: {
                'menuContent': {
                    templateUrl: 'views/activities-detail.html',
                    controller: 'activityDetailsCtrl'
                }
            }
        })
        .state('acit-menu.events-list', {
            url: '/events',
            views: {
                'menuContent': {
                    templateUrl: 'views/events-list.html',
                    controller: 'eventsCtrl'
                }
            }
        })
        .state('acit-menu.events-detail', {
            url: '/events/:id',
            views: {
                'menuContent': {
                    templateUrl: 'views/events-detail.html',
                    controller: 'eventsDetailsCtrl'
                }
            }
        })
        
        
        .state('acit-menu.contats-list', {
            url: '/contacts',
            views: {
                'menuContent': {
                    templateUrl: 'views/contats-list.html',
                    controller: 'eventsCtrl'
                }
            }
        })
        
        
        .state('acit-menu.products-list', {
            url: '/products',
            views: {
                'menuContent': {
                    templateUrl: 'views/products-list.html',
                    controller: 'productsCtrl'
                }
            }
        })
        .state('acit-menu.assets', {
            url: '/assets',
            views: {
                'menuContent': {
                    templateUrl: 'views/product-assets.html',
                    controller: 'assetsLandingCtrl'
                }
            }
        })
        .state('acit-menu.assets-filter', {
            url: '/assets-filter/:id',
            views: {
                'menuContent': {
                    templateUrl: 'views/product-asset-filter.html',
                    controller: 'assetsLandingCtrl'
                }
            }
        })
        .state('acit-menu.asset-details', {
            url: '/assets-details/:id',
            views: {
                'menuContent': {
                    templateUrl: 'views/product-asset-details.html',
                    controller: 'assetDetailsCtrl'
                }
            }
        })
        .state('acit-menu.newsfeed-home', {
            url: '/newsfeedhome',
            views: {
                'menuContent': {
                    templateUrl: 'views/newsfeed-home.html',
                    controller: 'newsfeedListCtrl'
                }
            }
        })
        .state('acit-menu.newsfeed-homeIBM', {
            url: '/newsfeedhomeibm',
            views: {
                'menuContent': {
                    templateUrl: 'views/newsfeed-homeIBM.html',
                    controller: 'newsfeedListCtrl'
                }
            }
        })
        .state('newsfeed-detail', {
            url: '/acit/newsfeedlist/:id,:heading',
            templateUrl: 'views/newsfeed-detail.html',
            controller: 'newsfeedDetailsCtrl'
        })
        .state('newsfeed-list', {
            url: '/acit/newsfeedhome/:src',
            templateUrl: 'views/newsfeed-list.html',
            controller: 'newsfeedListCtrl'
        })
        .state('drop-down-ui', {
            templateUrl: 'views/assets-dropdown.html',
            controller: 'assetsLandingCtrl'
        })
        .state('acit-menu.clientactivities-list', {
            url: '/client-activites',
            views: {
                'menuContent': {
                    templateUrl: 'views/clientactivities-list.html',
                    controller: 'clientActivitiesCtrl'
                }
            }
        })
        .state('acit-menu.clientactivities-detail', {
            url: '/clientactivities/:id',
            views: {
                'menuContent': {
                    templateUrl: 'views/clientactivities-detail.html',
                    controller: 'clientactivityDetailsCtrl'
                }
            }
        })
        
	    .state('acit-menu.subscription', {
	        url: '/subscription',
	        views: {
	            'menuContent': {
	                templateUrl: 'views/subscription.html',
	                controller: 'subCtrl'
	            }
	        }
	    })
	    .state('acit-menu.messages', {
	        url: '/messages',
	        views: {
	            'menuContent': {
	                templateUrl: 'views/acit-msgs.html',
	                controller: 'msgCtrl'
	            }
	        }
	    })
	    .state('acit-menu.about-app', {
            url: '/aboutapp',
            views: {
                'menuContent': {
                    templateUrl: 'views/about-app.html',
                    controller: 'appStoryController'
                }
            }
        })
        .state('acit-menu.cloud-studio', {
            url: '/cloudStudio',
            views: {
                'menuContent': {
                    templateUrl: 'views/cloud-studio-main.html',
                    controller: 'cloudStudioController'
                }
            }
        })
        .state('acit-menu.businesscontext-detail', {
            url: '/businesscontext',
            views: {
                'menuContent': {
                    templateUrl: 'views/business-context.html',
                    controller: 'businessContextController'
                }
            }
        })
        .state('acit-menu.business-partnership', {
            url: '/businessPartnership',
            views: {
                'menuContent': {
                    templateUrl: 'views/business-partnership.html',
                    controller: 'businessPartnershipController'
                }
            }
        })
        .state('acit-menu.acit-number-detail', {
            url: '/acitNumbers',
            views: {
                'menuContent': {
                    templateUrl: 'views/acit-in-number.html',
                    controller: 'acitinnumberController'
                }
            }
        });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/acit');

});