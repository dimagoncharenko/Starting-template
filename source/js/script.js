$(document).ready( function() {
	$('.hamburger').click( function() {
		$('.nav').toggleClass('nav--open');
		$('body').toggleClass('nav-on');
		$('html').toggleClass('nav-on');
	});
})
