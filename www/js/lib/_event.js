/**
* This page contains global events
* @author Morteza Tourani
*/

(function () {
	/*
	* Auto text direction for all input and textarea in application.
	*
	* Code by Sallar Kaboli (@sallar) Modified by Me (Morteza Torani) and
	* direction for string prototype added to prototypes.js
	*/

	$("input, textarea").keyup(function(event) {
		var text = $(this).val(),
			half = parseInt(text.length / 2),
			matches;
		if (text.length) {
			$(this).removeClass("ltr rtl").addClass(text.direction());
		};
	});
	

})();
