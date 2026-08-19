
  document.querySelectorAll('.fetch-team-query ul li')
    .forEach(li => li.classList.add('item'));

document.addEventListener("DOMContentLoaded", function () {




 const ul = document.querySelector('.micro-slider ul');

  if (ul) {
    ul.id = 'micro-slider';
    ul.classList.add('owl-carousel', 'team-carousel');
  }

 const ul1 = document.querySelector('.ii-slider ul');

  if (ul1) {
    ul1.id = 'ii-slider';
    ul1.classList.add('owl-carousel', 'team-carousel');
  }


 const ul2 = document.querySelector('.d-slider ul');

  if (ul2) {
    ul2.id = 'd-slider';
    ul2.classList.add('owl-carousel', 'team-carousel');
  }


 const ul3= document.querySelector('.s-slider ul');

  if (ul3) {
    ul3.id = 's-slider';
    ul3.classList.add('owl-carousel', 'team-carousel');
  }


 const ul4= document.querySelector('.r-slider ul');

  if (ul4) {
    ul4.id = 'r-slider';
    ul4.classList.add('owl-carousel', 'team-carousel');
  }




    function matchHeight(selector) {
    const elements = document.querySelectorAll(selector);
    let maxHeight = 0;

    if (!elements.length) return;

    // Reset height
    elements.forEach(el => {
        el.style.height = 'auto';
    });

    // Calculate max height
    elements.forEach(el => {
        maxHeight = Math.max(maxHeight, el.offsetHeight);
    });

    // Apply height
    elements.forEach(el => {
        el.style.height = maxHeight + 'px';
    });
}

function applyMatchHeights() {
    matchHeight('.top-content');
    matchHeight('#ecosystem .blue-sec');
    matchHeight('#partner-slider .item'); // ✅ Added for partner slider
}

// Initial
applyMatchHeights();

// On resize
window.addEventListener('resize', applyMatchHeights);

// After images load
window.addEventListener('load', applyMatchHeights);


    
    
    
    const buttons = document.querySelectorAll(".team-buttons .wp-block-button");
  const items   = document.querySelectorAll(".team-items");

  buttons.forEach(button => {
    button.addEventListener("click", function () {
      const currentId = this.id;

      // remove active from all buttons
      buttons.forEach(btn => btn.classList.remove("active"));

      // add active to clicked button
      this.classList.add("active");

      // remove active from all team items
      items.forEach(item => item.classList.remove("active"));

      // add active to matching team item
      const activeItem = document.querySelector(".team-items." + currentId);
      if (activeItem) {
        activeItem.classList.add("active");
      }
    });
  });
    
    
    
    function updatePHeight() {
    const bottSec = document.querySelector('.bott-sec');
    if (!bottSec) return;

    const height = bottSec.offsetHeight; // get height in pixels
    document.documentElement.style.setProperty('--p-height', height + 'px');
}

// Run on load
window.addEventListener('load', updatePHeight);

// Run on resize
window.addEventListener('resize', updatePHeight);
    
    
    const items1 = document.querySelectorAll('.team-items');

function showItem(el) {
  el.style.height = 'auto';
  const h = el.scrollHeight + 'px';
  el.style.height = '0';

  requestAnimationFrame(() => {
    el.classList.add('active');
    el.style.height = h;
  });

  el.addEventListener('transitionend', () => {
    el.style.height = 'auto';
  }, { once: true });
}

function hideItem(el) {
  el.style.height = el.scrollHeight + 'px';

  requestAnimationFrame(() => {
    el.style.height = '0';
    el.classList.remove('active');
  });
}

$('#micro-slider').each(function () {
  var $slider = $(this);

  $slider.owlCarousel({
    loop: false,
    margin: 20,
    dots: false,
    nav: false,
    autoplay: false,
    smartSpeed: 600,

    slideBy: 'page',

    responsive: {
      0: { items: 1 },
      767: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    },

    onInitialized: function (e) {
      initCounter(e);
    },

    onChanged: function (e) {
      updateCounter(e);
    },

    onResized: function (e) {
      initCounter(e);
    }
  });

  function initCounter(e) {
    var carousel = e.relatedTarget;
    var itemsPerPage = carousel.settings.items;

    var totalPages = Math.ceil(e.item.count / itemsPerPage);

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(1);
    $wrapper.find('.total').text(totalPages);
  }

  function updateCounter(e) {
    if (!e.page) return;

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(e.page.index + 1);
    $wrapper.find('.total').text(e.page.count);
  }

  // Controls
  $slider.closest('.team-items').find('.next').on('click', function () {
    $slider.trigger('next.owl.carousel');
  });

  $slider.closest('.team-items').find('.prev').on('click', function () {
    $slider.trigger('prev.owl.carousel');
  });
});

$('#ii-slider').each(function () {
  var $slider = $(this);

  $slider.owlCarousel({
    loop: false,
    margin: 20,
    dots: false,
    nav: false,
    autoplay: false,
    smartSpeed: 2000,
slideBy: 'page',
    responsive: {
      0: { items: 1 },
            767: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    },

    onInitialized: updateCounter,
    onChanged: updateCounter,
    onResized: updateCounter
  });

  function updateCounter(e) {
    if (!e.item) return;

    var carousel = e.relatedTarget;

    // items per page (current breakpoint)
    var itemsPerPage = carousel.settings.items;

    // total pages
    var totalPages = Math.ceil(e.item.count / itemsPerPage);

    // current page (0-based → 1-based)
    var currentPage = Math.floor(e.item.index / itemsPerPage) + 1;

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(currentPage);
    $wrapper.find('.total').text(totalPages);
  }

  // Next / Prev
  $slider.closest('.team-items').find('.next').on('click', function () {
    $slider.trigger('next.owl.carousel');
  });

  $slider.closest('.team-items').find('.prev').on('click', function () {
    $slider.trigger('prev.owl.carousel');
  });
});


$('#d-slider').each(function () {
  var $slider = $(this);

  $slider.owlCarousel({
    loop: false,
    margin: 20,
    dots: false,
    nav: false,
    autoplay: false,
    smartSpeed: 2000,
slideBy: 'page',
    responsive: {
      0: { items: 1 },
            767: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    },

    onInitialized: updateCounter,
    onChanged: updateCounter,
    onResized: updateCounter
  });

  function updateCounter(e) {
    if (!e.item) return;

    var carousel = e.relatedTarget;

    // items per page (current breakpoint)
    var itemsPerPage = carousel.settings.items;

    // total pages
    var totalPages = Math.ceil(e.item.count / itemsPerPage);

    // current page (0-based → 1-based)
    var currentPage = Math.floor(e.item.index / itemsPerPage) + 1;

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(currentPage);
    $wrapper.find('.total').text(totalPages);
  }

  // Next / Prev
  $slider.closest('.team-items').find('.next').on('click', function () {
    $slider.trigger('next.owl.carousel');
  });

  $slider.closest('.team-items').find('.prev').on('click', function () {
    $slider.trigger('prev.owl.carousel');
  });
});


$('#r-slider').each(function () {
  var $slider = $(this);

  $slider.owlCarousel({
    loop: false,
    margin: 20,
    dots: false,
    nav: false,
    autoplay: false,
    smartSpeed: 2000,
slideBy: 'page',
    responsive: {
      0: { items: 1 },
            767: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    },

    onInitialized: updateCounter,
    onChanged: updateCounter,
    onResized: updateCounter
  });

  function updateCounter(e) {
    if (!e.item) return;

    var carousel = e.relatedTarget;

    // items per page (current breakpoint)
    var itemsPerPage = carousel.settings.items;

    // total pages
    var totalPages = Math.ceil(e.item.count / itemsPerPage);

    // current page (0-based → 1-based)
    var currentPage = Math.floor(e.item.index / itemsPerPage) + 1;

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(currentPage);
    $wrapper.find('.total').text(totalPages);
  }

  // Next / Prev
  $slider.closest('.team-items').find('.next').on('click', function () {
    $slider.trigger('next.owl.carousel');
  });

  $slider.closest('.team-items').find('.prev').on('click', function () {
    $slider.trigger('prev.owl.carousel');
  });
});


$('#s-slider').each(function () {
  var $slider = $(this);

  $slider.owlCarousel({
    loop: false,
    margin: 20,
    dots: false,
    nav: false,
    autoplay: false,
    smartSpeed: 2000,
slideBy: 'page',
    responsive: {
      0: { items: 1 },
            767: { items: 1 },
      768: { items: 2 },
      1200: { items: 4 }
    },

    onInitialized: updateCounter,
    onChanged: updateCounter,
    onResized: updateCounter
  });

  function updateCounter(e) {
    if (!e.item) return;

    var carousel = e.relatedTarget;

    // items per page (current breakpoint)
    var itemsPerPage = carousel.settings.items;

    // total pages
    var totalPages = Math.ceil(e.item.count / itemsPerPage);

    // current page (0-based → 1-based)
    var currentPage = Math.floor(e.item.index / itemsPerPage) + 1;

    var $wrapper = $slider.closest('.team-items');

    $wrapper.find('.current').text(currentPage);
    $wrapper.find('.total').text(totalPages);
  }

  // Next / Prev
  $slider.closest('.team-items').find('.next').on('click', function () {
    $slider.trigger('next.owl.carousel');
  });

  $slider.closest('.team-items').find('.prev').on('click', function () {
    $slider.trigger('prev.owl.carousel');
  });
});













});

