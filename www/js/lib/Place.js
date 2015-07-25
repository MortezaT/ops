"use strict";
(function () {
	window.Phone = function (args) {
		args = args || {};
		var that = new function Phone () {};

		new Fields({
			number:{type: "string"},
		},that);

		new Methods({
			toString: function () {
				return that.Number;
			},
			valueOf: function () {
				return that.Number;
			},
			isValid: function (number) {
				return intlTelInputUtils.isValidNumber(number || that.Number);
			}
		}, that);

		_construct(args);

		return that;
		
		function _construct (args) {
			if (that.isValid(args.Number))
				that.Number = args.Number;
		}
	}
	
	window.Place = function (args) {
		var args = args || {},
			that = new function Place () {},
			query, queryStarted;

		new Fields ({
			title: "string",
			coordinate: "coordinate",
			address: "string",
			phones: "array",
			description: "string",
		}, that);

		var toString = function () {
			return that.Title || 'Untitled @ ' + that.Coordinate;
		}

		new Methods({
			toString: toString,
		},that);

		_construct(args);

		return that;
		
		function _construct (args) {
			MyCRUD.call(that, args);

			query = [],
			queryStarted = false;

			that.Title = args.Title;
			that.Coordinate = new Coordinate(args.Coordinate);
			that.Address = args.Address;

			if (args.Phones) {
				args.Phones.forEach(function (phone) {
					that.Phones.push(new Phone(phone));
				});
			} else {
				args.Phones = null
			}
			that.Description = args.Description;
		}

	};

})()
