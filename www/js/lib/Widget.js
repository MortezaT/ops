"use strict";
var Widget;
(function () {
	/**
	*
	 * [Widget normal implementations]
	 * @method Widget
	 * @param  {JSON} args
	 * {
	 * 		id: 			{String}	[ID of view]
	 * 		class: 			{String}	[Name of class(es) (separate by space if more than one class)]
	 * 		virtual: 		{Boolean}	[if true means "view not created yet!" and Widget will create element from given tag or div element]
	 * 		tag: 			{String}	[Tag name of element if virtual]
	 * 		view: 			{JSON}		[View parameters]
	 * 		{
	 * 			attributes: {JSON}		[Element attributes]
	 * 			data: 		{JSON}		[Attributes starting with "data-" like data-role]
	 * 		}
	 * }
	* 
	*/
	Widget = function Widget (args) {
		args = args || {};

		if (! (args.id || args.class))
			throw "Widget received neither id or class name (Widget.js)";
		if (! args.role){
			console.info(args);
			throw "Widget.js:\t Widget role is ";
		}

		setProperty(args.deepChild("view.attributes"), args.deepVal("view.data"), { prefix: "data" });
		args.deepChild("view.attributes")["data-role"] = args.role;
		

		var that = this,
			virtual = args.virtual,
			role = args.role,
			contents = {},
			view = (virtual) ? createElement(args.view) : {};

		
		view.id = args.id || "";
		view.className = (args.class || "").trim();

		new Constants ({
			template: args.template
		}, that);

		new Methods({
			id: function () {
				return that.view().id;
			},
			className: function () {
				return that.view().className;
			},
			selector: function () {
				var view = that.view();
				var selector = "" + 
					((view.id) ? '#' + view.id : '') + 
					((view.className) ? '.' + view.className.trim().split(" ").join(".") : '');
				return selector;
			},
			view: function (refresh) {
				if (refresh && !virtual || !view)
					view = document.querySelector(that.selector());
				return view;
			},
			render: function (index, args) {
				if (that.TEMPLATE)
					view.innertHTML = that.TEMPLATE.format(contents.Data[index || 0]);
				that.refresh(that.view(true));
			},
			clear: function () {
				that.view(true).innerHTML = "";
			},
			data: function(){
				if (arguments.length){
					contents.Data = Object.create(grabListFromArguments(arguments));
					return;
				}
				return contents.Data;
			},
			eventListener: function (args) {
				var el = that.selector() + " " + args.query || "";
				$( document ).on( args.event, el , function( event ) {
					var item = $( this );
					if (args.callback) 
						args.callback(event, item);
				});

				/*
					var elementList =
							args.query && that.view().querySelectorAll(args.query) || [that.view()];
					var eventList =
							(typeOf(args.event) === "String") ? args.event.split(" ") : args.event;

					for (var i = 0; i < elementList.length; i++) {
						var el = elementList[i];
						for (var j = 0; j < eventList.length; j++) {
							var ev = eventList[j];
							el.addEventListener(ev, function (event) {
								var item = this;
								alert(event.type);
								if (args.callback) 
									args.callback(event, item);
							})
						};
					};
				*
				*/
			}
		}, that);

		if (!virtual) 
			window.addEventListener("load", function () {
				view = document.querySelector(that.selector());
				if (! view) {
					throw "Widget.js Invalid id or class name!";
				}
				that.refresh();
			});

		new Fields ({ data: "array" }, contents);
		DataObject.call(contents)
	}

	function createElement (args) {
		args.tag = args.tag || "div";
		if (!args.attributes || typeOf(args.attributes) !== typeOf({}))
			args.attributes = {};

		var el = document.createElement(args.tag);
		for (var attr in args.attributes)
			el.setAttribute (attr, args.attributes[attr]);

		return el;
	}

	function setProperty (object, properties, options) {
		if (properties) {
			var prefix = "", postfix = "";

			if (options && typeOf(options) == typeOf({})) {
				if (options.prefix)
					prefix = options.prefix + "-";
				if (options.postfix)
					postfix = "-" + options.postfix ;
			};

			for (var attr in properties)
				(object[prefix + attr + postfix] = properties[attr]);
		};
	}
})();
