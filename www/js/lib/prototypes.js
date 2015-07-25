"use strict";
(function () {
	/**
	* sortBy:
	* Thanks to [Ege Özcan](http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/31106445#4760279).
	* And [My Enhancment](http://stackoverflow.com/questions/1129216/sort-array-of-objects-by-string-property-value-in-javascript/31106445#31106445)
	*/

	/*########################################################################################*/
	/*################################## prototypes helpers ##################################*/
	/*########################################################################################*/

	/*################################### Object prototype ###################################*/

		var _toDateTime = function () {
			if (this === null || this === false) 
				return null;
			var d = new Date(this);
			return (isNaN(d.valueOf())) ? null : d;
		}

		var _deepVal = function (propertyChain) {
			var levels = propertyChain.split('.');
			parent = this;
			for (var i = 0; i < levels.length; i++) {
				if (!parent[levels[i]])
					return ;
				parent = parent[levels[i]];
			}
			return parent;
		}
	/*################################### /Object prototype ###################################*/

	/*#################################### Array prototype ####################################*/

		var _sortBy = function() {
			var fn = this.sort(
				_dynamicSortMultipleFields.apply(null, arguments)
				);
			return fn;
		}

		var _dynamicSortMultipleFields = function () {
			/*
			* save the arguments object as it will be overwritten note that
			* arguments object is an array-like object consisting of the names of
			* the properties to sort by
			*/
			var properties = arguments;
			return function (obj1, obj2) {
				/**
				* try getting a different result from 0 (equal) as long as we
				* have extra properties to compare
				*/
				var i = 0, result = 0, n = properties.length;
				while(result === 0 && i < n) {
					result = _dynamicSort(properties[i])(obj1, obj2);
					i++;
				}
				return result;
			};
		}

		var _dynamicSort = function (property) {
			var order = 1;
			if(property[0] === "-") {
				order = -1;
				property = property.substr(1);
			}
			return function (a,b) {
				var result = ((a.deepVal(property) > b.deepVal(property)) - (a.deepVal(property) < b.deepVal(property)));
				return result * order;
			}
		}

		var _find = function (callback) {
			if (typeOf(callback) === 'Function') {
				var array = this;
				for (var index in array){
					if (callback(array[index], index)) 
						return array[index];
				}
				return null;
			};
			throw 'TypeError: ' + callback + 'is not a function';
		}

		var _contains = function (value) {
			return !!~this.indexOf(value);
		}
	/*################################### /Array prototype ###################################*/

	/*################################### Number prototype ###################################*/

		var _toRad = function (from) {
			from = from || 'degree';
			var value = this;
			if (from === 'degree') {
				return value * Math.PI / 180;
			} else if (from === 'grad') {
				return value * Math.PI / 200;
			};
		}

		var _toDegree = function (from) {
			from = from || 'radian';
			var value = this;
			if (from === 'radian') {
				return value * 180 / Math.PI;
			} else if (from === 'grad') {
				return value * 9 / 10;
			};
		}

		var _toGrad = function (from) {
			from = from || 'radian';
			var value = this;
			if (from === 'radian') {
				return value * 200 / Math.PI;
			} else if (from === 'degree') {
				return value * 10 / 9;
			};
		}
	/*################################### /Number prototype ###################################*/

	/*################################### String prototype  ###################################*/

		var _direction = function () {
			var text = this,
			half = parseInt(text.length / 2),
				matches = text.match(/[\u0600-\u06FF]/g);

			matches = matches && matches.length || 0;

			return (matches > half)? "rtl" : "ltr";
		}

		var _escapeRegExp = function () {
			return this.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
		}

		var _utf8_to_b64 = function () {
		    return window.btoa(unescape(encodeURIComponent(this)));
		}

		var _b64_to_utf8 = function () {
		    return decodeURIComponent(escape(window.atob(this)));
		}

		var _format = function(replaceWith, options){
			options = options || {};
			var str = ('' + this).trim(),
				pattern = /\{\{\s*(\d+|[a-z][\w\.]+)\s*(|\|(\s*\w*)+)\s*\}\}/ig,
				regResult,
				replacement = {};

			console.warn('Remember to fix multi placeholder args problem');

			while (regResult = pattern.exec(str)) {
				if (window.debug) {console.info(regResult[3])}
				replacement[regResult[1]] = {
					expression: regResult[0],
					args:(regResult[2].trim())? regResult[3].trim().split(' ') : [],
				};
			}

			for (var key in replacement) {
				var property = replaceWith.deepVal(key);
				var valid = (property !== undefined);
				if (valid || !options.messy){
					var exp  =replacement[key].expression.escapeRegExp(),
						rgx = new RegExp( exp, 'g'),
						sub = (valid)? property: '';
					if (typeOf(sub) == 'Function') {
						sub = sub.apply({}, replacement[key].args).toString();
					} else {
				if (window.debug) console.warn(str);
						for (var i = 0; i < replacement[key].args.length; i++){
							sub = sub[replacement[key].args[i]]();
						}
					}

					str = str.replace(rgx , sub);
				}
			}
			return str;
		}
	/*################################### /String prototype ###################################*/
	/** 
		* Calculate DateTime value of Object
		* @method 	toDateTime
		* @type 	DateTime || String || Number 
		* @return 	new Date of value if Valid, otherwise null 
		* @example
		* 	number = 1435787432670;
		* 	number.toDateTime() // @return new Date(number)
		* 	invalidValue = 'invalidValue';
		* 	invalidValue.toDateTime() // @return null
		* 
		* Find Value of a given node in nested JSON object 
		* @method 	deepVal
		* @type 	JSON
		* @param 	String 		dot Notation node address
		* @return 	[type?]		if node found Value, otherwise undefined
		* @example
		* 	object = { first: {firstsSecond: 'the value'}, second: ...}
		* 	object.deepVal('first.firstsSecond') // @return 'the value'
	*
	*/
	new Methods({
		toDateTime: _toDateTime,
		deepVal: _deepVal
	}, Object.prototype);

	/**
		* Sorts array ob Objects by field(s)
		* @method 	sortBy
		* @param 	{String}	field(s) address (uses deepVal to reach further deep)
		* @example
		* 	objectsList = [
		* 		{ first: {firstsSecond: 12}, second: ...},
		* 		{ first: {firstsSecond: 1}, second: ...},
		* 		{ first: {firstsSecond: 13}, second: ...},
		* 		{ first: {firstsSecond: 3}, second: ...},
		* 		...
		* 	];
		* 	objectsList.sortBy('first.firstsSecond');
		* Add find functionality to array if not implemented yet
		* @method 	find
		* @param 	{Function}	callback	[function for truth examination]
		* @return 	{}						[if found array element O.W null]
		* @example
		* 	numbersList = [1, 2, 3, 4]
		* 	numbersList.find(function(value, index){ return (value === 2 || index > 4) }); // 2
		* 	numbersList.find(function(value, index){ return (value === 5) }); // null
	*
	*/
	new Methods({
		sortBy: _sortBy,
		find : Array.prototype.find || _find,
		contains : Array.prototype.contains || _contains,
	}, Array.prototype);

	/**
		* Converts angles (Deg || Rad || Grad)
		* @method 	toRadian || toDegree || toGrad
		* @param 	{String}	from	type of input angel if not set converts with it's default 
		*                       (degree for toRadian and radian for other)
		* @return	{Number}
		* @example
		* 	rad = Math.PI;
		* 	degree = 180;
		* 	grad = 200;
		* 	
		* 	rad.toGrad();			// 200
		* 	degree.toRadian();		// 3.141592653589793
		* 	degree.toGrad('degree');// 200
		* 	grad.toRadian('grad');	// 3.141592653589793
	*
	*/
	new Methods({
		toRadian: _toRad,
		toDegree: _toDegree,
		toGrad: _toGrad
	}, Number.prototype);

	/**
		* @method 	format
		* Replace {{ref}} with arguments[i].ref value
		* @param 	{Object || Array}	replaceWith [what to take place]
		* @param 	{Object}			options:{
		*         							messy 	{Boolean} [if !true clears expresions whitout replacement]
		*         						}
		* @return	{String} 			[template with replaceWith values]
		* @example
		* 	template = 'my name is {{name}}.';
		* 	template.format({name: 'Morteza Tourani'}); // 'my name is Morteza Tourani.'
		* 	template = ' {{0}} {{1}} {{2}} Test{{3}}.';
		* 	template.format(['this', 'is', 'a', '']); // 'this is a Test.'
		* 	template.format(['these', 'are', '', 's']); 'these are  Tests.'
		*
		* 				this method needs improvemnet for additional functionality
		*
		* @method 	utf8_to_b64
		* Converts text from UTF-8 to Base64
		* @return {String} [Converted text]
		* @example
		* 	('I ♡ Unicode!').utf8_to_b64(); // 'SSDimaEgVW5pY29kZSE='
		* 
		* @method 	b64_to_utf8
		* Converts text from Base64 to UTF-8
		* @return {String} [Converted string]
		* @example
		* 	('SSDimaEgVW5pY29kZSE=').b64_to_utf8(); // 'I ♡ Unicode!'
		* 	
		* @method 	escapeRegExp
		* Escapes Regular Expression's special characters
		* @return {String} [Escaped string]
		* @example
		* 	('a|b').escapeRegExp(); // 'a\|b'
		* 
	*
	*/
	new Methods({
		format : _format,
		utf8_to_b64: _utf8_to_b64,
		b64_to_utf8: _b64_to_utf8,
		escapeRegExp: _escapeRegExp,
		direction: _direction,
	}, String.prototype)

})();
