document.addEventListener('DOMContentLoaded', function () {
  const menuBtn = document.querySelector('.menu-mobile');
  const menuContainer = document.querySelector('.menu-container');
  const closeBtn = document.querySelector('.m-close-icon figure');
 const header = document.querySelector('header');

 console.log(header);

  if (menuBtn && menuContainer && header) {
    menuBtn.addEventListener('click', function () {
      menuContainer.classList.add('open');
      header.classList.add('hide');
    });
  }

  if (closeBtn && menuContainer && header) {
    closeBtn.addEventListener('click', function () {
      menuContainer.classList.remove('open');
      header.classList.remove('hide');
    });
  }
});


document.addEventListener('DOMContentLoaded', function () {

  document.querySelectorAll('.wp-block-navigation-submenu__toggle').forEach(function (btn) {

    btn.addEventListener('click', function (e) {
      e.preventDefault();

      const parentItem = btn.closest('.wp-block-navigation-submenu');
      const submenu = parentItem.querySelector('.wp-block-navigation__submenu-container');
      const isOpen = btn.getAttribute('aria-expanded') === 'true';

      // Toggle state
      btn.setAttribute('aria-expanded', !isOpen);

      if (submenu) {
        submenu.style.display = isOpen ? 'none' : 'block';
      }

      parentItem.classList.toggle('is-open', !isOpen);
    });

  });

});
