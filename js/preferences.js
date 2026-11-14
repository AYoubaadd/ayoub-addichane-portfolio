(function () {
    const translations = {
        en: {
            navHome: 'Home', navAbout: 'About', navSkills: 'Skills', navProjects: 'Projects',
            navCertificates: 'Certificates', navJournal: 'Journal', navLife: 'Education',
            navGallery: 'Gallery', navContact: 'Contact',
            menuLabel: 'Menu', menuOpen: 'Open menu', menuClose: 'Close menu',
            headerRole: 'AI Engineer', homeBrand: 'Ayoub Addichane, home',
            mainNavigation: 'Main navigation',
            certificatesEyebrow: 'Continuous learning',
            certificatesTitle: 'Certificates',
            certificatesIntro: 'A selection of my certifications. Scroll to explore more.',
            certificatesControls: 'Certificate controls',
            certificatesPrevious: 'Previous certificates',
            certificatesNext: 'Next certificates',
            certificatesGallery: 'Certificate gallery',
            certificatesProgress: 'Certificate browsing progress',
            galleryEyebrow: 'Selected projects',
            galleryIntro: 'Explore a selection of my projects, organized by area.',
            galleryWsiCategory: 'Medical AI · Digital imaging',
            galleryWsiTitle: 'Whole slide imaging (WSI) viewer',
            galleryWsiDashboard: 'LIMS dashboard',
            galleryWsiViewer: 'WSI viewing and analysis',
            galleryWsiWorkflow: 'Digital imaging workflow',
            galleryMedicalCategory: 'Artificial intelligence · Healthcare',
            galleryMedicalTitle: 'Predictive medical diagnosis',
            galleryMedicalHome: 'Diagnosis home page',
            galleryMedicalForm: 'Medical form',
            galleryMedicalResults: 'Prediction results',
            galleryMedicalDepression: 'Depression screening',
            galleryAttendanceCategory: 'Computer vision · HR',
            galleryAttendanceTitle: 'Facial recognition attendance',
            galleryAttendanceRecognition: 'Facial recognition',
            galleryAttendanceApp: 'Attendance application',
            galleryHrCategory: 'Web development · HR',
            galleryHrTitle: 'Employee management',
            galleryHrDashboard: 'HR management workspace',
            galleryFinanceCategory: 'Web development · Finance',
            galleryFinanceTitle: 'Expense tracking',
            galleryFinanceDashboard: 'Expense dashboard',
            heroKicker: 'Artificial Intelligence Engineer · Morocco',
            heroTitle: 'I build intelligent systems that serve the real world.',
            heroSummary: 'Ayoub Addichane — applied AI, computer vision, and full-stack development.',
            heroProjects: 'Explore projects', heroJourney: 'My background', heroCv: 'Download my CV',
            aboutTitle: 'About', skillsTitle: 'Skills', projectsTitle: 'Projects',
            aboutEyebrow: 'Professional profile',
            aboutLead: 'As a computer engineer, I build digital solutions that connect artificial intelligence with real-world needs.',
            aboutStoryOne: 'I am Ayoub Addichane, a computer engineering graduate focused on applied artificial intelligence, computer vision, and full-stack application development.',
            aboutStoryTwo: 'I have contributed to projects combining AI models, web applications, and cloud technologies. I continue to explore LLMs, RAG, and intelligent agents, with a focus on useful, reliable solutions designed around their users.',
            aboutSkillsLink: 'Explore my skills',
            aboutCvLink: 'Download my CV',
            aboutProfileLabel: 'Areas of focus and languages',
            aboutFocusTitle: 'Areas of focus',
            aboutFocusAi: 'Applied artificial intelligence',
            aboutFocusFullStack: 'Full-stack development',
            aboutFocusCloud: 'Cloud and data engineering',
            aboutLanguagesTitle: 'Languages',
            aboutLanguageFrench: 'French',
            aboutLanguageEnglish: 'English',
            aboutLanguageArabic: 'Arabic',
            aboutLanguageTamazight: 'Tamazight',
            aboutLevelProfessional: 'Professional',
            aboutLevelNative: 'Native',
            projectsEyebrow: 'Selected work',
            projectsIntro: 'Real-world experience at the intersection of artificial intelligence, healthcare, and software development.',
            projectTypeInternship: 'Graduation internship',
            projectTechLabel: 'Technologies used',
            projectWsiImage: 'Open the WSI viewer screenshot',
            projectWsiTitle: 'LIMS prototype and WSI viewer',
            projectWsiOrganization: 'DataPathology · February – June 2026',
            projectWsiDescription: 'Designed a laboratory management prototype and a viewer for exploring digitized slides. Integrated an AI model to automatically assess image quality.',
            projectMedicalImage: 'Open the medical diagnosis application screenshot',
            projectMedicalTitle: 'Predictive medical diagnosis',
            projectMedicalOrganization: 'GlyciOne · July – September 2025',
            projectMedicalDescription: 'Developed a web application integrating Machine Learning and Deep Learning models for predictive diagnosis, alongside an OCR module to extract information from medical documents.',
            projectTypeIntroductory: 'Introductory internship',
            projectHrImage: 'Open the employee management application screenshot',
            projectHrTitle: 'Employee and payroll management',
            projectHrOrganization: 'RIRAKTECH · July – August 2024',
            projectHrDescription: 'Designed and delivered a web application to manage employees and automate payroll calculations.',
            academicEyebrow: 'Learning & experimentation',
            academicTitle: 'Academic projects',
            academicIntro: 'Prototypes applying AI and application development.',
            academicAttendanceTitle: 'Facial recognition attendance',
            academicAttendanceDescription: 'Desktop attendance tracking application using computer vision.',
            academicRecommendationTitle: 'Product recommendations',
            academicRecommendationDescription: 'Machine Learning model designed to personalize product recommendations.',
            academicExpensesTitle: 'Expense tracking',
            academicExpensesDescription: 'Web application for tracking business budgets and expenses.',
            certificatesTitle: 'Certificates', journalTitle: 'Journal', lifeTitle: 'Education', lifeEyebrow: 'Academic background', lifeIntro: 'My education, from physics to computer engineering.',
            educationTimelineLabel: 'Education timeline', educationContextLabel: 'Practical training', educationContextLabelText: 'In practice', educationContextYears: '2022–2026', educationContextDescription: 'Four professional experiences and company placements, from industrial operations to AI engineering.',
            educationPeriodOne: 'Oct. 2023 – June 2026', educationDegreeOne: 'State Engineering Degree in Computer Engineering', educationPlaceOne: 'Faculty of Sciences and Technology · Errachidia', educationDescriptionOne: 'Specialization in artificial intelligence, software engineering, and information systems.',
            educationPeriodTwo: 'Sept. 2021 – June 2023', educationDegreeTwo: 'Two-year university diploma · Mathematics, Computer Science and Physics', educationPlaceTwo: 'Faculty of Sciences and Technology · Settat', educationDescriptionTwo: 'Scientific foundation and first work in programming, algorithms, and modeling.',
            educationPeriodThree: 'Sept. 2020 – June 2021', educationDegreeThree: 'High school diploma · Physical sciences', educationPlaceThree: 'Almorabitin Qualified High School · Tinghir',
            skillsEyebrow: 'Technical expertise', skillsTitle: 'Skills', skillsIntro: 'Combined strengths in artificial intelligence, software engineering, and teamwork.',
            galleryTitle: 'Gallery', contactTitle: 'Contact', contactEyebrow: 'Available to collaborate', contactEmailLabel: 'Send an email', contactPhoneLabel: 'Phone', contactLocationLabel: 'Location', contactProfilesLabel: 'Professional profiles', contactFooterNote: 'Designed with precision and curiosity.',
            visitorCountLoading: 'Unique visitors: loading…', visitorCountUnavailable: 'Unique visitors: unavailable',

            skillsLead: 'Technical skills',
            skillAi: 'Artificial intelligence', skillWeb: 'Web development', skillData: 'Data and tools',
            skillAiText: 'Python, TensorFlow, Keras, PyTorch, Scikit-learn, computer vision, OCR, LLMs, RAG, and fine-tuning.',
            skillWebText: 'ASP.NET Core, React, Next.js, NestJS, Laravel, Flask, FastAPI, REST APIs, HTML, CSS, and JavaScript.',
            skillDataText: 'PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Git, GitHub, Docker, Postman, and Jupyter.',
            journalIntro: 'My professional experience, from most recent to earliest.',
            lifeIntro: 'My education and academic background.',
            galleryIntro: 'Explore a selection of my projects, organized by area.',
            contactIntro: 'Interested in an AI or full-stack development role? Get in touch.'
        },
        fr: {}
    };

    const labels = {
        fr: { light: 'Mode clair', dark: 'Mode sombre' },
        en: { light: 'Light mode', dark: 'Dark mode' }
    };
    const root = document.documentElement;
    const languageButtons = document.querySelectorAll('[data-language]');
    const themeButton = document.querySelector('[data-theme-toggle]');
    const themeLabel = document.querySelector('[data-theme-label]');
    const themeIcon = document.querySelector('[data-theme-icon]');

    function readPreference(key, fallback) {
        try {
            return localStorage.getItem(key) || fallback;
        } catch (error) {
            return fallback;
        }
    }

    function savePreference(key, value) {
        try {
            localStorage.setItem(key, value);
        } catch (error) {}
    }

    function setLanguage(language) {
        const selectedLanguage = language === 'en' ? 'en' : 'fr';
        root.lang = selectedLanguage;
        const cvFile = selectedLanguage === 'en'
            ? 'CV_Ayoub_Addichane_AI_Engineer.pdf'
            : 'CV_Ayoub_Addichane_Ing%C3%A9nieur_IA.pdf';
        document.querySelectorAll('[data-cv-download]').forEach(function (link) {
            link.href = cvFile;
            link.download = decodeURIComponent(cvFile);
        });
        document.querySelectorAll('[data-i18n]').forEach(function (element) {
            const translation = translations[selectedLanguage][element.dataset.i18n];
            if (!element.dataset.originalText) element.dataset.originalText = element.textContent;
            element.textContent = translation || element.dataset.originalText;
        });
        document.querySelectorAll('[data-i18n-aria-label]').forEach(function (element) {
            const translation = translations[selectedLanguage][element.dataset.i18nAriaLabel];
            if (!element.dataset.originalAriaLabel) element.dataset.originalAriaLabel = element.getAttribute('aria-label');
            element.setAttribute('aria-label', translation || element.dataset.originalAriaLabel);
        });
        const replacements = {
                '#about h2': 'aboutTitle', '#skills h2': 'skillsTitle',
                '#projects h2': 'projectsTitle', '#certificates h2': 'certificatesTitle',
                '#journal h2': 'journalTitle', '#life h2': 'lifeTitle', '#gallery h2': 'galleryTitle',
                '#contact h2': 'contactTitle', '#journal > .row p': 'journalIntro',
                '#life > .row p': 'lifeIntro', '#gallery > .row p': 'galleryIntro',
                '#contact > .row p': 'contactIntro'
        };
        Object.keys(replacements).forEach(function (selector) {
            const element = document.querySelector(selector);
            if (!element) return;
            if (!element.dataset.originalText) element.dataset.originalText = element.textContent;
            element.textContent = selectedLanguage === 'en' ? translations.en[replacements[selector]] : element.dataset.originalText;
        });
        const skillCards = document.querySelectorAll('#skills .content-card');
        [['skillAi', 'skillAiText'], ['skillWeb', 'skillWebText'], ['skillData', 'skillDataText']].forEach(function (keys, index) {
            if (!skillCards[index]) return;
            ['h3', 'p'].forEach(function (tag, itemIndex) {
                const element = skillCards[index].querySelector(tag);
                if (!element.dataset.originalText) element.dataset.originalText = element.textContent;
                const translationKey = keys[itemIndex];
                element.textContent = selectedLanguage === 'en' ? translations.en[translationKey] : element.dataset.originalText;
            });
        });
        languageButtons.forEach(function (button) {
            button.setAttribute('aria-pressed', String(button.dataset.language === selectedLanguage));
        });
        savePreference('portfolio-language', selectedLanguage);
        updateThemeLabel(selectedLanguage);
    }

    function updateThemeLabel(language) {
        const isDark = root.dataset.theme === 'dark';
        themeLabel.textContent = isDark ? labels[language].light : labels[language].dark;
        themeIcon.textContent = isDark ? '☀' : '☾';
        themeButton.setAttribute('aria-pressed', String(isDark));
        themeButton.setAttribute('aria-label', themeLabel.textContent);
    }

    languageButtons.forEach(function (button) {
        button.addEventListener('click', function () {
            setLanguage(button.dataset.language);
            document.body.classList.remove('menu-is-open');
        });
    });

    themeButton.addEventListener('click', function () {
        root.dataset.theme = root.dataset.theme === 'dark' ? 'light' : 'dark';
        savePreference('portfolio-theme', root.dataset.theme);
        updateThemeLabel(root.lang || 'fr');
        document.body.classList.remove('menu-is-open');
    });

    setLanguage(readPreference('portfolio-language', 'fr'));
    updateThemeLabel(root.lang || 'fr');
})();
