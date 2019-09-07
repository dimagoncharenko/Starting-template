export default () => {
	const hamburger = document.querySelector('.hamburger');
	const nav = document.querySelector('.nav');

	hamburger.addEventListener('click', () => {
		hamburger.classList.toggle('hamburger--active');
		nav.classList.toggle('nav--open');
	});
}
