"use strict";
var PlaceForm = 
(function () {
	/**
	* Any thing to do with place data
	* Second Phone input handler with intlTellInput
	*/

	var that = {},
		args = {
			model: Place(),
			id: "place-form",
			template: '',
		};

	Fields ({
		phone: "object"
	}, that);

	Methods ({
		refresh: function () {
			$(that.selector()).trigger('create');
		}
	}, that);

	PageWidget.call(that, args);

	(function (parent) {
		var base = {},
			phone = that.Phone,
			args = {
				id: 			parent.id + "-phone-group",
				itemElement: 	"input",
				itemTemplate: 	document.getElementById("palce-form-phone-template").innerHTML
			},
			intlargs = {
				defaultCountry: "ir",
				preferredCountries: ["ir",],
				responsiveDropdown:true,
				autoFormat:true,
			};

		ControlgroupWidget.call(phone, args);

		base = {
			refresh: phone.refresh,
			add: phone.add
		};

		new Methods({
			number: function () {
				
			},
			add: function (phoneItem) {
				if ( typeOf(phoneItem) !== typeOf(Phone()) || ! phoneItem.isValid() )
					phoneItem = Phone();
				base.add(phoneItem);
			},
			refresh: function () {
				var view = $(phone.selector()),
					parent = view.parent();
				if (phone.data().length) {
					parent.show();
					base.refresh()
					view.find(phone.ITEM_ELEMENT).intlTelInput(intlargs);
				} else {
					parent.hide();
				}
			}
		}, phone);
	})(args);

	return that;
})();
