"use strict";
(function () {
	var index = 1;
	window.PageWidget = function PageWidget (args) {
		var that = this;
		args = args || {};

		args.role = "page";
		args.class = (args.class || "") + " " + args.role;
		args.id = args.id || "page-" + index;

		var viewData = args.deepChild("view.data")
		viewData.setVal ({
					"theme": args.theme || "",
					"dialog": args.dialog || false,
				});

		Widget.call(that, args);
		index ++;
	}
})();
