(function () {
	var headerTemplate =
		'<header data-role="header" data-theme="b" data-position="fixed" data-fullscreen="fasle">\
			<h1><div class="header">{{title}}</div></h1>\
			{{headerRightSideBtn}}\
		</header>',
		footerTemplate =
			'<footer data-role="footer" data-theme="b" data-position="fixed">\
				{{footerleftSideBtn}}\
				<h3>\
					<div class="footer">\
						طراحی و توسعه توسط <a href="mailto:morteza.tourani@gmail.com" class="sign">مرتضی تورانی</a>\
					</div>\
				</h3>\
				{{footerRightSideBtn}}\
			</footer>',
		retBtn = '<a href="#" data-icon="forward" data-rel="back" data-iconpos="right" title="Go back" class="ui-btn-right ui-btn-inline">بازگشت</a>',
		mtBtn ='<a data-role="button" href="#morteza-page" data-icon="info" class="ui-btn-left ui-btn-a" data-transition="flip" data-theme="a" data-corne="none">درباره من</a>',
			// <a data-role="button" href="first-page-sidebar" id="history" data-transition="slideup" data-theme="b" class="nasim">مکانهای ثبت شده</a>

		openPanel = '<a href="#first-page-sidebar" data-iconpos="right" data-icon="fa-globe" class="ui-btn-right icon-2x history-panel" data-theme="a" data-corners="all" data-rel="close">Places</a>',
		pages= [
			{
					name: 'first-page', 	
					header: {title: 'موقعیت یاب آنلاین'},
					footer: {footerleftSideBtn: mtBtn, footerRightSideBtn: openPanel}
			 },
			{
					name: 'history-page', 	
					header: {title: 'مکانهای ثبت شده',	headerRightSideBtn: retBtn},
					footer: {footerRightSideBtn: mtBtn}
			 },
			{
					name: 'map-page', 		
					header: {title: 'موقعیت یاب آنلاین',	headerRightSideBtn: retBtn},
					footer: {footerRightSideBtn: mtBtn}
			 },
			{
					name: 'morteza-page', 	
					header: {title: 'مرتضی تورانی',		headerRightSideBtn: retBtn},
			 }
		];
	pages.forEach(function (page) {
		var pageSelector = $('#'+ page.name);
		if (pageSelector.length) 
			pageSelector
				.prepend (headerTemplate.format(page.header || {}, {clean: true}))
				.append  (footerTemplate.format(page.footer || {}, {clean: true}));
	});
})()
