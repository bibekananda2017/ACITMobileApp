app.controller('homeCtrl', function($scope, $rootScope,$window,$stateParams, $location, $filter,$ionicSideMenuDelegate, ContactsService, loadingImage,AssetService,HighlightsService,GetSubscriptionService,RemoveUserSubscriptions,AddSubscriptionService, RecentAssetService, HighlightService,EventsService, $window, $ionicSlideBoxDelegate, $ionicModal, timeoutFactory) {
	$scope.toggleProjects = function() {
        
        $ionicSideMenuDelegate.toggleLeft();
    };
    $scope.gotoHome = function() {
    	$location.path('/acit/menu/home');
    };
    
    //BMSClient.initialize(BMSClient.REGION_US_SOUTH);
    
    // iOS Actionable notification options. Eg : {"category_Name":[{"identifier_name_1":"action_Name_1"},{"identifier_name_2":"action_Name_2"}]}
    // Pass empty for Android
    
    
   /* $scope.logoutSession = function() {
    	$rootScope.timeoutVar = setTimeout(function(){
    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
		$location.path('/acit');
    	}, 600000);
	};
	$scope.logoutSession();*/
    timeoutFactory.setTimeOut();
    $scope.errorCode = "";
    $scope.errorMsg = "";
    $scope.user="";
    $scope.deviceID=localStorage.getItem("deviceID");
	if(localStorage.getItem("UserName") != null || localStorage.getItem("UserName") != undefined){
		var userName= localStorage.getItem("UserName");
		var decryptedUserName = CryptoJS.AES.decrypt(userName, "acit@user");
		//alert("decryptedUserName--->"+decryptedUserName);
		$scope.user = decryptedUserName.toString(CryptoJS.enc.Utf8);
	}
		
	else
		$scope.user = "ACIT User";
	
   
	$scope.transform=function(subs){
		var res, tags,subscriptions;
		res=[];
		tags =subs.tags;
		subscriptions=subs.subscriptions;
		var flgChecked =false;
		//console.log(subscriptions[0].tagName==tags[1].name);
		//alert("6");
		for(var isub=0; isub<tags.length ;isub++){
			for(var isubscript=0;subs.subscriptions!=undefined && isubscript<subscriptions.length;isubscript++ ){		          
	        if(tags[isub].name == subscriptions[isubscript].tagName){
	        	flgChecked= true;
			          }
				}
			//if($scope.deviceID==null){

                //localStorage.setItem("isSubscribe","true");

                flgChecked= true;

                $scope.changeHandler(tags[isub].name,flgChecked);

			//}

			res.push({ text: tags[isub].name, checked: flgChecked });
			flgChecked =false;
			}		
		console.log(res);
		return res;
	};
	
	$scope.changeHandler = function(inp,sta){
		console.log(inp +sta);
		if(sta){
				AddSubscriptionService(inp,$scope.deviceID).then(function(result){
					console.log(result);
				});
		}else{
			RemoveUserSubscriptions(inp,$scope.deviceID).then(function(result){
				console.log(result);
			});
		}
	};
	
    $scope.getSubs = function()
	{
		$scope.Subscription = [];
		$scope.errorMsg = "";
		console.log("Calling Subscription",$scope);
		if($scope.deviceID != null || $scope.deviceID != undefined){    
			GetSubscriptionService($scope.deviceID).then(function (subs)
					{
						console.log("Got Events",subs);
						$scope.Subscription = $scope.transform(subs);
						$scope.$broadcast('scroll.refreshComplete');
						$scope.errorMsg = "";
						loadingImage.hide();
					
					});
			

    		}/*else{
    			//var error={errorCode:121,errorMsg:};
    			 $scope.errorCode = 121;
    			 $scope.errorMsg = "Device id could not be retrieved";
    			 loadingImage.hide();
		};*/
	};
	loadingImage.show();
	if($scope.deviceID != null || $scope.deviceID != undefined){ 
		
	}else{
	    WL.App.sendActionToNative("initializeBlueMix", {userName:$scope.user} ); 
	    $scope.actionReceiver = function(received) {
	    	$scope.deviceID = received.data.deviceID;
			localStorage.setItem("deviceID",$scope.deviceID);
			$scope.getSubs();
			//$location.path('/menu/home');
		};
		WL.App.addActionReceiver ("initialize", $scope.actionReceiver);
		//$scope.deviceID = "55ac79971fde007c80383c2c";
		//localStorage.setItem("deviceID",$scope.deviceID);
		//$scope.getSubs();
		
	}
    
    $scope.overlayHeight = document.documentElement.clientHeight * (4/5) + "px";
	$scope.$on('GetSubscriptionService', function (event, error) {
		//alert("4");
	   // $scope.errorCode = error.errorCode;
	    //$scope.errorMsg = error.errorMsg;
	    //$scope.$broadcast('scroll.refreshComplete');
	    //loadingImage.hide();
	 });
	
	$scope.getHomePage= function(){
    $scope.events = [];
    $scope.assets = [];
    $scope.highlights = [];
    $scope.highlights1 = [];
    
    $scope.hideKeyBoard = function () {
        if(WL.Environment.IPHONE==WL.Client.getEnvironment() ||WL.Environment.IPAD==WL.Client.getEnvironment()){
        	document.activeElement.blur();
    		jQuery("#hiddenInput").focus();
    		jQuery("#hiddenInput").blur();
    	}
    };
    
    if (window.addEventListener) {
    	window.addEventListener('load', function() { WL.Client.init(wlInitOptions);  }, false);
    } 
    HighlightsService.fetchAllImages().then(function(result) {
    	for(var i=0;i<result.length;i++){
    		//console.log("result is---"+JSON.stringify(result[i]));
    		$scope.highlights1.push(result[i]);
    		
    	}
    	for(var i=0;i<$scope.highlights1.length;i++){
    		console.log("result is---"+i+"-----"+JSON.stringify(Object.keys($scope.highlights1[i])));
    		$scope.highlights.push(
			 {
				 image:"https://08d21487-f215-4081-b472-af10bf2f3e6f-bluemix.cloudant.com/highlightdb/"+$scope.highlights1[i]._id+"/image",//"data:image/jpg;base64,"+$scope.highlights1[i]._attachments.data,
				 heading:$scope.highlights1[i].heading, 
				 client:$scope.highlights1[i].client, 
				 details:$scope.highlights1[i].details
			 });
    	}
    	loadingImage.hide();
    	
    	
    });
    
    EventsService.fetchEvents() 
	
	   .then(function(data) {
		   //console.log("eventsCtrl  221----"+JSON.stringify(data));
		   //$scope.events = event;
		   //console.log("Got Events",events);
			
		    var response = data;
			//console.log("Enetr inside 12---"+response);
			var x2js = new X2JS();
			var courses  = x2js.xml_str2json(response);
			var todos =courses.feed.entry;
			/*var result ={
					event : []			
			};*/
			//var result =[];
			for(var i = 0; i < todos.length;i++){
				//console.log("$scope.todos[0]---"+(todos[i].content.properties.Title.__text));
				var title = todos[i].content.properties.Title.__text;
				title=title.replace(/\n/g,"<br/>").replace(/[â]/g,"").replace(/[€]/g,"").replace(/[“]/g,"-").replace(/[”]/g,"-").replace(/[â€™]/g,"").replace(/[â€¢]/g,"<br/><li/>").replace( /[Â]/g,"").replace( /[â€‹]/g,"");
				//console.log("$scope.todos[1]---"+(todos[i].content.properties.Id.__text));
				var id = todos[i].content.properties.Id.__text;
				//console.log("$scope.todos[2]---"+(todos[i].content.properties.Description.__text));
				var details = todos[i].content.properties.Description.__text;
				//console.log("$scope.todos[3]---"+(todos[i].content.properties.EventDate.__text));
				var eventStrDate = todos[i].content.properties.EventDate.__text;
				//console.log("$scope.todos[4]---"+(todos[i].content.properties.EndDate.__text));
				var eventEndDate =todos[i].content.properties.EndDate.__text;
				//console.log("$scope.todos[5]---"+(todos[i].content.properties.Location.__text));
				var location=todos[i].content.properties.Location.__text;
				//console.log("$scope.todos[6]---"+(todos[i].content.properties.Created.__text));
				var dateStr = todos[i].content.properties.Created.__text;
				
				var today = new Date();
				//console.log("Today is----"+today.toISOString().substring(0,10));
				//console.log("strat date is----"+eventStrDate.substring(0,10));
				//var dateCompareValue = compareDateString(today.toISOString().substring(0,10),eventStrDate.substring(0,10));
				//console.log("dateCompareValue is----"+dateCompareValue);
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
			//console.log("Result is----"+JSON.stringify($scope.events));
			
	   });
	AssetService.fetchAllAssets("true").then(function(result) {
    	//alert("Success");
    	//console.log("result---"+JSON.stringify(result));
    	 $scope.assets = angular.fromJson(result.Response.body);
    	 $scope.recentAssets = angular.fromJson(result.Response.body);
    	 //alert($scope.recentAssets);
    	 //console.log("recentAssets is---"+JSON.stringify($scope.recentAssets));
    	 $scope.solutionBriefs = $filter('filter')($scope.assets, {
             Solution_Brief: "T"
         });
    });
	
   /* HighlightService().then(function(highlights) {
	    	var tempEvents= $filter('orderBy')(highlights.event.event, "date");
			//$scope.events =$scope.splitter(tempEvents);
			$scope.$broadcast('scroll.refreshComplete');
			$scope.errorMsg = "";
			$scope.iconLoad = false;
	        $scope.highlights = highlights.highlights.array;
	    	var tempAst ={};
	    	tempAst = $filter('orderBy')(highlights.ra.array, "Release_Date",true);
	    	tempAst = $filter('limitTo')(tempAst, 4);
	        //$scope.assets = $scope.splitter(tempAst);
	        
	        
	        $scope.errorMsg = "";
	        $scope.hideKeyBoard();
	        loadingImage.hide();
	    });*/
    }; 
    $scope.getHomePage();
    
    $scope.chn = function() {
        $ionicSlideBoxDelegate.next();
    };

    $scope.updateSlider = function() {
        $ionicSlideBoxDelegate.update(); //or just return the function
    };

    $scope.$on('HighlightService', function(event, error) {
        $scope.errorCode = error.errorCode;
        $scope.errorMsg = error.errorMsg;
        $scope.hideKeyBoard();
        $scope.$broadcast('scroll.refreshComplete');
        loadingImage.hide();
    });
    //console.log("homeCtrl", $scope);
   
    
    $scope.aPass = function (param1) {
    	$scope.modal.show();
    	$scope.selectedItem = param1;
    	//document.getElementsByClassName("readlinkColor")[0].setAttribute("class", "visitlinkColor");
    };
    
    //testimonial overlay
/*    $scope.selectedSlider = $stateParams.items;
    //console.log("idd"+$stateParams.items);*/
    $ionicModal.fromTemplateUrl('./views/testimonial-overlay.html', function($ionicModal) {
        $scope.modal = $ionicModal;
    }, {
        scope: $scope,
        animation: 'fade-in'
    });


	/*$scope.$on('EventsService', function (event, error) {
	    $scope.errorCode = error.errorCode;
	    $scope.errorMsg = error.errorMsg;
	    $scope.$broadcast('scroll.refreshComplete');
	    $scope.hideKeyBoard();
	    loadingImage.hide();
	 });*/
	
	//adding multiple items in the slide
    $scope.splitter = function(assets){
    	
    	var out=[];
    	var result={};
    	for(var il=1;il<=assets.length && assets.length > 0 ;il++){
    	  if(  (il % 2 == 0)){
    	    result.even=assets[il-1];
    	    out.push(result);
    	    result={};
    	  }else{   
    	    result.odd=assets[il-1];
    	    if(il===assets.length){
    	      out.push(result);
    	      result={};
    	      
    	    };
    	  };
    	};
    	return out;
    	//console.log(out);
    };
    
    $scope.hideKeyBoard();
    
});
app.controller('emailController', function($scope, $rootScope, $stateParams,$filter,$ionicSideMenuDelegate, ContactsService, EventsService, RecentAssetService, HighlightService, $window, $ionicSlideBoxDelegate, $ionicModal, timeoutFactory) {

	$scope.emailContactUs = function(){
	  /*  $scope.logoutSession = function() {
	    	clearTimeout($rootScope.timeoutVar);
	    	$rootScope.timeoutVar = setTimeout(function(){
	    	WL.Client.logout('LDAPRealm',{onSuccess: function(){WL.Client.reloadApp();}});
			$location.path('/acit');
	    	}, 600000);
		};
		$scope.logoutSession();*/
		timeoutFactory.clearTimeOut();
		timeoutFactory.setTimeOut();
			     
	    try {
	    	window.location.href = "mailto:acit-ww@accenture.com";
	    }
	    catch(err) {
	    	alert(err.message+ ". Please contact manually to ACIT mail id : mailto:acit-ww@accenture.com");
	    }
	    };
	
});
app.filter('custLimit',function(){
	return function(txt,limit){
		var limitStrin = txt.substring(0,limit);
		return txt.length > limit?limitStrin+".." : limitStrin+"";
	};
});
app.controller('appStoryController', function($scope, $rootScope, loadingImage, $ionicModal, timeoutFactory) {
	 loadingImage.hide();
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

	 $scope.storyContent = function () {
	    	$scope.modal1.show();
	    };
	    $ionicModal.fromTemplateUrl('./views/app-story.html', function($ionicModal) {
	        $scope.modal1 = $ionicModal;
	    }, {
	        scope: $scope,
	        animation: 'fade-in'
	    });
	    
	    $scope.keyContent = function () {
	    	$scope.modal2.show();
	    };
	    $ionicModal.fromTemplateUrl('./views/aboutApp-keyFeatures.html', function($ionicModal) {
	        $scope.modal2 = $ionicModal;
	    }, {
	        scope: $scope,
	        animation: 'fade-in'
	    });
	    $scope.newAppContent = function () {
	    	$scope.modal3.show();
	    };
	    $ionicModal.fromTemplateUrl('./views/aboutApp-newRel.html', function($ionicModal) {
	        $scope.modal3 = $ionicModal;
	    }, {
	        scope: $scope,
	        animation: 'fade-in'
	    });
});

app.controller('allianceCtrl', function($scope, loadingImage) {
	 loadingImage.hide();
});


//shiva added cloudStudioController for Cloud Studio page
app.controller('cloudStudioController', function($scope, loadingImage, $ionicModal,$location) {
	loadingImage.hide();
	$scope.goBack = function() {
		  window.history.back();
	};
	
	 var dataJson = [	
		                {  	 desc4:"Launched in August 2015, the ACIT Cloud Studio is an innovation hub for rapid prototyping, spearheaded by the Accenture Center for IBM technologies(ACIT) in collabration with IBM software. In order to be agile, robust and scalable, and execute on our vision we leverage IBM Bluemix which is categorized in the Cloud Application Platform (CAP) segment of PasS, enabling developers bulid, deploy and manage cloud-based applications, and provide value-added functionality and services directly or via third parties",
		                	 data1:[{data1:"Innovative"},{data1:"Rapid App on Bluemix"},{data1:"IBM Cloud"}],
		                	 data2: [{data1:"Liquid"},{data1:"Intelligent"},{data1:"Connected"}],
		                	 data3:[{data1:"Speed Devp."},{data1:"Ecosystem"},{data1:"Agility"},{data1:"Digital"}],
		                	 data4: [{data1:"Understand"},{data1:"Explore"},{data1:"Prototype"},{data1:"Evaluate"}],
		                }
		                ];                      
		
	    	$scope.jsonobject=dataJson;

});

app.controller('businessContextController', function($scope, loadingImage, $ionicModal,$location) {
	loadingImage.hide();
	$scope.goBack = function() {
		  window.history.back();
	};
	
	 var dataJson = [	
		                {  	 decs1:"New technologies are accelerating the pace of business",
		                	 decs2:"Existing business and IT approaches lag behind",
		                	 decs3:"Companies need to fundamentally redefine the business of applications",
		                	 decs5:"assembled leveraging modular and micro architecture, and next generation integration techniques",
		                	 decs6:"with the ability to comprehend, act and learn",
		                	 decs7: "thereby extending company boundaries through software",
		                }
		                ];                                                  
		                                                      
		
		
	    	$scope.jsonobject=dataJson;

});


app.controller('businessPartnershipController', function($scope, loadingImage, $ionicModal,$location) {
	loadingImage.hide();
	$scope.goBack = function() {
		  window.history.back();
	};
	
	var dataJson = [	
	                {  	 test1:"A 15+ year global partnership sustaining Accenture's position as the world's largest implementer of IBM technology.",
	                	 test2:[{data1:"Bluemix"},{data1:"Commerce"},{data1:"Mobile"}],
                         test3: "IBM- Technology skilled practitioners globally",
                         test4:"The ACIT is the Jewel in the crown of Accenture's technology eco-system",
                         test5: "-Jim Hayes, TE&P Alliances lead",
	                }
	                ];             
	
    	$scope.jsonobject=dataJson;
    	
});

app.controller('acitinnumberController', function($scope, loadingImage, $ionicModal,$location) {
	loadingImage.hide();
	$scope.goBack = function() {
		  window.history.back();
	};
	
	var data2Json = [	
	                {  
                         test6: "Unparalleled level and frequency of support to Accenture client engaement teams ensuring world-class IBM-Technology solutions for our clients",
                         test7:"client engagement teams supported concurrently",
	                	 test8:"client team enquiries supported by ACIT annually",
	                	 test9:"hours committed  annually to asset development",
	                	 test10:"assets utilized annually",
	                	 test11:"Accenture Practitioners trained annually",
	                	 test12:"IBM-Technology skilled practitioners globally",
	                	 test13:[{data:"Bangalore"},{data:"Barcelona"},{data:"Chicago"},{data:"China"},{data:"Denver"},{data:"London"},{data:"Madrid"},{data:"Malaga"},{data:"Mumbai"},{data:"Oslo"},{data:"Philadelphia"}],
	                }
	                ];                                                  
	                                                     
	
    	$scope.jsonobject=data2Json;
   
});