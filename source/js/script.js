$(document).ready( function() {
	$('.hamburger').click( function() {
		$('.hamburger').toggleClass('hamburger--active')
		$('.nav').toggleClass('nav--open');
		$('body, html').toggleClass('nav-on');
	});
})
