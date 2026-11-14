(function () {
    const visitorCount = document.querySelector('[data-analytics-visitors]');
    if (!visitorCount) return;

    const copy = {
        fr: {
            loading: 'Visiteurs uniques : chargement…',
            unavailable: 'Visiteurs uniques : indisponible',
            format: function (count) {
                return 'Visiteurs uniques : ' + new Intl.NumberFormat('fr-FR').format(count);
            }
        },
        en: {
            loading: 'Unique visitors: loading…',
            unavailable: 'Unique visitors: unavailable',
            format: function (count) {
                return 'Unique visitors: ' + new Intl.NumberFormat('en-US').format(count);
            }
        }
    };

    let visitorTotal = null;
    let requestFailed = false;

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'fr';
    }

    function updateVisitorCount() {
        const text = copy[currentLanguage()];
        if (visitorTotal !== null) {
            visitorCount.textContent = text.format(visitorTotal);
        } else if (requestFailed) {
            visitorCount.textContent = text.unavailable;
        } else {
            visitorCount.textContent = text.loading;
        }
    }

    function startGoogleAnalytics(measurementId) {
        if (!/^G-[A-Z0-9]+$/i.test(measurementId) || window.gtag) return;

        window.dataLayer = window.dataLayer || [];
        window.gtag = function () {
            window.dataLayer.push(arguments);
        };
        window.gtag('js', new Date());
        window.gtag('config', measurementId);

        const script = document.createElement('script');
        script.async = true;
        script.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(measurementId);
        script.onerror = function () {
            console.error('[Analytics] Google tag could not be loaded.');
        };
        document.head.appendChild(script);
    }

    async function loadAnalytics() {
        try {
            const response = await fetch('/api/analytics/visitors', {
                method: 'GET',
                credentials: 'same-origin',
                headers: { Accept: 'application/json' },
                signal: AbortSignal.timeout(8000)
            });
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(payload.code || 'analytics_unavailable');
            }
            if (typeof payload.measurementId !== 'string'
                || !/^G-[A-Z0-9]+$/i.test(payload.measurementId)
                || !Number.isSafeInteger(payload.visitors)
                || payload.visitors < 0) {
                throw new Error('analytics_invalid_response');
            }

            visitorTotal = payload.visitors;
            startGoogleAnalytics(payload.measurementId);
        } catch (error) {
            requestFailed = true;
            console.warn('[Analytics] Visitor statistics are unavailable.', {
                code: error instanceof Error ? error.message : 'unknown_error'
            });
        }
        updateVisitorCount();
    }

    new MutationObserver(updateVisitorCount).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });

    updateVisitorCount();
    loadAnalytics();
})();
