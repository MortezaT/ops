"use strict";
var Coordinate;
(function () {
	Coordinate = function Coordinate () {
		var that = this;
		new Fields({
			latitude: 	{ type: "number" },
			longitude: 	{ type: "number" },
			altitude: 	{ type: "number" },
			accuracy: 	{ type: "number" },
		}, that);
		
		new Methods({
			directDistance: function (other) {
				// Calculate distance between this coordinate and otherCoordinate
				var radius = 6371000, // metres
					phi1 = that.Latitude.toRadian(),
					phi2 = other.Latitude.toRadian(),
					dPhi = (other.Latitude - that.Latitude).toRadian(),
					dLambda = (other.Longitude - that.Longitude).toRadian(),
					a = Math.sin(dPhi/2) * Math.sin(dPhi/2) +
						Math.cos(phi1) * Math.cos(phi2) *
						Math.sin(dLambda/2) * Math.sin(dLambda/2),
					c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
				return radius * c;
			},
			toString: function () {
				if (that.Latitude || that.Longitude) 
					return that.Latitude  + ', ' + that.Longitude;
				return "Unknown";
			},
			latLang: function () {
				if (google) {
					return new google.maps.LatLng(that.Latitude, that.Longitude);
				};
				return [that.Latitude, that.Longitude];
			}
		}, that);
		var args = arguments[0] || {}
		that.Latitude  = args.Latitude;
		that.Longitude = args.Longitude;
		that.Altitude  = args.Altitude;
		that.Accuracy  = args.Accuracy;
	}
})();
