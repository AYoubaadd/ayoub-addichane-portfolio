(function () {
    const root = document.querySelector('[data-chatbot]');
    if (!root) return;

    const toggle = root.querySelector('[data-chatbot-toggle]');
    const toggleLabel = root.querySelector('[data-chatbot-toggle-label]');
    const panel = root.querySelector('#chatbot-panel');
    const closeButton = root.querySelector('[data-chatbot-close]');
    const form = root.querySelector('[data-chatbot-form]');
    const input = root.querySelector('[data-chatbot-input]');
    const sendButton = root.querySelector('[data-chatbot-send]');
    const messages = root.querySelector('[data-chatbot-messages]');
    const greeting = root.querySelector('[data-chatbot-greeting]');
    const sessionCountKey = 'ayoub-chatbot-question-count';
    const sessionQuestionLimit = 15;
    let isSending = false;
    let statusMessage = null;

    const copy = {
        fr: {
            open: 'Discuter avec mon assistant',
            close: 'Fermer le chatbot',
            title: 'Assistant d’Ayoub',
            subtitle: 'Posez-moi une question sur mon parcours',
            greeting: 'Bonjour ! Je peux vous renseigner sur mes projets, mes compétences et mon parcours.',
            inputLabel: 'Votre question',
            placeholder: 'Écrivez votre question…',
            send: 'Envoyer le message',
            note: 'Les réponses sont générées par IA et peuvent contenir des erreurs.',
            sending: 'Je prépare une réponse…',
            failed: 'Le chatbot est momentanément indisponible. Réessayez plus tard.',
            rateLimited: 'Le nombre de questions autorisées a été atteint. Réessayez plus tard.',
            sessionLimit: 'Vous avez atteint la limite de questions pour cette session. Pour en savoir plus, contactez-moi.',
            required: 'Écrivez une question avant de l’envoyer.',
            tooLong: 'Votre message dépasse la limite de 1000 caractères.',
            contact: 'Me contacter',
            assistant: 'Assistant'
        },
        en: {
            open: 'Chat with my assistant',
            close: 'Close chatbot',
            title: 'Ayoub’s assistant',
            subtitle: 'Ask me about my background',
            greeting: 'Hello! I can answer questions about my projects, skills, and background.',
            inputLabel: 'Your question',
            placeholder: 'Type your question…',
            send: 'Send message',
            note: 'AI-generated answers may contain mistakes.',
            sending: 'Preparing a response…',
            failed: 'The chatbot is temporarily unavailable. Please try again later.',
            rateLimited: 'The question limit has been reached. Please try again later.',
            sessionLimit: 'You have reached the question limit for this session. Contact me to learn more.',
            required: 'Enter a question before sending.',
            tooLong: 'Your message exceeds the 1000-character limit.',
            contact: 'Contact me',
            assistant: 'Assistant'
        }
    };

    function currentLanguage() {
        return document.documentElement.lang === 'en' ? 'en' : 'fr';
    }

    function updateLanguage() {
        const text = copy[currentLanguage()];
        toggleLabel.textContent = text.open;
        toggle.setAttribute('aria-label', text.open);
        closeButton.setAttribute('aria-label', text.close);
        root.querySelector('[data-chatbot-title]').textContent = text.title;
        root.querySelector('[data-chatbot-subtitle]').textContent = text.subtitle;
        root.querySelector('[data-chatbot-input-label]').textContent = text.inputLabel;
        input.placeholder = text.placeholder;
        sendButton.setAttribute('aria-label', text.send);
        root.querySelector('[data-chatbot-note]').textContent = text.note;
        if (messages.children.length === 1 && greeting) greeting.textContent = text.greeting;
    }

    function setOpen(isOpen) {
        panel.hidden = !isOpen;
        toggle.setAttribute('aria-expanded', String(isOpen));
        if (isOpen) input.focus();
        else toggle.focus();
    }

    function appendMessage(text, type) {
        const message = document.createElement('p');
        message.className = 'chatbot-message chatbot-message--' + type;
        if (type.split(' ').includes('assistant')) {
            appendAssistantText(message, text);
        } else {
            message.textContent = text;
        }
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
        return message;
    }

    function appendAssistantText(element, text) {
        const links = /\[([^\]]+)\]\((#(?:about|skills|projects|certificates|life|contact))\)/gi;
        let lastIndex = 0;
        let match;
        while ((match = links.exec(text))) {
            element.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
            const link = document.createElement('a');
            link.href = match[2];
            link.textContent = match[1];
            element.appendChild(link);
            lastIndex = links.lastIndex;
        }
        element.appendChild(document.createTextNode(text.slice(lastIndex)));
    }

    function getQuestionCount() {
        try {
            return Number(sessionStorage.getItem(sessionCountKey)) || 0;
        } catch (error) {
            return 0;
        }
    }

    function incrementQuestionCount() {
        try {
            sessionStorage.setItem(sessionCountKey, String(getQuestionCount() + 1));
        } catch (error) {
            return;
        }
    }

    function appendContactMessage() {
        const text = copy[currentLanguage()];
        const message = document.createElement('p');
        message.className = 'chatbot-message chatbot-message--assistant';
        message.append(document.createTextNode(text.sessionLimit + ' '));
        const link = document.createElement('a');
        link.href = '#contact';
        link.textContent = text.contact;
        message.appendChild(link);
        messages.appendChild(message);
        messages.scrollTop = messages.scrollHeight;
    }

    async function sendMessage(message) {
        isSending = true;
        sendButton.disabled = true;
        input.disabled = true;
        statusMessage = appendMessage(copy[currentLanguage()].sending, 'assistant chatbot-message--status');

        try {
            const response = await fetch('/api/chat', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                credentials: 'same-origin',
                body: JSON.stringify({ message: message, locale: currentLanguage() })
            });
            let payload;
            try {
                payload = await response.json();
            } catch (error) {
                throw new Error('invalid_response');
            }

            if (!response.ok) {
                throw new Error(payload.code || 'provider_unavailable');
            }
            if (typeof payload.response !== 'string' || !payload.response.trim()) {
                throw new Error('invalid_response');
            }

            incrementQuestionCount();
            appendMessage(payload.response.trim(), 'assistant');
        } catch (error) {
            const text = copy[currentLanguage()];
            const errorMessage = error.message === 'rate_limited'
                ? text.rateLimited
                : text.failed;
            appendMessage(errorMessage, 'assistant');
        } finally {
            if (statusMessage) statusMessage.remove();
            statusMessage = null;
            isSending = false;
            sendButton.disabled = false;
            input.disabled = false;
            input.focus();
        }
    }

    toggle.addEventListener('click', function () {
        setOpen(panel.hidden);
    });

    closeButton.addEventListener('click', function () {
        setOpen(false);
    });

    document.addEventListener('keydown', function (event) {
        if (event.key === 'Escape' && !panel.hidden) setOpen(false);
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        if (isSending) return;

        const message = input.value.trim();
        const text = copy[currentLanguage()];
        if (!message) {
            appendMessage(text.required, 'assistant');
            input.focus();
            return;
        }
        if (message.length > 1000) {
            appendMessage(text.tooLong, 'assistant');
            input.focus();
            return;
        }
        if (getQuestionCount() >= sessionQuestionLimit) {
            appendContactMessage();
            return;
        }

        appendMessage(message, 'user');
        input.value = '';
        sendMessage(message);
    });

    new MutationObserver(updateLanguage).observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['lang']
    });
    updateLanguage();
})();
