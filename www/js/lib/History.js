"ues strict";
var HistoryPanel = 
(function () {
	var that = {},
		args = {
			model: null,
			id: "first-page-sidebar",
			template: '',
			position: "right",
			display: "push"
		},
		listviewargs = {
			model: 			Place(),
			id: 			args.id + "-listview",
			itemElement: 	"li",
			itemTemplate: document.getElementById('history-panel-li-template').innerHTML,
		};

	new Fields({
		listview: "object",
	}, that);

	PanelWidget.call(that, args);
	ListviewWidget.call(that.Listview, listviewargs);

	var base = base || {};
	base.refresh = that.refresh;
	new Methods({
		refresh: function () {
			that.clear();
			that.Listview.render();
			base.refresh();
		},
		clear: function () {
			that.Listview.clear();
		}
	}, that);

	return that;
})();
