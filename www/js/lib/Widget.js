"use strict";
var Widget;
(function () {
	/**
	 * [Widget normal implementations]
	 * @method Widget
	 * @param  {JSON} args
	 * {
	 * 		id: 		{String}	[ID of view]
	 * 		class: 		{String}	[Name of class(es) (separate by space if more than one class)]
	 * 		virtual: 	{Boolean}	[if true means "view not created yet!" and Widget will create element from given tag or div element]
	 * 		tag: 		{String}	[Tag name of element if virtual]
	 * }
	 */
	Widget = function Widget (args) {
		args = args || {};

		if (! (args.id || args.class))
			throw "Widget received neither id or class name";

		var that = this,
			virtual = args.virtual,
			contents = {},
			tagName = args.tag || "div",
			view = document.createElement(tagName);
		
		view.id = args.id || "";
		view.className = args.class || "";

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
					((view.className) ? '.' + view.className.split(" ").join(".") : '');
				return selector;
			},
			view: function (refresh) {
				if (refresh)
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
					contents.Data = grabListFromArguments(arguments);
					return that;
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
				if (! view) 
					throw "INVALID_ID_OR_CLASS!";
				that.refresh();
			});

		new Fields ({ data: "array" }, contents);
		DataObject.call(contents)
	}
})();
