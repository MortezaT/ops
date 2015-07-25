"ues strict";
(function () {
	window.ListviewWidget = function Listview (args) {
		var that = this;
		args.role = "listview";

		new Methods({
			refresh: function () {
				$(that.selector()).listview("refresh");
			}
		}, that);

		ListWidget.call(that, args);
		$(that.selector()).listview();
	}
})();
