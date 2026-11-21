(function () {
    'use strict';

    const header = document.querySelector('.s-header');
    const menuToggle = document.querySelector('.header-menu-toggle');
    const headerContent = document.querySelector('.header-content');
    const menuLinks = document.querySelectorAll('.header-nav a, [data-cv-download]');
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

    // The class is only added after JS runs so content stays visible without it.
    if (!reducedMotion.matches && 'IntersectionObserver' in window) {
        document.documentElement.classList.add('motion-ready');
    }

    function setMenuOpen(isOpen) {
        document.body.classList.toggle('menu-is-open', isOpen);
        if (menuToggle) {
            menuToggle.classList.toggle('is-clicked', isOpen);
            menuToggle.setAttribute('aria-expanded', String(isOpen));
            const language = document.documentElement.lang === 'en' ? 'en' : 'fr';
            menuToggle.setAttribute(
                'aria-label',
                isOpen
                    ? (language === 'en' ? 'Close menu' : 'Fermer le menu')
                    : (language === 'en' ? 'Open menu' : 'Ouvrir le menu')
            );
        }
    }

    if (menuToggle && headerContent) {
        menuToggle.addEventListener('click', function () {
            setMenuOpen(menuToggle.getAttribute('aria-expanded') !== 'true');
        });

        menuLinks.forEach(function (link) {
            link.addEventListener('click', function () {
                if (window.matchMedia('(max-width: 1350px)').matches) setMenuOpen(false);
            });
        });

        document.querySelectorAll('[data-language], [data-theme-toggle]').forEach(function (control) {
            control.addEventListener('click', function () {
                setMenuOpen(false);
            });
        });

        document.addEventListener('keydown', function (event) {
            if (event.key === 'Escape' && document.body.classList.contains('menu-is-open')) {
                setMenuOpen(false);
                menuToggle.focus();
            }
        });

        window.addEventListener('resize', function () {
            if (window.innerWidth > 1350) setMenuOpen(false);
        });
    }

    function updateHeader() {
        if (header) header.classList.toggle('sticky', window.scrollY > 24);
    }
    window.addEventListener('scroll', updateHeader, { passive: true });
    updateHeader();

    document.querySelectorAll('a.smoothscroll[href^="#"]').forEach(function (link) {
        link.addEventListener('click', function (event) {
            const target = document.querySelector(link.getAttribute('href'));
            if (!target) return;
            event.preventDefault();
            target.scrollIntoView({
                behavior: reducedMotion.matches ? 'auto' : 'smooth',
                block: 'start'
            });
            history.replaceState(null, '', link.getAttribute('href'));
        });
    });

    const sections = Array.from(document.querySelectorAll('main section[id]'));
    const navigationLinks = document.querySelectorAll('.header-nav a[href^="#"]');
    if ('IntersectionObserver' in window) {
        const sectionObserver = new IntersectionObserver(function (entries) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                navigationLinks.forEach(function (link) {
                    if (link.getAttribute('href') === '#' + entry.target.id) {
                        link.classList.add('active-link');
                        link.setAttribute('aria-current', 'location');
                    } else {
                        link.classList.remove('active-link');
                        link.removeAttribute('aria-current');
                    }
                });
            });
        }, { rootMargin: '-25% 0px -65% 0px' });
        sections.forEach(function (section) {
            sectionObserver.observe(section);
        });
    }

    if ('IntersectionObserver' in window && !reducedMotion.matches) {
        const revealObserver = new IntersectionObserver(function (entries, observer) {
            entries.forEach(function (entry) {
                if (!entry.isIntersecting) return;
                entry.target.classList.add('is-visible');
                observer.unobserve(entry.target);
            });
        }, { threshold: 0.12 });
        document.querySelectorAll([
            '.content-section header .section-eyebrow',
            '.content-section header h2',
            '.content-section header > p:not(.section-eyebrow)',
            '.about-story', '.about-profile',
            '.content-section .skill-card', '.content-section .gallery-project',
            '.experience-item', '.education-item', '.certificate-card',
            '.contact-layout > *', '.contact-footer'
        ].join(',')).forEach(function (element) {
            element.classList.add('reveal');
            revealObserver.observe(element);
        });

        const timeline = document.querySelector('.experience-timeline');
        if (timeline) {
            const timelineObserver = new IntersectionObserver(function (entries, observer) {
                if (!entries.some(function (entry) { return entry.isIntersecting; })) return;
                timeline.classList.add('is-visible');
                observer.disconnect();
            }, { threshold: 0.1 });
            timelineObserver.observe(timeline);
        }
    }

    const profileCarousel = document.querySelector('.profile-carousel');
    if (profileCarousel) {
        const photos = Array.from(profileCarousel.querySelectorAll('img'));
        const prefersReducedMotion = reducedMotion.matches;
        let currentPhoto = 0;
        let photoTimer = null;

        function updatePhoto(index) {
            currentPhoto = index;
            photos.forEach(function (photo, photoIndex) {
                const isActive = photoIndex === currentPhoto;
                photo.classList.toggle('is-active', isActive);
                photo.setAttribute('aria-hidden', String(!isActive));
            });
        }

        function stopPhotoTimer() {
            if (photoTimer !== null) window.clearInterval(photoTimer);
            photoTimer = null;
        }

        function startPhotoTimer() {
            stopPhotoTimer();
            if (prefersReducedMotion || document.hidden || photos.length < 2) return;
            photoTimer = window.setInterval(function () {
                updatePhoto((currentPhoto + 1) % photos.length);
            }, 5000);
        }

        if (photos.length > 1) {
            updatePhoto(0);
            document.addEventListener('visibilitychange', startPhotoTimer);
            startPhotoTimer();
        }
    }

    const carousel = document.querySelector('[data-certificates-carousel]');
    if (carousel) {
        const track = carousel.querySelector('.certificates-track');
        const cards = Array.from(carousel.querySelectorAll('.certificate-card'));
        const previousButton = document.querySelector('[data-certificates-previous]');
        const nextButton = document.querySelector('[data-certificates-next]');
        const count = document.querySelector('[data-certificates-count]');
        const progress = carousel.querySelector('.certificates-progress');
        const progressFill = carousel.querySelector('[data-certificates-progress]');

        if (track && previousButton && nextButton && count && progress && progressFill && cards.length) {
            function updateControls() {
                const maxScroll = track.scrollWidth - track.clientWidth;
                const visibleBounds = track.getBoundingClientRect();
                const visibleCards = cards.filter(function (card) {
                    const bounds = card.getBoundingClientRect();
                    return bounds.right > visibleBounds.left + 1 && bounds.left < visibleBounds.right - 1;
                });
                const first = visibleCards.length ? cards.indexOf(visibleCards[0]) : 0;
                const last = visibleCards.length ? cards.indexOf(visibleCards[visibleCards.length - 1]) : first;
                const scrollProgress = maxScroll > 0
                    ? Math.min(100, Math.round((track.scrollLeft / maxScroll) * 100))
                    : 100;
                previousButton.disabled = track.scrollLeft <= 1;
                nextButton.disabled = track.scrollLeft >= maxScroll - 1;
                count.textContent = String(first + 1).padStart(2, '0') + '–' +
                    String(last + 1).padStart(2, '0') + ' / ' + String(cards.length).padStart(2, '0');
                progressFill.style.width = scrollProgress + '%';
                progress.setAttribute('aria-valuenow', String(scrollProgress));
            }

            function scrollByPage(direction) {
                track.scrollBy({
                    left: direction * track.clientWidth * 0.85,
                    behavior: reducedMotion.matches ? 'auto' : 'smooth'
                });
            }

            previousButton.addEventListener('click', function () { scrollByPage(-1); });
            nextButton.addEventListener('click', function () { scrollByPage(1); });
            track.addEventListener('scroll', updateControls, { passive: true });
            track.addEventListener('keydown', function (event) {
                if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
                    event.preventDefault();
                    scrollByPage(event.key === 'ArrowRight' ? 1 : -1);
                }
            });
            window.addEventListener('resize', updateControls);
            updateControls();
        }
    }

    const backToTop = document.querySelector('.ss-go-top');
    if (backToTop) {
        function updateBackToTop() {
            backToTop.classList.toggle('link-is-visible', window.scrollY > 800);
        }
        window.addEventListener('scroll', updateBackToTop, { passive: true });
        updateBackToTop();
    }
})();
