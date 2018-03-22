const toggleNavbarBackground = function() {
  const navbar = document.querySelector('.navbar-wagon');

  window.addEventListener('scroll', (event) => {
    if (window.scrollY > 0 ) {
      navbar.classList.remove('navbar-wagon-transparent');
      navbar.classList.add('navbar-wagon-dark');
    } else {
      navbar.classList.remove('navbar-wagon-dark');
      navbar.classList.add('navbar-wagon-transparent');
    }
  });
}

export { toggleNavbarBackground };
