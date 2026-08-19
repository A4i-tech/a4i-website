


  document.querySelectorAll('.fetch-team-query ul li')
    .forEach(li => li.classList.add('item'));



document.addEventListener("DOMContentLoaded", function () {
$("#homepage-banner").owlCarousel({
  loop: true,
  items: 1,
  dots: true,
  nav: false,

  autoplay: true,
  autoplayTimeout: 5000,

  animateIn: "fadeIn",
  animateOut: "fadeOut",

  smartSpeed: 1000,
  autoplaySpeed: 1000,

  onTranslated: function () {
    $('#homepage-banner .owl-item')
      .removeClass('owl-animated-out owl-animated-in fadeIn fadeOut');
  }
});


// var owl = $("#partner-slider");

// var owl = $('#partner-slider');

// owl.owlCarousel({
//   loop: true,
//   margin: 0,
//   dots: true,
//   nav: false,
//   items: 1,
//   autoplay: true,
//   autoplayTimeout: 5000,
//   autoplayHoverPause: false,
//   smartSpeed: 2000,
//   autoplaySpeed: 2000,

//   onInitialized: function (e) {

//     // counter
//     $('.total').text(e.item.count);
//     $('.current').text(1);

//     // inject logo into dots (FIX for Gutenberg)
//     $('#partner-slider .owl-dot').each(function (i) {
//       if (window.partnerLogos && window.partnerLogos[i]) {
//         $(this).html(
//           '<img src="' + window.partnerLogos[i] + '" alt="logo">'
//         );
//       }
//     });
//   },

//   onChanged: function (e) {
//     var index = e.item.index - e.relatedTarget._clones.length / 2;
//     if (index < 0) index = e.item.count - 1;
//     if (index >= e.item.count) index = 0;
//     $('.current').text(index + 1);
//   }
// });




 $('#partner-slider').owlCarousel({
  loop: true,
  margin: 0,
  dots: false,
  nav: false,
  items: 1,
  autoplay: false,
  autoplayTimeout: 5000,
  autoplayHoverPause: false,
  smartSpeed: 2000,
  autoplaySpeed: 2000,

  onInitialized: function (e) {
    // total counter
    $('.total').text(e.item.count);
    $('.current').text(1);

    // inject logos into dots
    $('#partner-slider .owl-dot').each(function (i) {
      if (window.partnerLogos && window.partnerLogos[i]) {
        $(this).html('<img src="' + window.partnerLogos[i] + '" alt="logo">');
      }
    });
     $('.log-sec img').removeClass('active');
    $('.log-sec img').eq(0).addClass('active');
  },

  onChanged: function (e) {
    var index = e.item.index - e.relatedTarget._clones.length / 2;
    if (index < 0) index = e.item.count - 1;
    if (index >= e.item.count) index = 0;
    $('.current').text(index + 1);
    
  },
  onChange: function(e){
    console.log("index",e.item.index)
    $('.log-sec img').removeClass('active');
    $('.log-sec img').eq(e.item.index - 1).addClass('active');
  }
});


$('#partner-slider .owl-dot').each(function (i) {
  if (window.partnerLogos && window.partnerLogos[i]) {
    $(this).html('<img src="' + window.partnerLogos[i] + '" alt="logo">');
  }
});

$('.partner-container .next').click(function () {
   $('#partner-slider').trigger('next.owl.carousel');
});

$('.partner-container .prev').click(function () {
   $('#partner-slider').trigger('prev.owl.carousel');
});



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

// Optional: After Owl Carousel initializes
$('#partner-slider').on('initialized.owl.carousel', function() {
    applyMatchHeights();
});

    
    
    
    
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

    
    
    
    var owl1 = $('.mobile-slider');
var owl1Initialized = false;

function initMobileSlider() {
    
    
    
  if ($(window).width() < 781) {
      
    if (!owl1Initialized) {
      owl1.owlCarousel({
        loop: true,
        margin: 20,
        dots: false,
        nav: false,
        items: 1,
        autoplay: false,
        autoplayTimeout: 6000,
        autoplayHoverPause: false,
        smartSpeed: 2000,
        autoplaySpeed: 2000,

        onInitialized: function (e) {
          // total counter
          $('.total1').text(e.item.count);
          $('.current1').text(1);

        
        },

        onChanged: function (e) {
          var index = e.item.index - e.relatedTarget._clones.length / 2;
          if (index < 0) index = e.item.count - 1;
          if (index >= e.item.count) index = 0;
          $('.current1').text(index + 1);
        }
      });

      owl1Initialized = true;
    }
  } else {
    // destroy on desktop
    if (owl1Initialized) {
      owl1.trigger('destroy.owl.carousel');
      owl1.removeClass('owl-loaded');
      owl1.find('.owl-stage-outer').children().unwrap();
      owl1Initialized = false;
    }
  }
}

// run on load
initMobileSlider();

// run on resize
$(window).on('resize', function () {
  initMobileSlider();
});

    
    
    $('#ecosystem .next').click(function () {
  owl1.trigger('next.owl.carousel');
});

$('#ecosystem .prev').click(function () {
  owl1.trigger('prev.owl.carousel');
})
    

});


// $(window) ("load" , function () {

//   var $slider = $('#partner-slider');
//   var $logos  = $('.log-sec img');
//   var total   = $logos.length;

//   if (!total) {
//     console.error('❌ No logos found');
//     return;
//   }

//   // Show first logo on load
//   $logos.removeClass('active').eq(0).addClass('active');
//   $('.total').text(total);
//   $('.current').text(1);

//   // When slide changes
//   $slider.on('changed.owl.carousel', function (e) {
// console.log('logos',$logos)

//     if (!e.item) return;

//     var realIndex = e.item.index - e.relatedTarget._clones.length / 2;
//     var index = ((realIndex % total) + total) % total;
//     console.log('index ',index )
//     $logos.removeClass('active');
//     $logos.eq(index).addClass('active');

//     $('.current').text(index + 1);
//   });

//   // Custom arrows
//   $('.nav-wrap .next').on('click', function () {
//     $slider.trigger('next.owl.carousel');
//   });

//   $('.nav-wrap .prev').on('click', function () {
//     $slider.trigger('prev.owl.carousel');
//   });

// });

window.addEventListener('load', function () {

  const slider = document.getElementById('partner-slider');
  const logos  = document.querySelectorAll('.log-sec img');
  const total  = logos.length;

  if (!total) {
    console.error('❌ No logos found');
    return;
  }

  // Show first logo on load
  logos.forEach(logo => logo.classList.remove('active'));
  logos[0].classList.add('active');

  document.querySelector('.total').textContent = total;
  document.querySelector('.current').textContent = 1;

  /* ==============================
     Owl Carousel change event
  ============================== */
  slider.addEventListener('changed.owl.carousel', function (e) {

    if (!e.detail || !e.detail.item) return;

    const clones = e.detail.relatedTarget._clones.length / 2;
    const realIndex = e.detail.item.index - clones;
    const index = ((realIndex % total) + total) % total;

    logos.forEach(logo => logo.classList.remove('active'));
    logos[index].classList.add('active');

    document.querySelector('.current').textContent = index + 1;
  });

  /* ==============================
     Custom arrows
  ============================== */
  document.querySelector('.nav-wrap .next')?.addEventListener('click', () => {
    slider.dispatchEvent(new CustomEvent('next.owl.carousel'));
  });

  document.querySelector('.nav-wrap .prev')?.addEventListener('click', () => {
    slider.dispatchEvent(new CustomEvent('prev.owl.carousel'));
  });

});

document.addEventListener('DOMContentLoaded', function () {

  function matchInnerDataHeight() {
    const items = document.querySelectorAll('#resource .inner-data');
    if (!items.length) return;

    // Reset first
    items.forEach(el => el.style.height = 'auto');

    // Apply only ABOVE 781px
    if (window.innerWidth > 781) {
      let maxHeight = 0;

      items.forEach(el => {
        const height = el.getBoundingClientRect().height;
        if (height > maxHeight) maxHeight = height;
      });

      items.forEach(el => {
        el.style.height = maxHeight + 'px';
      });
    }
  }

  // Run on load (important for WP)
  window.addEventListener('load', matchInnerDataHeight);

  // Run on resize
  window.addEventListener('resize', function () {
    clearTimeout(window.__resizeTimer);
    window.__resizeTimer = setTimeout(matchInnerDataHeight, 150);
  });

});


document.addEventListener('DOMContentLoaded', function () {

  function matchHeight(selector) {
    const items = document.querySelectorAll(selector);
    if (!items.length) return;

    // Reset on mobile
    if (window.innerWidth <= 781) {
      items.forEach(item => item.style.height = 'auto');
      return;
    }

    let maxHeight = 0;

    // Reset + calculate
    items.forEach(item => {
      item.style.height = 'auto';
      const height = item.getBoundingClientRect().height;
      if (height > maxHeight) maxHeight = height;
    });

    // Apply
    items.forEach(item => {
      item.style.height = maxHeight + 'px';
    });
  }

  function applyMatchHeight() {
    matchHeight('#m4 .grid-2 .item');
    matchHeight('.grid-2 .i1');
    matchHeight('#team .Microsoft .tb-sec'); // ✅ ADD THIS
     matchHeight('#team .IIITB .tb-sec');
      matchHeight('#team .Domain-Partners .tb-sec');
       matchHeight('#team .Steering-Committee .tb-sec');
        matchHeight('#team .RAC .tb-sec');

  }

  /* ======================
     INITIAL RUN (DOM)
  ====================== */
  applyMatchHeight();

  /* ======================
     AFTER IMAGES LOAD (KEY)
  ====================== */
  window.addEventListener('load', function () {
    applyMatchHeight();
  });

  /* ======================
     RESIZE (debounced)
  ====================== */
  let resizeTimer;
  window.addEventListener('resize', function () {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(applyMatchHeight, 200);
  });

});
