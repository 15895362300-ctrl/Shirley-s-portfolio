const filters = [...document.querySelectorAll('.filter')];
const cards = [...document.querySelectorAll('.project-card')];
const menuToggle = document.querySelector('.menu-toggle');
const nav = document.querySelector('#site-nav');

filters.forEach((filter) => filter.addEventListener('click', () => {
  const category = filter.dataset.filter;
  filters.forEach((item) => item.classList.toggle('is-active', item === filter));
  cards.forEach((card) => card.classList.toggle('is-hidden', category !== 'all' && !card.dataset.category.split(' ').includes(category)));
}));

menuToggle?.addEventListener('click', () => {
  const isOpen = nav.classList.toggle('is-open');
  menuToggle.setAttribute('aria-expanded', String(isOpen));
});

nav?.querySelectorAll('a').forEach((link) => link.addEventListener('click', () => {
  nav.classList.remove('is-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
}));

window.__portfolioCheck = () => {
  console.assert(filters.length === 4, 'Expected four project filters');
  console.assert(cards.length === 4, 'Expected four project cards');
};
