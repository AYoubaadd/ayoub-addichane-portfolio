(function($) {

    "use strict";
    
    const cfg = {
                scrollDuration : 800, // smoothscroll duration
                mailChimpURL   : ''   // mailchimp url
                };
    const $WIN = $(window);


    // Add the User Agent to the <html>
    // will be used for IE10/IE11 detection (Mozilla/5.0 (compatible; MSIE 10.0; Windows NT 6.2; Trident/6.0; rv:11.0))
    const doc = document.documentElement;
    doc.setAttribute('data-useragent', navigator.userAgent);

   // preloader
    const preloader = function() {

        $("html").addClass('ss-preload overflow');

        $WIN.on('load', function() {

            // force page scroll position to top at page refresh
            $('html, body').animate({ scrollTop: 0 }, 'normal');

            // will first fade out the loading animation 
            $("#spinner").fadeOut("slow", function() {
                // will fade out the whole DIV that covers the website.
                $("#preloader").delay(300).fadeOut("slow");
            }); 
            
            // for hero content animations 
            $("html").removeClass('ss-preload overflow');
            $("html").addClass('ss-loaded');

        });
    };

   // move header
    const moveHeader = function () {

        const $hero = $('.s-hero'),
              $hdr = $('.s-header'),
              triggerHeight = $hero.outerHeight() - 170;


        $WIN.on('scroll', function () {

            let loc = $WIN.scrollTop();

            if (loc > triggerHeight) {
                $hdr.addClass('sticky');
            } else {
                $hdr.removeClass('sticky');
            }

            if (loc > triggerHeight + 20) {
                $hdr.addClass('offset');
            } else {
                $hdr.removeClass('offset');
            }

            if (loc > triggerHeight + 150) {
                $hdr.addClass('scrolling');
            } else {
                $hdr.removeClass('scrolling');
            }

        });

    };

   // mobile menu
    const mobileMenu = function() {

        const $toggleButton = $('.header-menu-toggle');
        const $headerContent = $('.header-content');
        const $siteBody = $("body");

        function setMenuOpen(isOpen) {
            const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
            const labels = {
                fr: { open: 'Ouvrir le menu', close: 'Fermer le menu' },
                en: { open: 'Open menu', close: 'Close menu' }
            };
            $toggleButton.toggleClass('is-clicked', isOpen);
            $toggleButton.attr('aria-expanded', String(isOpen));
            $toggleButton.attr('aria-label', isOpen ? labels[language].close : labels[language].open);
            $siteBody.toggleClass('menu-is-open', isOpen);
        }

        $toggleButton.on('click', function(event){
            event.preventDefault();
            setMenuOpen(!$siteBody.hasClass('menu-is-open'));
        });

        $(document).on('keydown', function(event) {
            if (event.key === 'Escape' && $siteBody.hasClass('menu-is-open')) {
                setMenuOpen(false);
                $toggleButton.trigger('focus');
            }
        });

        $headerContent.find('.header-nav a, .btn').on("click", function() {

            if (window.matchMedia('(max-width: 1100px)').matches) {
                setMenuOpen(false);
            }
        });

        $headerContent.find('[data-language], [data-theme-toggle]').on('click', function() {
            if ($siteBody.hasClass('menu-is-open')) setMenuOpen(false);
        });

        $WIN.on('resize', function() {

            if (window.matchMedia('(min-width: 1101px)').matches) {
                setMenuOpen(false);
            }
        });

        new MutationObserver(function() {
            setMenuOpen($siteBody.hasClass('menu-is-open'));
        }).observe(document.documentElement, {
            attributes: true,
            attributeFilter: ['lang']
        });
        setMenuOpen(false);

    };

   // Animate On Scroll
    const aos = function() {
        
        AOS.init( {
            offset: 100,
            duration: 600,
            easing: 'ease-in-out',
            delay: 300,
            once: true,
            disable: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? true : 'mobile'
        });

    };
    
    // smooth scrolling
    const smoothScroll = function() {
        
        $('.smoothscroll').on('click', function (e) {
            const target = this.hash;
            const $target = $(target);
            const scrollDuration = window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : cfg.scrollDuration;
            
            e.preventDefault();
            e.stopPropagation();

            $('html, body').stop().animate({
                'scrollTop': $target.offset().top
            }, scrollDuration, 'swing').promise().done(function () {
                window.location.hash = target;
            });
        });

    };


    // back to top
    const backToTop = function() {
        
        const pxShow = 800;
        const $goTopButton = $(".ss-go-top")

        // Show or hide the button
        if ($(window).scrollTop() >= pxShow) $goTopButton.addClass('link-is-visible');

        $(window).on('scroll', function() {
            if ($(window).scrollTop() >= pxShow) {
                if(!$goTopButton.hasClass('link-is-visible')) $goTopButton.addClass('link-is-visible')
            } else {
                $goTopButton.removeClass('link-is-visible')
            }
        });
    };

    // set active menu item
    const scrollMenuActive = function() {
        
        $(window).on('scroll', function() {
            const scrollY = $(window).scrollTop();

            $('section').each(function() {
                const sectionTop = $(this).offset().top - 30;
                const sectionBottom = sectionTop + $(this).outerHeight();

                if (scrollY >= sectionTop && scrollY < sectionBottom) {
                    $('.header-nav a[href="#' + $(this).attr('id') + '"]').addClass('active-link');
                } else {
                    $('.header-nav a[href="#' + $(this).attr('id') + '"]').removeClass('active-link');
                }
            });
        });
    };

    const profilePhotoCarousel = function() {
        const carousel = document.querySelector('.profile-carousel');

        if (!carousel) return;

        const images = Array.from(carousel.querySelectorAll('img'));
        const toggle = carousel.querySelector('.profile-carousel__toggle');

        if (images.length < 2 || !(toggle instanceof HTMLButtonElement)) return;

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        let activeIndex = 0;
        let intervalId;

        const showImage = function(index) {
            images.forEach(function(image, imageIndex) {
                const isActive = imageIndex === index;
                image.classList.toggle('is-active', isActive);
                image.setAttribute('aria-hidden', String(!isActive));
            });
        };

        const startCarousel = function() {
            if (prefersReducedMotion || toggle.getAttribute('aria-pressed') === 'true') return;

            intervalId = window.setInterval(function() {
                activeIndex = (activeIndex + 1) % images.length;
                showImage(activeIndex);
            }, 4000);
        };

        toggle.addEventListener('click', function() {
            const isPaused = toggle.getAttribute('aria-pressed') !== 'true';
            toggle.setAttribute('aria-pressed', String(isPaused));
            toggle.setAttribute(
                'aria-label',
                isPaused
                    ? 'Reprendre le défilement des photos'
                    : 'Mettre en pause le défilement des photos'
            );
            toggle.textContent = isPaused ? 'Reprendre' : 'Pause';

            if (isPaused) {
                window.clearInterval(intervalId);
            } else {
                startCarousel();
            }
        });

        showImage(activeIndex);
        startCarousel();
    };

    const certificatesCarousel = function() {
        const carousel = document.querySelector('[data-certificates-carousel]');

        if (!carousel) return;

        const track = carousel.querySelector('.certificates-track');
        const cards = Array.from(carousel.querySelectorAll('.certificate-card'));
        const previousButton = document.querySelector('[data-certificates-previous]');
        const nextButton = document.querySelector('[data-certificates-next]');
        const count = document.querySelector('[data-certificates-count]');
        const progress = carousel.querySelector('.certificates-progress');
        const progressFill = carousel.querySelector('[data-certificates-progress]');

        if (
            !(track instanceof HTMLElement) ||
            !(previousButton instanceof HTMLButtonElement) ||
            !(nextButton instanceof HTMLButtonElement) ||
            !(count instanceof HTMLElement) ||
            !(progress instanceof HTMLElement) ||
            !(progressFill instanceof HTMLElement) ||
            cards.length === 0
        ) return;

        const updateControls = function() {
            const maxScroll = track.scrollWidth - track.clientWidth;
            const scrollPosition = track.scrollLeft;
            const trackBounds = track.getBoundingClientRect();
            const visibleCards = cards.filter(function(card) {
                const cardBounds = card.getBoundingClientRect();
                return cardBounds.right > trackBounds.left + 1 &&
                    cardBounds.left < trackBounds.right - 1;
            });
            const firstVisible = visibleCards.length ? cards.indexOf(visibleCards[0]) : 0;
            const lastVisible = visibleCards.length ? cards.indexOf(visibleCards[visibleCards.length - 1]) : firstVisible;
            const scrollProgress = maxScroll > 0 ? Math.min(100, Math.round((scrollPosition / maxScroll) * 100)) : 100;

            previousButton.disabled = scrollPosition <= 1;
            nextButton.disabled = scrollPosition >= maxScroll - 1;
            count.textContent = (firstVisible + 1).toString().padStart(2, '0') +
                '–' + (lastVisible + 1).toString().padStart(2, '0') +
                ' / ' + cards.length.toString().padStart(2, '0');
            progressFill.style.width = scrollProgress + '%';
            progress.setAttribute('aria-valuenow', String(scrollProgress));
        };

        const scrollByPage = function(direction) {
            track.scrollBy({
                left: direction * track.clientWidth * 0.85,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
            updateControls();
        };

        previousButton.addEventListener('click', function() {
            scrollByPage(-1);
        });

        nextButton.addEventListener('click', function() {
            scrollByPage(1);
        });

        track.addEventListener('scroll', updateControls, { passive: true });
        track.addEventListener('keydown', function(event) {
            if (event.key === 'ArrowLeft') {
                event.preventDefault();
                scrollByPage(-1);
            } else if (event.key === 'ArrowRight') {
                event.preventDefault();
                scrollByPage(1);
            }
        });
        window.addEventListener('resize', updateControls);
        updateControls();
    };

    // initialize
    (function init() {

        preloader();
        moveHeader();
        mobileMenu();
        aos();
        smoothScroll();
        backToTop();
        scrollMenuActive();
        profilePhotoCarousel();
        certificatesCarousel();
        
    })();

})(jQuery);


var vm = new Vue({
    el: '#projects',
    data() {
        return {
            ...data
        };
    },
});
