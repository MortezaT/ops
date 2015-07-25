var map ,
	app = {
	// Application Constructor
	initialize: function() {
		app.bindEvents();
		// initMap();
	},
	// Bind Event Listeners
	//
	// Bind any events that are required on startup. Common events are:
	// 'load', 'deviceready', 'offline', and 'online'.
	bindEvents: function() {
		document.addEventListener('deviceready', this.onDeviceReady, false);
	},
	// deviceready Event Handler
	//
	// The scope of 'this' is the event. In order to call the 'receivedEvent'
	// function, we must explicitly call 'app.receivedEvent(...);'
	onDeviceReady: function() {
		// google.maps.event.addDomListener(window, 'load', app.initialize);
		if (navigator.geolocation) {
			
				navigator.geolocation.getCurrentPosition(
					function (args) {
						// plugins.toast.showLongCenter("Hello");
						// navigator.notification.alert("Succeed " + args.coords.latitude + ", " + args.coords.longitude);
					}
				)
			
		};
	},
	// Update DOM on a Received Event
};

app.initialize()
