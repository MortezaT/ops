'use strict';
(function () {
	window.placesDesc = {
		factory : {en: "Factory", fa: "کارخانه"},
		gas_stations : {en: "Gas Stations", fa: "سوخت"},
		police : {en: "Police Department", fa: "پلیس"},
		parks : {en: "Park", fa: "پارک"},
		parking_lot : {en: "Parking", fa: "پارکینگ"},
		sea_ports : {en: "Sea Port", fa: "بندر"},
		cemetary : {en: "Cemetery", fa: "مقبره و قبرستان"},
		museum : {en: "Museum", fa: "موزه"},
		schools : {en: "School", fa: "مدرسه"},
		library : {en: "Library", fa: "کتابخانه"},
		prayer : {en: "Prayer", fa: "مسجد و زیارتگاه"},
		heliport : {en: "Hlei port", fa: "چرخبال"},
		grocery : {en: "Grocery", fa: "فروشگاه"},
		govtbldgs : {en: "Government Buildings", fa: "اماکن دولتی"},
		airports : {en: "Air port", fa: "فرودگاه"},
		bus : {en: "Bus Station", fa: "اتوبوس"},
		cabs : {en: "Taxi", fa: "تاکسی سرویس"},
		campground : {en: "Camp Ground", fa: "تفریگاه خارج شهر"},
		hospitals : {en: "Hospital", fa: "بیمارستان"},
		lodging : {en: "Lodging", fa: "استراحتگاه"},
		movies : {en: "Movie and Theater", fa: "فیلم و تئاتر"},
		rail : {en: "Train Station", fa: "قطار"},
		subway : {en: "Subway Station", fa: "مترو"},
	};

	(function() {
		function getScript(src, async) {
			document.write('<script src="' + src + '"' + (async)? 'async': '' + '><' + '/script>');
		}
	})();

	(function () {
		window.gmap = window.gmap || {};
		var that = gmap,
			initiated = false,
			place;

		new Fields({
			canvas: "HTMLElement",
			options: "object",
			map: "object",
		}, that);

		new Methods({
			init: _gMap_init,
		}, that);

		var _afterInit = (function () {
			return function () {
				var _afterInit = this;
				new Methods({
					goTo: _gMap_goTo,
					highlightRange: _gMap_highlightRange,
					show: _gMap_show,
					place: _gMap_palce,
				}, _afterInit)
			}
		})();

		function _gMap_init (canvas, options) {
			that.Canvas = canvas;
			that.Options = options;
			that.Map = new google.maps.Map(that.Canvas, that.Options);
			_afterInit.call(that);
			return that;
		}

		function _gMap_goTo () {
			that.Map.setCenter(place.Coordinate.latLang());
			return that;
		}

		function _gMap_highlightRange() {
			var circle = new google.maps.Circle({
				center: place.Coordinate.latLang(),
				radius: place.Coordinate.Accuracy,
				map: that.Map,
				fillColor: '#70E7FF',
				fillOpacity: 0.2,
				strokeColor: '#0000FF',
				strokeOpacity: 1.0
			});
			return that;
		}

		function _gMap_show() {
			var marker = new google.maps.Marker({
				position: place.Coordinate.latLang(),
				map: that.Map,
				title: place.toString()
			});
			if (place.Icon) 
				marker.setIcon(locationg.Icon);
			return that;
		}

		function _getAddress () {
			new google.maps.Geocoder().geocode(
			  {
			    'location': place.Coordinate.latLang()
			  },
			  function(results, status){
			    console.log(status, results);
			  });
		}

		function _gMap_palce (newPlace) {
			if (newPlace) {
				if (typeOf(newPlace) === "Place") {
					place = newPlace;
					return that;
				};
				throw "INVALID_PLACE";
			};
			return place.clone();
		}
	})();
})();
