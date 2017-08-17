angular
		.module('acitapp.services', [])
		.factory(
				'LoginService',
				function($q, $http, ErrorBroadcastService) {
					return {
						getUserValidation : function(encryptedUserId,encryptedPassword,iv,salt) {
							var deferred = $q.defer();
							var accounturl = "http://acitmobileapp.mybluemix.net/api/Userlogin/login";
							 	$http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"username":encryptedUserId,
										"password":encryptedPassword,
										"iv":iv,
										"salt":salt},
							        url: accounturl
							        
							    })
								.success(
											function(data) {
												console.log("Role is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})

		.factory(
				'HighlightsService',function($q, $http,ErrorBroadcastService,ImageService) {
					return {
						fetchAllImages : function() {
							var deferred = $q.defer();

							$http
									.get(
											'http://acitmobileapp.mybluemix.net/api/Highlights')

									.success(
											function(data) {
												
												var result = [];
												var promises = [];
												for(var i=0;i<data.length;i++){
													promises.push(ImageService.fetchImages(data[i].id).then(function(result1) {
														console.log("Result 1 is-----"+result1);
														result.push(result1);
													}));
												}
												$q.all(promises).then(function(){
												    //console.log("Prmises arra 1----"+JSON.stringify(result[0]));
												    deferred.resolve(result);
												});
												

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
						
					};

				})
				.factory('ImageService',function($q, $http,ErrorBroadcastService) {
					return {
						fetchImages : function(id) {
							var deferred = $q.defer();

							$http
									.get(
											'https://08d21487-f215-4081-b472-af10bf2f3e6f-bluemix:f21e468ad3cbb34d8a67acbee8e3a74d3cf6e379021360071c804c00621c9662@08d21487-f215-4081-b472-af10bf2f3e6f-bluemix.cloudant.com/highlightdb/'+id)
									
									.success(
											function(data) {
												/*console.log("Highligh 1 image data is---"
														+ JSON.stringify(data));*/
												
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})
		.factory(
				'ProductService',
				function($q, $http, ErrorBroadcastService) {
					return {
						fetchAllProducts : function(isAuthenticated) {
							var deferred = $q.defer();
							var productsURL = 'http://acitmobileapp.mybluemix.net/api/Products/getProducts';
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated
									},
							        url: productsURL
							        
							 })
								.success(
											function(data) {
												console.log("Product is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})
		.factory(
				'RoleService',
				function($q, $http, ErrorBroadcastService) {
					return {
						fetchAllUsers : function() {
							var deferred = $q.defer();

							$http
									.get(
											'https://acitmobileapp.mybluemix.net/api/Getroles')

									.success(
											function(data) {
												console.log("Role is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})
		.factory(
				'ClientActivityService',
				function($q, $http, ErrorBroadcastService) {
					return {
						fetchClientDetails : function(isAuthenticated) {
							var deferred = $q.defer();
							//var clientActivityURL = 'http://acitmobileappservice.mybluemix.net/ClientActivityService';
							var clientActivityURL = "http://acitmobileapp.mybluemix.net/api/Clientactivities/getClientDetails";
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated
									},
							        url: clientActivityURL
							        
							 })
								.success(
											function(data) {
												console.log("Client Activity is---"
														+ angular.fromJson(data.Response.body));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})

		.factory(
				'PushService',
				function($q, $http, ErrorBroadcastService) {
					return {
						registerDevice : function() {
							var deferred = $q.defer();
							var url = "https://imfpush.ng.bluemix.net/imfpush/v1/apps/9591aa91-a36b-489c-beee-35468ab83c2e/devices";
							var data = {"deviceId":"SampleDeviceId","platform":"A","token":"SampleToken","userId":"SampleUser"};
							 var config = {
						                headers : {
						                    "Content-Type": "application/json",
						                    "clientSecret" : "d0d1e340-af2f-4aae-b7e6-420c112928f6"
						                }
						                
						            };
							$http
									.post(
											url,data,config)

									.success(
											function(data) {
												console.log("Device is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})
		.factory(
				'AssetService',
				function($q, $http, ErrorBroadcastService) {
					return {
						fetchAllAssets : function(isAuthenticated) {
							var deferred = $q.defer();
							//alert("Service");
							var assetsURL = 'http://acitmobileapp.mybluemix.net/api/Assets/getAssets';
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated
									},
							        url: assetsURL
							        
							 })

									.success(
											function(data) {
												deferred.resolve(data);
											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
						
					};

				})
		.factory(
				'AnnouncementService',
				function($q, $http, ErrorBroadcastService) {
					return {
						fetchAnnouncements : function() {
							var deferred = $q.defer();

							$http
									.get(
											'https://acitmobileappservice.mybluemix.net/AnnouncementService')

									.success(
											function(data) {
												console.log("Data is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
					};

				})
		.factory(
				'EventsService',
				function($q, $http, ErrorBroadcastService) {

					return {
						fetchEvents : function() {
							var deferred = $q.defer();

							$http
									.get(
											'https://acitmobileappservice.mybluemix.net/EventService')

									.success(
											function(data) {
												console.log("Data is---"
														+ JSON.stringify(data));
												/*
												 * deferred.resolve({
												 * 
												 * });
												 */
												deferred.resolve(data);

											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;

						}
					};
					// };

				})
		.factory(
				'ProductsService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getProducts',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'ProductsService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'AssetsService',
				function($q, $http, ErrorBroadcastService) {

					var AssetsService = {};
					AssetsService.getProductAssets = function(product_id) {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getProductAssets',
							parameters : [ product_id ]
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AssetsService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

					return AssetsService;

				})
		.factory('ErrorBroadcastService', function($q, $http, $rootScope) {

			var ErrorBroadcastService = {};
			ErrorBroadcastService.broadcastError = function(name, message) {
				$rootScope.$broadcast(name, message);
			};
			return ErrorBroadcastService;
		})

		.factory('NewsFeedService', function($q, $http, ErrorBroadcastService) {

			return {
				fetchACNNews : function(isAuthenticated) {
					var deferred = $q.defer();
					//var acnNewsURL = 'https://newsroom.accenture.com:443/subjects/technology/rss.xml?show_feed=true&category_id=20';
					var acnNewsURL = 'http://acitmobileapp.mybluemix.net/api/Acnnews/getNews';
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated
									},
							        url: acnNewsURL
							        
							 })
							.success(
									function(data) {
										console.log("Accenture news data is---"
												+ JSON.stringify(data));
										/*
										 * deferred.resolve({
										 * 
										 * });
										 */
										deferred.resolve(data);

									}).error(function(msg, code) {

								deferred.reject(msg);

								$log.error(msg, code);

							});

					return deferred.promise;

				},
				fetchIBMNews : function(isAuthenticated) {
					var deferred = $q.defer();

							//var ibmNewsURL = 'https://www-03.ibm.com:443/press/us/en/rssfeed.wss?keyword=null&maxFeed=&feedType=RSS&topic=242';
							var ibmNewsURL = 'http://acitmobileapp.mybluemix.net/api/Ibmnews/getNews';
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated
									},
							        url: ibmNewsURL
							        
							 })
							.success(
									function(data) {
										console.log("IBm News Data is---"
												+ JSON.stringify(data));
										
																			 
										deferred.resolve(data);

									}).error(function(msg, code) {

								deferred.reject(msg);

								$log.error(msg, code);

							});

					return deferred.promise;

				}
			};
			/*
			 * var NewsFeedService = {}; NewsFeedService.getIBMNewsFeed =
			 * function(){ //console.log("In Service Method"); var deferred =
			 * $q.defer(); var invocationData = { adapter:
			 * 'IBMNewsFeedHTTPAdapter', procedure: 'getNewsFeed', parameters: [] };
			 * 
			 * WL.Client.invokeProcedure(invocationData,{ onSuccess :
			 * $.proxy(function(data) {
			 * deferred.resolve(data.invocationResult.newsfeed); },this),
			 * onFailure : $.proxy(function(error) {
			 * ErrorBroadcastService.broadcastError('IBMNewsFeedService',error);
			 * //console.log("ERROR BROADCAST"); deferred.reject(error); },this)
			 * }); return deferred.promise; };
			 * 
			 * NewsFeedService.getAccentureNewsFeed = function(){
			 * //console.log("In Service Method"); var deferred = $q.defer();
			 * var invocationData = { adapter: 'AccentureNewsFeedHTTPAdapter',
			 * procedure: 'getNewsFeed', parameters: [] };
			 * 
			 * WL.Client.invokeProcedure(invocationData,{ onSuccess :
			 * $.proxy(function(data) {
			 * deferred.resolve(data.invocationResult.newsfeed); },this),
			 * onFailure : $.proxy(function(error) {
			 * ErrorBroadcastService.broadcastError('AccentureNewsFeedService',error);
			 * //console.log("ERROR BROADCAST"); deferred.reject(error); },this)
			 * }); return deferred.promise; };
			 * 
			 * return NewsFeedService;
			 */})
		/*.factory(
				'ClientActivityService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'ClientActivitySQLAdapter',
							procedure : 'getClientActivity',
							// timeout: 120,
							parameters : []

						};

						WL.Client
								.invokeProcedure(
										invocationData,
										{
											// timeout : 120,
											onSuccess : $
													.proxy(
															function(data) {
																// console.log('result'+data.invocationResult);
																deferred
																		.resolve(data.invocationResult.resultSet);
															}, this),
											onFailure : $
													.proxy(
															function(error) {
																ErrorBroadcastService
																		.broadcastError(
																				'ClientActivityService',
																				error);
																deferred
																		.reject(error);
															}, this)
										});
						return deferred.promise;
					};

				})
*/		.factory(
				'ContactsService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getContacts',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'ContactsService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'HighlightService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'Aggregate',
							procedure : 'getHomePage',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'HighlightService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'RecentAssetService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getRecentAsset',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'RecentAssetService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'AllAssetService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getAsset',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AllAssetService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'AllProductService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getProduct',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AllProductService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		.factory(
				'AllAssetProductService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getAssetProducts',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AllAssetProductService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

				})
		/*.factory(
				'AssetsByid',
				function($q, $http, ErrorBroadcastService) {

					var AssetsByid = {};
					AssetsByid.getAsset = function(id) {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'AssetsAdapter',
							procedure : 'getAssetId',
							parameters : [ id ]
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								deferred.resolve(data.invocationResult.array);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AssetsByid', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};

					return AssetsByid;
				})*/
		 .factory(
				'AssetsByid',
				function($q, $http, ErrorBroadcastService) {
					return {
						getAssetByID : function(isAuthenticated,id) {
							var deferred = $q.defer();
							//alert(isAuthenticated);
							//alert(id);
							//var assetsByidURL = 'http://acitmobileapp.mybluemix.net/api/Assets?filter[where][id]='+id;
							
							var assetsByidURL = 'http://acitmobileapp.mybluemix.net/api/Assets/getAssetsByID';
							 $http({
							        method: "POST",
							        headers: {
							        	"Content-Type" : "application/json",
										"isAuthenticated":isAuthenticated,
										"assetID":id
									},
							        url: assetsByidURL
							        
							 })
							.success(
											function(data) {
												console.log("Asset detail is---"
														+ JSON.stringify(data));
												deferred.resolve(data);
												
											}).error(function(msg, code) {

										deferred.reject(msg);

										//$log.error(msg, code);

									});

							return deferred.promise;
						}
						
					};

				})
		.factory(
				'authenticateService',
				function($q, $http, ErrorBroadcastService) {

					return function() {
						// console.log("In Service Method");
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'Aggregate',
							procedure : 'authenticate',
							parameters : []
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'authenticateService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};
				})
		.factory(
				'GetSubscriptionService',
				function($q, $http, ErrorBroadcastService) {

					return function(deviceID) {
						console.log("GetSubscriptionService device id"
								+ deviceID);
						// localStorage.getItem("deviceID");
						WL.ClientMessages.serverError = "";
						var deferred = $q.defer();
						var invocationData = {
							adapter : 'BluemixAdaptor',
							procedure : 'getUserSubscriptions',
							parameters : [ deviceID ]
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'GetSubscriptionService', error);
								deferred.reject(error);
							}, this)
						});

						return deferred.promise;
					};
				})
		.factory(
				'AddSubscriptionService',
				function($q, $http, ErrorBroadcastService) {

					return function(tag, deviceID) {

						var deferred = $q.defer();
						var invocationData = {
							adapter : 'BluemixAdaptor',
							procedure : 'addUserSubscriptions',
							parameters : [ deviceID, tag ]
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'AddSubscriptionService', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};
				})
		.factory(
				'RemoveUserSubscriptions',
				function($q, $http, ErrorBroadcastService) {

					return function(tag, deviceID) {

						var deferred = $q.defer();
						var invocationData = {
							adapter : 'BluemixAdaptor',
							procedure : 'removeUserSubscriptions',
							parameters : [ deviceID, tag ]
						};

						WL.Client.invokeProcedure(invocationData, {
							onSuccess : $.proxy(function(data) {
								// console.log('result'+data.invocationResult);
								deferred.resolve(data.invocationResult);
							}, this),
							onFailure : $.proxy(function(error) {
								ErrorBroadcastService.broadcastError(
										'RemoveUserSubscriptions', error);
								deferred.reject(error);
							}, this)
						});
						return deferred.promise;
					};
				})
		.factory(
				'loadingImage',
				function($ionicLoading) {

					var loadingIndicator = $ionicLoading
							.show({

								content : 'Loading Data',

								animation : 'fade-in',

								showBackdrop : false,

								maxWidth : 200,

								showDelay : 200,

								template : '<div class= "iconDiv"><i class="icon ion-loading-b"></i></div>'

							});

					return loadingIndicator;

				});
function compareDateString(today, eventDate) {
	var todayDate = today.substring(8, 10);
	var todayMonth = today.substring(5, 7);
	var todayYear = today.substring(0, 4);

	var eventDte = eventDate.substring(8, 10);
	var eventMnth = eventDate.substring(5, 7);
	var eventYear = eventDate.substring(0, 4);

	if (todayDate == eventDte && todayMonth == eventMnth
			&& todayYear == eventYear) {
		return 0;
	}
	if (eventYear > todayYear) {
		return 1;
	} else if (eventYear == todayYear) {
		if (eventMnth > todayMonth)
			return 1;
		else if (eventMnth == todayMonth) {
			if (eventDte > todayDate)
				return 1;
			else
				return -1;
		} else {
			return -1;
		}

	} else {
		return -1;
	}
}
