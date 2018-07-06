var mainNav = document.querySelector('.main-navigation');
var toggle = document.querySelector('.main-navigation__toggle');


// Открытие и закрытие меню
mainNav.classList.remove('main-navigation--no-js');

toggle.addEventListener('click', function () {
	if (mainNav.classList.contains('main-navigation--closed')) {
		mainNav.classList.remove('main-navigation--closed');
		mainNav.classList.add('main-navigation--opened');
	} else {
		mainNav.classList.remove('main-navigation--opened');
		mainNav.classList.add('main-navigation--closed');
	}
});
