(function () {
    const projectGalleries = document.querySelectorAll('#projects .gallery-project__images');
    const mobileLayout = window.matchMedia('(max-width: 600px)');
    const text = {
        fr: {
            gallery: 'Galerie d’images du projet',
            galleryDescription: 'carrousel',
            previous: 'Images précédentes',
            next: 'Images suivantes',
            images: 'images',
            of: 'sur'
        },
        en: {
            gallery: 'Project image gallery',
            galleryDescription: 'carousel',
            previous: 'Previous images',
            next: 'Next images',
            images: 'images',
            of: 'of'
        }
    };

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'fr';
    }

    function setupGallery(gallery) {
        if (gallery.dataset.carouselInitialized === 'true') return;
        gallery.dataset.carouselInitialized = 'true';
        const figures = Array.from(gallery.querySelectorAll(':scope > figure'));
        if (figures.length <= 3) return;

        const project = gallery.closest('.gallery-project');
        const title = project.querySelector('.gallery-project__header h3');
        const projectName = title ? title.textContent.trim() : '';
        const track = document.createElement('div');
        track.className = 'gallery-carousel__track';
        figures.forEach(function (figure) {
            track.appendChild(figure);
        });
        gallery.appendChild(track);
        gallery.classList.add('gallery-project__images--carousel');
        gallery.setAttribute('role', 'region');
        gallery.setAttribute('tabindex', '0');
        gallery.setAttribute('aria-roledescription', 'carousel');

        const controls = document.createElement('div');
        controls.className = 'gallery-carousel__controls';
        const counter = document.createElement('p');
        counter.className = 'gallery-carousel__counter';
        counter.setAttribute('aria-live', 'polite');
        counter.setAttribute('aria-atomic', 'true');

        const previousButton = createButton('previous');
        const nextButton = createButton('next');
        controls.append(counter, previousButton, nextButton);
        gallery.insertAdjacentElement('afterend', controls);

        let frame = 0;

        function pageSize() {
            return mobileLayout.matches ? 1 : 3;
        }

        function stepSize() {
            const firstFigure = track.querySelector('figure');
            if (!firstFigure) return 0;
            const trackStyle = window.getComputedStyle(track);
            return firstFigure.getBoundingClientRect().width + parseFloat(trackStyle.columnGap || trackStyle.gap || '0');
        }

        function firstVisibleIndex() {
            const step = stepSize();
            return step ? Math.max(0, Math.round(gallery.scrollLeft / step)) : 0;
        }

        function updateControls() {
            frame = 0;
            const size = pageSize();
            const firstIndex = Math.min(firstVisibleIndex(), Math.max(0, figures.length - size));
            const lastIndex = Math.min(firstIndex + size, figures.length);
            const labels = text[currentLanguage()];
            gallery.setAttribute('aria-label', labels.gallery + (projectName ? ': ' + projectName : ''));
            gallery.setAttribute('aria-roledescription', labels.galleryDescription);
            previousButton.setAttribute('aria-label', labels.previous);
            nextButton.setAttribute('aria-label', labels.next);
            counter.textContent = `${firstIndex + 1}–${lastIndex} ${labels.of} ${figures.length} ${labels.images}`;
            previousButton.disabled = firstIndex === 0;
            nextButton.disabled = lastIndex >= figures.length;
        }

        function scrollByPage(direction) {
            const size = pageSize();
            const currentIndex = firstVisibleIndex();
            const lastStart = Math.max(0, figures.length - size);
            const targetIndex = Math.max(0, Math.min(lastStart, currentIndex + direction * size));
            const step = stepSize();
            gallery.scrollTo({
                left: targetIndex * step,
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
            });
        }

        function createButton(direction) {
            const button = document.createElement('button');
            button.className = 'gallery-carousel__button';
            button.type = 'button';
            button.setAttribute('aria-label', text[currentLanguage()][direction]);
            button.innerHTML = direction === 'previous'
                ? '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m15 18-6-6 6-6"/></svg>'
                : '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="m9 18 6-6-6-6"/></svg>';
            button.addEventListener('click', function () {
                scrollByPage(direction === 'next' ? 1 : -1);
            });
            return button;
        }

        gallery.addEventListener('scroll', function () {
            if (!frame) frame = window.requestAnimationFrame(updateControls);
        }, { passive: true });

        mobileLayout.addEventListener('change', function () {
            const firstIndex = firstVisibleIndex();
            const size = pageSize();
            const targetIndex = Math.min(Math.floor(firstIndex / size) * size, figures.length - size);
            gallery.scrollTo({ left: Math.max(0, targetIndex) * stepSize(), behavior: 'auto' });
            updateControls();
        });

        updateControls();
    }

    projectGalleries.forEach(function (gallery) {
        const details = gallery.closest('details');
        if (!details) {
            setupGallery(gallery);
            return;
        }
        details.addEventListener('toggle', function () {
            if (details.open) setupGallery(gallery);
        });
        if (details.open) setupGallery(gallery);
    });

    new MutationObserver(function () {
        projectGalleries.forEach(function (gallery) {
            const counter = gallery.nextElementSibling?.querySelector('.gallery-carousel__counter');
            if (!counter) return;
            const event = new Event('scroll');
            gallery.dispatchEvent(event);
        });
    }).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });
})();
