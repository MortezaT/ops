"use strict";
var typeOf,
	Constants,
	Fields,
	Methods,
	CaseConvert,
	DataObject,
	grabListFromArguments;

/*** CONSTs */
var TYPE_DEFAULT = {
		VALUE: {
			Number: 0,
			String: "",
			Boolean: false,
			Array: [],
			Object: {},
		},
		LIMIT: {
			Number: { min: -32768, max: 32767 },
			String: { min: 5, max: 300 },
		}
	},

	OPERATOR = {
		LIST:{
			COMPARISON: ['===', '!==','==', '!=', '<=', '>=', '<', '>', ],
			ARITHMETIC: ['+', '-', '*', '/', '%', '^','++', '--', ],
			ASSIGNMENT: ['+', '-', '*', '/', '%', '^','++', '--', ],
			LOGICAL:['||', '&&', '!', ],
			LOGICAL_BIT_WISE:['|', '&', '~', '^', '<<', '>>', ],
		},
		CALL: {
			COMPARISON: {
				'===':function (a, b) { return a === b; },
				'!==':function (a, b) { return a !== b; },
				'==':function (a, b) { return a == b; },
				'!=':function (a, b) { return a != b; },
				'<=':function (a, b) { return a <= b; },
				'>=':function (a, b) { return a >= b; },
				'<':function (a, b) { return a < b; },
				'>':function (a, b) { return a > b; },
			}
		}
	};
/** /CONSTs */

(function(){
	var dateHandler;

	typeOf = function (object) {
		if (typeof object === "number" && isNaN(object))
			return NaN;
		try {
			var type = object.constructor.name || Object.prototype.toString.call(object).slice(8, -1);
			return type;
		}
		catch(ex) {
			return "N/A";
		};
	};

	function dateHandler(value) {
		if (value === false) 
			return null;
		var dateTime,
			type = typeOf(value);
		if (type === 'Date') {
			dateTime = value;
		} else {
			dateTime = (new Date(value));
			if (isNaN(dateTime.getTime())) 
				dateTime = undefined;
		};
		return (dateTime) ? dateTime.toJSON() : undefined;
	}

	function constAccessor(args) {
		return {
			enumerable: false,
			configurable: false,
			writeable: true,
			get: args.getter,
		};
	}

	Constants = function (consts, object) {
		if (! consts)
			throw "TOO_FEW_PARAMETERS_FOR_CONSTRUCTION";
		var constsAccessor	= {},
			funType 		= typeOf(Function);
		for (var key in consts) {
			var constant = consts[key],
				constKey = CaseConvert(key).to_snake().get().toUpperCase(),
				getter = (typeOf(consts[key]) === funType) ?
					consts[key] :
					(function (key) { return function () { return consts[key]; } })(key);
				
			constsAccessor[constKey] = constAccessor({getter: getter});
		}
		Object.defineProperties(object, constsAccessor);
	}

	function fieldAccessor(object, args) {
		var key = args.key,
			type = args.type,
			defaultValue = args.defaultValue;

		if (defaultValue === undefined) {
			// defaultValue = (new window[type]()).valueOf();
			defaultValue = 	(TYPE_DEFAULT.VALUE[type] !== undefined)? 
							Object(TYPE_DEFAULT.VALUE[type]).constructor(): 
							null;
		} else {
			defaultValue = Object.create(defaultValue);
		}

		key = key[0].toLowerCase() + key.substr(1);
		object[key] = defaultValue;
		return {
			enumerable: true,
			configurable: true,
			get: function () {
				return object[key];
			},
			set: function (value) {

				var t = typeOf(value);
				if (value === null){
					object[key] = value;
				} else if (type === 'Date') {
					object[key] = dateHandler(value)
				} else if (t === type || value instanceof window[type]){
					object[key] = value;
				} 
			},
		};
	}

	Fields = function (fields, object) {
		/**
		* field properties
		* { 
		* 	type: [ required ] ( number | string | array | object | ... ),
		* 	defaultValue: [ optional ]
		* }
		*/

		if (! fields)
			throw "TOO_FEW_PARAMETERS_FOR_CONSTRUCTION";

		object = object || this;

		var obj = {};
		var fieldsAccessor = {};
		var fun = typeOf(function () {});
		for(var key in fields){
			var field = fields[key];
			if (typeOf(field) === typeOf('string'))
				field = { type: field };
			if ( typeOf(field) !== fun ) {
				var fieldHandler = key[0].toLowerCase() + key.substr(1);
				var accessorHandler = key[0].toUpperCase() + key.substr(1);
				if(! field.type)
					throw "Type not set for field: " + key ;
				
				var type =  field.type[0].toUpperCase() +  field.type.substr(1);
				fieldsAccessor[accessorHandler] = fieldAccessor(obj, {
					key : 			fieldHandler,
					type: 			type,
					defaultValue: 	field.defaultValue
				});
			}
		}
		Object.defineProperties(object, fieldsAccessor);
		return obj;
	}

	function methodAccessor(args) {
		var callback = args.callback,
			final    = args.final;

		return {
			enumerable: false,  // true allows counting in loops
			configurable: final !== true, // true allows Override
			writeable: true,
			value: callback,
		};
	}

	Methods = function (methods, object) {

		if (! methods)
			throw "TOO_FEW_PARAMETERS_FOR_CONSTRUCTION";

		object = object || this;

		var funType = typeOf(function () {}),
			methodsAccessor = {},
			final = false, 
			callback = null;

		for(var key in methods){
			var method = methods[key];

			if (typeOf(method) === funType) {
				callback = method;
				final = false;
			} else {
				callback = method.callBack;
				final = method.final;
			}

			methodsAccessor[key] = methodAccessor({
				callback: callback,
				final 	: final
			});
		}

		Object.defineProperties(object, methodsAccessor);
	}

	DataObject = function () {
		var locked = false;
		
		Methods({
			stringify: function () {
				if (!locked) {
					locked = true;
					var string =  JSON.stringify(this);
					locked = false;
					return string;
				};
			},
			clone: function () {
				if (!locked) {
					locked = true;
					var data = JSON.parse(
						JSON.stringify(this)
						);
					locked = false;
					return data;
				};
				return this;
			},
		}, this);
	};

	CaseConvert = function (string) {
		if (typeOf(string) !== 'String') 
			throw 'INVALID_INPUT: Argument type must be string';

		var cc = {},
		result = string;
		new Methods ({
			toCamel: function () {
				result = result.replace(/(_[a-z]|\s+\w)/g, function (u) { 
					return u.substr(u.length -1).toUpperCase(); 
				});
				return cc;
			}, to_snake: function () {
				var snake = result[0] + 
				result.substr(1).replace( /(\s+\w|[A-Z])/g, 
					function (c) { return '_' + c.trim(); });
				result =  snake.toLowerCase();
				return cc;
			}, toTitle: function () {
				var title = '';
				words = result.toLowerCase().split(' ');
				for (var i = 0; i < words.length; i++) {
					var word = words[i]
					title += ' ' + word[0].toUpperCase() + word.substr(1);
				};
				result = title.trim();
				return cc;
			}, unCamel: function () {
				// TODO: Implementation
				console.error('unCamel not implemented yet!')
				return cc;
			}, un_snake: function () {
				// TODO: Implementation
				console.error(this, 'un_snake not implemented yet!')
				return cc;
			}, origin: function () {
				return string;
			}, get: function () {
				return result;
			}
		}, cc);
		return cc;
	}

	grabListFromArguments = function (args) {
		var result;
		if (args.length === 1) {
			result = typeOf(args[0]) === 'Array' && args[0] || [args[0]];
		} else if (args.length > 1) {
			result = Array.prototype.slice.call(args);
		};
		return result;
	}

	window.Animate = function (object, args) {
		// Check if the browser supports the transform (3D) CSS transition
		if (!$.support.cssTransform3d) 
			return args.callback();
		object
			.addClass(args.class)
			.on( "webkitTransitionEnd transitionend otransitionend", 
				function (e) {
					args.callback(e);
				}
				// function (e) { console.log(e); }
				);
	}
})();
