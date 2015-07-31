"use strict";
(function () {
	window.ControlgroupWidget = function ControlgroupWidget (args) {

		var that = this;
		
		args = args || {};
		args.role = "controlgroup";

		ListWidget.call(that, args);

		Methods({
			refresh: function () {
				$(that.selector()).controlgroup("destroy").controlgroup().trigger("create")
			}
		}, that);
	}
})();
