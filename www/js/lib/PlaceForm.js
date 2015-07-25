"use strict";
(function () {
	/**
	* any thing to do with place data
	* Second Phone input handler with intlTellInput
	*/
	window.PlaceForm = function PlaceForm (args) {
		args = args || {};

		var that={},
			args = {
				model: Place(),
				id: "place-dialog",
				template: '',
			},
			listviewargs = {
				id: 			args.id + "-listview",
				itemElement: 	"li",
				itemTemplate: document.getElementById('history-panel-li-template').innerHTML,
			},
			phoneArgs = {
				id: 			args.id + "-phonegroup",
				itemElement: 	
			},


		phoneArgs.id = 'phone-' + ( args.id || 1 );
		phoneArgs.itemTemplate = 
			'<input id="' +
				inputHandlerArgs.id +
			'" type="tel" name="phone" class="phone ltr">';

		var that = new function Phone () {},
			inputHandler = new function Phone () {};

		
		new Methods({
			number: function () {
				
			},
			add: function () {
				that.Temp
			}
		}, inputHandler);

		/** Constructor */
		that.Number = args.Number;

		return that;
	}
})();
