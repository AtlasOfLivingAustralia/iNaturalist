($ => {
  $(document).ready(($) => {
    /**
     * Mobile (off-canvas) menu
     */
    $('[data-toggle="offcanvas"]').on('click', function () {
      $('.site').toggleClass('offcanvas-open');
    });


    /**
     * Hero Banner
     */
    $('.swiper-container').each((index, el) => {
      $(el).addClass(`swiper-${index}`);

      new Swiper(`.swiper-${index}`, {
        loop: true,
        slidesPerView: 1,
        spaceBetween: 0,
        speed: 1000,
        autoplay: {
          delay: 5000,
          disableOnInteraction: false
        },
        preventClicks: false,
        effect: 'fade',
        preloadImages: false,
        lazy: {
          loadPrevNext: true,
        },
        navigation: false,
        pagination: {
          el: '.swiper-pagination',
          type: 'bullets',
          clickable: true,
        },
      });
    });


    /**
     * Featured Box
     */
    $('.featured-swiper').each(function (index, el) {
      $(el).addClass(`featured-${index}`);

      let featuredSwiper = undefined;

      function initFeaturedSwiper() {
        var screenWidth = $(window).width();
        if(screenWidth < 992 && featuredSwiper == undefined) {
          featuredSwiper = new Swiper(`.featured-${index}`, {
            loop: false,
            slidesPerView: 2,
            spaceBetween: 40,
            speed: 1000,
            autoplay: {
              delay: 5000,
              disableOnInteraction: false
            },
            preventClicks: false,
            effect: 'slide',
            preloadImages: false,
            lazy: {
              loadPrevNext: true,
            },
            navigation: {
              nextEl: '.featured-button-next',
              prevEl: '.featured-button-prev',
            },
            // Responsive breakpoints
            breakpoints: {
              // when window width is <= 7637px
              767: {
                slidesPerView: 1,
                spaceBetween: 40
              }
            }
          });
        } else if (screenWidth > 991 && featuredSwiper != undefined) {
          featuredSwiper.destroy();
          featuredSwiper = undefined;
          jQuery(el).find('.swiper-wrapper').removeAttr('style');
          jQuery(el).find('.swiper-slide').removeAttr('style');
        }
      }

      //Swiper plugin initialization
      initFeaturedSwiper();

      //Swiper plugin initialization on window resize
      $(window).on('resize', function(){
        initFeaturedSwiper();
      });
    });


    /**
     * Tooltips
     */
    $('[data-toggle="tooltip"]').tooltip();


    /**
     * Get/Set user experience group cookie
     */
    const initExperiencePopup = () => {
      let settingExperienceCookie = false;
      const experience = getCookie('experience');
      const experienceModal = $('#experience-modal');

      // If the experience cookie has not been set, show the popup after a delay.
      if (experience === false) {
        setTimeout(() => experienceModal.modal('show'), 5000);
      }

      // Change the experience group
      experienceModal.on('click', '.group-btn', (e) => {
        e.preventDefault();

        // Don't proceed if 'in progress'
        if (settingExperienceCookie) return false;

        const button = $(e.currentTarget);
        const group = button.data('name');

        $.ajax({
          url: wp_ajax_object.ajax_url,
          method: 'POST',
          data: { action: 'set_experience_cookie', group },
          beforeSend: () => {
            settingExperienceCookie = true;
          },
          complete: () => {
            if (group !== 'null') window.location.reload();
          },
        });

        return false;
      });
    };
    initExperiencePopup();

    $('[data-sticky]').stickybits({
      useStickyClasses: true,
      stickyBitStickyOffset: 20
    });

    if($('#anchorList').length) {
      $('body').scrollspy({ target: '#anchorList' });
    }

    // filter handling for a /dir/ OR /indexordefault.page
    function filterPath(string) {
      return string
        .replace(/^\//, '')
        .replace(/(index|default).[a-zA-Z]{3,4}$/, '')
        .replace(/\/$/, '');
    }

    const locationPath = filterPath(location.pathname);
    $('a[href*="#"]').not('[data-toggle]').each(function () {
      const thisPath = filterPath(this.pathname) || locationPath;
      const hash = this.hash;
      if ($("#" + hash.replace(/#/, '')).length) {
        if (locationPath == thisPath && (location.hostname == this.hostname || !this.hostname) && this.hash.replace(/#/, '')) {
          const $target = $(hash), target = this.hash;
          if (target) {
            $(this).click(function (event) {
              event.preventDefault();
              $('html, body').animate({scrollTop: $target.offset().top}, 1000, function () {
                location.hash = target;
                $target.focus();
                if ($target.is(":focus")){ //checking if the target was focused
                  return false;
                }else{
                  $target.attr('tabindex','-1'); //Adding tabindex for elements not focusable
                  $target.focus(); //Setting focus
                }
              });
            });
          }
        }
      }
    });

  });

  //Collapse tabs if opened on mobile
  const collapseTabs = () => {
    if($(window).outerWidth() < 768) {
      $('.tab-box').find('[aria-expanded=true]').click();
    }
  };

  collapseTabs();


  //Count up to data-count num
  $('[data-count]').each(function() {
    const $this = $(this),
      countTo = $this.attr('data-count');

    $this.html('0');

    $({countNum: $this.text()}).animate({
        countNum: countTo
      },

      {

        duration: 4000,
        easing: 'linear',
        step: function () {
          const countNumFloor = Math.floor(this.countNum);
          $this.text(countNumFloor.toLocaleString());
        },
        complete: function () {
          $this.text(this.countNum.toLocaleString());
        }

      });
  });

  })(jQuery);

/**
 * Return cookie if there's a match
 * @param str name
 * @return cookie|false
 */
const getCookie = (name) => {
  const match = document.cookie.match(new RegExp(`(^| )${name}=([^;]+)`));
  return (match) ? match[2] : false;
};
