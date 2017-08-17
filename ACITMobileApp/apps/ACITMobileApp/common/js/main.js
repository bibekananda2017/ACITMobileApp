function wlCommonInit() {

	/*
	 * Application is started in offline mode as defined by a connectOnStartup property in initOptions.js file.
	 * In order to begin communicating with Worklight Server you need to either:
	 * 
	 * 1. Change connectOnStartup property in initOptions.js to true. 
	 *    This will make Worklight framework automatically attempt to connect to Worklight Server as a part of application start-up.
	 *    Keep in mind - this may increase application start-up time.
	 *    
	 * 2. Use WL.Client.connect() API once connectivity to a Worklight Server is required. 
	 *    This API needs to be called only once, before any other WL.Client methods that communicate with the Worklight Server.
	 *    Don't forget to specify and implement onSuccess and onFailure callback functions for WL.Client.connect(), e.g:
	 *    
	 *    WL.Client.connect({
	 *    		onSuccess: onConnectSuccess,
	 *    		onFailure: onConnectFailure
	 *    });
	 *     
	 */

	// Common initialization code goes here
	
	console.log("Loading Angular");
	angular.element(document).ready(function() {
		angular.bootstrap(document, [ 'acitapp' ]);
	});	
	/*var setup = {
			applicationId : "6d6725ba-a2a6-4953-b02c-145725d16ef4",
			applicationRoute : "http://acitmobilepushtest.eu-gb.mybluemix.net",
			applicationSecret : "c26d75bb846e30f99bc6c57da3e7639394c31cd8",
		};

		// Initialize the IBM Bluemix SDK with the application parameters.
		IBMBluemix.initialize(setup).then(function() {

			console.log("initializeService---- - " + IBMPush.initializeService());
			return IBMPush.initializeService();

		}).then(
				function(push) {

					// Use the Push Service
					console.log("push service---- - ");
					push.registerDevice("ACITUser", "UserName",
							"alertNotification").done(function(response) {
						// Device successfully registered
						console.log("Device registered suceesfully---");
					}, function(err) {
						console.log("Error in Device registered ---");
						// Handle errors
					});

				});

*/
	
	//WL.Client.login("LDAPRealm");

}
/*function alertNotification(info) {
	   //console.log("registerListener - " + info.alert);
	   alert(info.alert);
	}*/
function wlEnvInit() {
	

	wlCommonInit();
	// Environment initialization code goes here
}
