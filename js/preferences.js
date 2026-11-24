(function () {
    const translations = {
        en: {
            pageTitle: 'Ayoub Addichane | AI & Software Engineer',
            pageDescription: 'Portfolio of Ayoub Addichane, a computer engineer specializing in artificial intelligence, machine learning, deep learning, computer vision, OCR, and generative AI (LLMs and RAG).',
            navHome: 'Home', navAbout: 'About', navSkills: 'Skills', navProjects: 'Projects',
            navCertificates: 'Certificates', navJournal: 'Experience', navLife: 'Education',
            navGallery: 'Gallery', navContact: 'Contact',
            siteControlsLabel: 'Site preferences', languageLabel: 'Language',
            menuLabel: 'Menu', menuOpen: 'Open menu', menuClose: 'Close menu',
            headerRole: 'AI Engineer', homeBrand: 'Ayoub Addichane, home',
            mainNavigation: 'Main navigation',
            certificatesEyebrow: 'Continuous learning',
            certificatesTitle: 'Certificates',
            certificatesIntro: 'Browse my certifications to explore more.',
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
            galleryRagCategory: 'Generative AI · RAG',
            galleryRagTitle: 'RAG chatbot for internal documents',
            galleryMedicalCategory: 'Artificial intelligence · Healthcare',
            galleryMedicalTitle: 'Predictive medical diagnosis',
            galleryMedicalHome: 'Diagnosis home page',
            galleryMedicalForm: 'Medical form',
            galleryMedicalAutofill: 'Automatic form completion',
            galleryMedicalFormContinuation: 'Medical assessment form',
            galleryMedicalResults: 'Analysis results',
            galleryMedicalDepression: 'Depression screening',
            galleryTuberculosisDiagnosis: 'Tuberculosis diagnosis from MRI scans',
            galleryTuberculosisResults: 'Tuberculosis test results',
            galleryAttendanceCategory: 'Computer vision · HR',
            galleryAttendanceTitle: 'Facial recognition attendance',
            galleryAttendanceRecognition: 'Facial recognition',
            galleryAttendanceApp: 'Attendance application',
            galleryHrCategory: 'Web development · HR',
            galleryHrTitle: 'Employee management',
            galleryHrApplication: 'Human resources management application',
            galleryHrDashboard: 'HR management dashboard',
            galleryHrWorkspace: 'HR management workspace',
            galleryHrAddEmployee: 'Add an employee',
            galleryHrPayroll: 'Automatically generated payslip',
            galleryFinanceCategory: 'Web development · Finance',
            galleryFinanceTitle: 'Expense tracking',
            galleryFinanceDashboard: 'Expense dashboard',
            galleryFinanceProjects: 'My projects',
            galleryFinanceProjectDetails: 'Project details',
            galleryEducationCategory: 'Web development · Education',
            galleryEducationTitle: 'Attendance tracking',
            galleryEducationDashboard: 'Home page',
            galleryEducationAuthentication: 'Sign-in',
            galleryEducationStudent: 'Student portal',
            galleryEducationAdminCards: 'Admin portal · Card assignment',
            galleryEducationRfid: 'RFID card reader',
            heroKicker: 'Artificial Intelligence Engineer · Morocco',
            heroPhotoLabel: "Ayoub Addichane's profile photo",
            heroTechnologies: 'Key technologies',
            heroTitle: 'I build intelligent systems that serve the real world.',
            heroSummary: 'I design and develop intelligent solutions that combine Machine Learning, Deep Learning, Computer Vision, and generative AI, from model development through to their integration into real-world applications.',
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
            projectImpactLabel: 'Impact',
            projectWsiImpact: 'LIMS prototype and automated quality control for medical images.',
            projectRagDescription: 'Developed a RAG chatbot that answers questions about a company’s internal documents and cites its sources. The system combines document chunking, embeddings, vector search, and a tailored architecture.',
            projectRagImpact: 'Contextualized, source-backed answers based on the company’s internal documents.',
            projectMedicalImage: 'Open the medical diagnosis application screenshot',
            projectMedicalTitle: 'Predictive medical diagnosis',
            projectMedicalOrganization: 'GlyciOne · July – September 2025',
            projectMedicalDescription: 'Developed a web application integrating Machine Learning and Deep Learning models for predictive diagnosis, alongside an OCR module to extract information from medical documents.',
            projectMedicalImpact: 'Predictive diagnosis application with automated medical data extraction.',
            projectDetailsLabel: 'View details',
            projectAttendanceDescription: 'Attendance tracking application using facial recognition, combining face detection and attendance management.',
            projectAttendanceImpact: 'Automated employee attendance tracking through facial recognition.',
            projectHrImpact: 'Employee management and automated payslip generation.',
            projectFinanceDescription: 'Web application for business expense tracking and management, organized around projects and budgets.',
            projectFinanceImpact: 'Business expenses and projects tracked in one dedicated application.',
            projectEducationDescription: 'Student attendance application with an admin portal, student profiles, and RFID card reading.',
            projectEducationImpact: 'Attendance tracking and student cards managed in one place.',
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
            certificatesTitle: 'Certificates', journalTitle: 'Experience', lifeTitle: 'Education', lifeEyebrow: 'Academic background', lifeIntro: 'My education, from physics to computer engineering.',
            educationTimelineLabel: 'Education timeline', educationContextLabel: 'Practical training', educationContextLabelText: 'In practice', educationContextYears: '2022–2026', educationContextDescription: 'Four professional experiences, from industrial operations to AI engineering.',
            educationPeriodOne: 'Oct. 2023 – June 2026', educationDegreeOne: 'State Engineering Degree in Computer Engineering', educationPlaceOne: 'Faculty of Sciences and Technology · Errachidia', educationDescriptionOne: 'Specialization in artificial intelligence, software engineering, and information systems.',
            educationPeriodTwo: 'Sept. 2021 – June 2023', educationDegreeTwo: 'Two-year university diploma · Mathematics, Computer Science and Physics', educationPlaceTwo: 'Faculty of Sciences and Technology · Settat', educationDescriptionTwo: 'Scientific foundation and first work in programming, algorithms, and modeling.',
            educationPeriodThree: 'Sept. 2020 – June 2021', educationDegreeThree: 'High school diploma · Physical sciences', educationPlaceThree: 'Almorabitin Qualified High School · Tinghir',
            skillsEyebrow: 'Technical expertise', skillsTitle: 'Skills', skillsIntro: 'Combined strengths in artificial intelligence, software engineering, and teamwork.',
            galleryTitle: 'Gallery', contactTitle: 'Contact', contactEyebrow: 'Available to collaborate', contactEmailLabel: 'Send an email', contactPhoneLabel: 'Phone', contactLocationLabel: 'Location', contactProfilesLabel: 'Professional profiles', contactFooterNote: 'Designed with precision and curiosity.',
            contactIntro: 'Interested in an AI or full-stack development role?',
            contactCollaboration: 'Have an idea, project, or digital need? I am also open to collaborations to turn your ideas into practical, innovative solutions.',
            contactCta: 'Get in touch — let’s bring your ideas to life!',
            contactCity: 'Casablanca, Morocco',
            downloadCv: 'Download my CV',
            visitorCountLoading: 'Unique visitors: loading…', visitorCountUnavailable: 'Unique visitors: unavailable',

            skillsLead: 'Technical skills',
            skillAi: 'Artificial intelligence', skillWeb: 'Web development', skillData: 'Data and tools',
            skillAiText: 'Python, TensorFlow, Keras, PyTorch, Scikit-learn, computer vision, OCR, LLMs, RAG, and fine-tuning.',
            skillWebText: 'ASP.NET Core, React, Next.js, NestJS, Laravel, Flask, FastAPI, REST APIs, HTML, CSS, and JavaScript.',
            skillDataText: 'PostgreSQL, MySQL, SQL Server, Oracle, MongoDB, Git, GitHub, Docker, Postman, and Jupyter.',
            journalIntro: 'My professional experience, from most recent to earliest.',
            journalEyebrow: 'Professional experience',
            journalRoleOne: 'AI Engineer · DataPathology',
            journalDateOne: 'February–June 2026 · 5 months · Casablanca, Morocco',
            journalDescriptionOne: 'Designed and developed a laboratory information management system (LIMS) prototype and a whole-slide imaging (WSI) viewer. Integrated an AI module to automatically assess image quality.',
            journalDetailOneA: 'Developed a LIMS system and a whole-slide histological image (WSI) viewer.',
            journalDetailOneB: 'Prepared, analyzed, and annotated a histological image dataset.',
            journalDetailOneC: 'Fine-tuned a ResNet-50 model for automatic image quality assessment.',
            journalDetailOneD: 'Developed an inference pipeline and a dedicated model API.',
            journalDetailOneE: 'Automated processing and containerized services with Docker.',
            journalRoleTwo: 'AI Engineer · GlyciOne France',
            journalDateTwo: 'July–October 2025 · 4 months · France',
            journalDescriptionTwo: 'Developed a web application for predictive diagnosis (Alzheimer’s disease, depression, and hypertension) using ASP.NET, machine learning and deep learning models, and Tesseract OCR to extract data from medical documents.',
            journalDetailTwoA: 'Designed and developed a predictive diagnostic web application covering Alzheimer’s disease, depression, and hypertension.',
            journalDetailTwoB: 'Developed and integrated machine learning and deep learning models for medical data analysis and risk prediction.',
            journalDetailTwoC: 'Implemented a Tesseract OCR module to automatically extract and structure information from medical documents.',
            journalDetailTwoD: 'Developed the ASP.NET backend for data processing and intelligent feature integration.',
            journalRoleThree: 'Software Engineer · RIRAKTECH SARL',
            journalDateThree: 'July 2024 · 1 month · Rabat, Morocco',
            journalDescriptionThree: 'Designed, developed, and delivered a web application for employee management, including automated payslip calculations.',
            journalDetailThreeA: 'Analyzed requirements and designed an employee management web application.',
            journalDetailThreeB: 'Developed employee management features and administrative information tracking.',
            journalDetailThreeC: 'Implemented automated salary calculations and payslip generation.',
            journalDetailThreeD: 'Developed and delivered a solution to simplify and automate administrative tasks.',
            journalRoleFour: 'Geology and Processing · Managem Group (SMI)',
            journalDateFour: 'August 2022, August 2023, and August–September 2024 · 4 months total · Tinghir, Morocco',
            journalDescriptionFour: 'Worked in the geology and processing departments as part of an industry placement.',
            journalDetailFourA: 'Completed my first professional experience in an industrial environment within the geology and processing departments.',
            journalDetailFourB: 'Participated in operational activities in a demanding industrial environment.',
            journalDetailFourC: 'Developed discipline, punctuality, and teamwork skills.',
            journalDetailFourD: 'Learned to follow internal procedures, labor regulations, and occupational health and safety standards (HSE).',
            journalDetailFourE: 'Adapted to professional requirements and followed assigned instructions and responsibilities.',
            experienceStackLabel: 'Tech stack',
            experienceDomainLabel: 'Domains',
            experienceStackAria: 'Technology stack',
            experienceDomainAria: 'Professional domains',
            skillCardOneTitle: 'Artificial Intelligence & Machine Learning',
            skillCardOneText: 'Python, NumPy, Pandas, Scikit-learn, TensorFlow, Keras, PyTorch, machine learning, deep learning, regression, classification, clustering, feature engineering, hyperparameter tuning, Random Forest, XGBoost, SVM, KNN, PCA, and Naive Bayes.',
            skillCategoryOne: 'AI',
            skillCategoryEight: 'Design',
            skillCategoryNine: 'Security',
            skillCardTwoTitle: 'Generative AI, LLMs & RAG',
            skillCardTwoText: 'Large language models, generative AI, retrieval-augmented generation, prompt engineering, embeddings, semantic search, chunking, vector search, LangChain, Hugging Face, FAISS, ChromaDB, LLM API integration, and AI chatbots.',
            skillCardThreeTitle: 'Computer Vision & Image Processing',
            skillCardThreeText: 'OpenCV, OpenSlide, Tesseract OCR, image classification, patch extraction, medical image analysis, whole-slide images, automated quality control, ResNet-50 fine-tuning, heat maps, and result analysis.',
            skillCardFourTitle: 'Full-Stack Web Development',
            skillCardFourText: 'C#, ASP.NET Core, Entity Framework, React.js, Next.js, NestJS, Laravel, Flask, FastAPI, PHP, HTML5, CSS3, JavaScript, TypeScript, Tailwind CSS, Bootstrap, REST APIs, JWT, and MVC architecture.',
            skillCardFiveTitle: 'Programming Languages',
            skillCardFiveText: 'Python, C#, Java, C, C++, JavaScript, TypeScript, PHP, SQL, and object-oriented programming.',
            skillCardSixTitle: 'Databases & Data Engineering',
            skillCardSixText: 'PostgreSQL, MySQL, Microsoft SQL Server, Oracle Database, MongoDB, data modeling, advanced SQL, data cleaning, preprocessing, and dataset preparation.',
            skillCardSevenTitle: 'Deployment, DevOps & MLOps',
            skillCardSevenText: 'Git, GitHub, Docker, AI model APIs, pipeline automation, model deployment, application integration, Postman, Jupyter Notebook, and Python environments.',
            skillCardEightTitle: 'Design & Methodologies',
            skillCardEightText: 'UML, object-oriented programming, MVC architecture, REST API design, requirements analysis, problem-solving, testing, documentation, and Agile.',
            skillCardNineTitle: 'Security & Access Management',
            skillCardNineText: 'JWT authentication, roles and permissions, access control, REST API security, and data protection.',
            skillCardTenTitle: 'Soft Skills',
            skillCardTenText: 'Analytical thinking, independence, curiosity, problem-solving, attention to detail, organization, continuous learning, adaptability, creativity, perseverance, teamwork, and communication.',
            skillGroupDataTitle: 'Data & DevOps',
            lifeIntro: 'My education and academic background.',
            galleryIntro: 'Explore a selection of my projects, organized by area.'
        },
        fr: {}
    };

    const labels = {
        fr: { light: 'Mode clair', dark: 'Mode sombre' },
        en: { light: 'Light mode', dark: 'Dark mode' }
    };
    const root = document.documentElement;
    const originalPageTitle = document.title;
    const descriptionMeta = document.querySelector('meta[name="description"]');
    const originalPageDescription = descriptionMeta ? descriptionMeta.content : '';
    const openGraphTitle = document.querySelector('meta[property="og:title"]');
    const originalOpenGraphTitle = openGraphTitle ? openGraphTitle.content : '';
    const openGraphDescription = document.querySelector('meta[property="og:description"]');
    const originalOpenGraphDescription = openGraphDescription ? openGraphDescription.content : '';
    const languageButtons = document.querySelectorAll('[data-language]');
    const themeButton = document.querySelector('[data-theme-toggle]');
    const menuToggle = document.querySelector('.header-menu-toggle');
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
        if (menuToggle) {
            menuToggle.setAttribute(
                'aria-label',
                selectedLanguage === 'en' ? translations.en.menuOpen : 'Ouvrir le menu'
            );
        }
        document.title = selectedLanguage === 'en' ? translations.en.pageTitle : originalPageTitle;
        if (descriptionMeta) {
            descriptionMeta.content = selectedLanguage === 'en'
                ? translations.en.pageDescription
                : originalPageDescription;
        }
        if (openGraphTitle) {
            openGraphTitle.content = selectedLanguage === 'en'
                ? translations.en.pageTitle
                : originalOpenGraphTitle;
        }
        if (openGraphDescription) {
            openGraphDescription.content = selectedLanguage === 'en'
                ? translations.en.pageDescription
                : originalOpenGraphDescription;
        }
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
                '#contact h2': 'contactTitle',
        };
        Object.keys(replacements).forEach(function (selector) {
            const element = document.querySelector(selector);
            if (!element) return;
            if (!element.dataset.originalText) element.dataset.originalText = element.textContent;
            element.textContent = selectedLanguage === 'en' ? translations.en[replacements[selector]] : element.dataset.originalText;
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
