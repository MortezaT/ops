"use strict";
(function () {
	window.Animate = function Animate (args) {
		var that = this,
			events = {};
		new Constants({
			transition: function () {
				return {
					end: "webkitTransitionEnd transitionend otransitionend",
					start: ""
				}
			}
		}, events)
	}
})();
