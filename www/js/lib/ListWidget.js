"use strict";
var ListWidget;
(function () {
	ListWidget = function ListWidget (args) {
		var that = this,
			popup = {};

		Widget.call(that, args);

		new Constants({
			"item template": args.itemTemplate,
			"item element": args.itemElement,
		}, that)
		new Fields({
			dataSource: {
				type: 'object', 
				defaultValue: args.model || null
			}
		}, that);

		new Methods({
			render: function () {
				that.clear();
				var view = that.view(true),
					data = (that.DataSource && that.DataSource.all) ? that.DataSource.all() : that.data();
				for (var i = 0; i < data.length; i++) {
					var item = data[i];
					item.index = i + 1;
					view.innerHTML += that.ITEM_TEMPLATE.format(item);
				}
				// console.info(view.innerHTML);
				that.refresh();
			},
			add: function (dataItem) {
				if ( that.DataSource && that.DataSource.all ) {
					// Add item to datasource and render again
					console.error('Not implemented!!!!');
					// try {} catch (ex) {}
					// that.DataSource.add(dataItem);
				} else {
					that.data().push(dataItem);
				}
				that.render();
			},
			delete: function (dataItem) {
				if ( that.DataSource && that.DataSource.all ) {
					var id = dataItem.data().id;
					try {
						that.DataSource.find(id).delete()
					} catch (ex) {}
				} else {
					var index = dataItem.data().index;
					if (index)
						that.data().splice(index - 1, 1);
				}
				that.render();
			},
			onCreate: function (callback) {
				// body...
			}
		}, that);


		that.eventListener({
		event: "tap",
		query: that.ITEM_ELEMENT,
		callback: function (event, item) {
			if (event.target.classList.contains("delete")) {
				// Confirm before; deletion
				navigator.notification.confirm(
					item.data().description,
					function (confirmation) {
						if (confirmation == 1)
							Animate(item, {
								// These are the classnames used for the CSS transition 
								class: "deleting",
								callback: function () { 
									that.delete(item);
									that.render();
								},
							})
						// 	that.destroy(item);
						// that.render();
					},
					"حذف",
					["بزن بره", "نههههه"]
				);
			};
		}
	})
	}
})();
