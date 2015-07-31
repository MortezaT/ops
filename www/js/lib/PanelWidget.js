"use strict";
(function () {
	var DEFAULT = {
		POSITION: {
			left: {type: "left", id: 0},
			right: {type: "right", id: 1}
		},
		DISPLAY: {
			overlay: { type: "overlay" , id: 0, className: "ui-panel-display-overlay"},
			reveal: { type: "reveal" , id: 1, className: "ui-panel-display-reveal"},
			push: { type: "push" , id: 2, className: "ui-panel-display-push"}
		}
	};
	window.PanelWidget = function Panel(args) {
		args = args || {};
		var that = this,
			position = args.position &&  DEFAULT.POSITION[position] || DEFAULT.POSITION.left,
			display = args.displayType &&  DEFAULT.DISPLAY[displayType] || DEFAULT.DISPLAY.reveal;
		args.role = "panel"
		Widget.call(that, args);
		
		new Methods({
			enable: function () {
				return command('enable')
			},
			disable: function () {
				return command('disable')
			},
			fix: function (fx) {
				// { true | false }
				if (typeOf(fx) === "Boolean" || fx === undefined )
					return options("positionFixed", fx);
			},
			position: function (pos) {
				// { left | right }
				var nextPos = DEFAULT.POSITION[pos];

				if (nextPos && nextPos.type !== position.type){
					that.close();
					position = nextPos;
					$(that.selector()).toggleClass("ui-panel-position-left ui-panel-position-right");
				} else {
					pos = undefined;
				}
				return options("position", pos);
			},
			display: function (disp) {
				// { overlay | reveal | push }
				var nextDisp = DEFAULT.DISPLAY[disp];

				if (nextDisp && nextDisp.type !== display.type) {
					that.close();
					display = DEFAULT.DISPLAY[disp];
					$(that.selector())
						.removeClass("ui-panel-display-reveal ui-panel-display-overlay ui-panel-display-push")
						.addClass(display.className);
				} else {
					disp = undefined
				}
				return options("display", disp);
			},
			close: function () {
				return command("close");
			},
			open: function () {
				return command("open");
			},
			toggle: function () {
				return command("toggle");
			},
			refresh: function () {
				var view = that.view(true);
				view.setAttribute("data-role", "panel");
				// view.setAttribute("data-display", display.type);
				// view.setAttribute("data-position", position.type);
				$(that.selector()).trigger( "updatelayout" );
				command();

				var pos = options("position"),
					disp = options("display");
				for(var i in DEFAULT.POSITION) {
					var p = DEFAULT.POSITION[i];
					if (pos == p.type) {
						position = p;
						break;
					};
				}
				
				for(var i in DEFAULT.DISPLAY) {
					var d = DEFAULT.DISPLAY[i];
					if (disp == d.type) {
						display = d;
						break;
					};
				}
			}
		}, that);
		function options (key, value) {
			return command("option", key, value);
		}
		function command () {
			var p = $(that.selector());
			return p.panel.apply(p.panel(), arguments);
		}
	}

})();
