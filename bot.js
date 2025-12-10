let helpData = [];
let welcomeMessage = '';
let currentState = null;
let thinkingElement = null;
let sessions = {}; // Store sessions by ticket

window.onload = async () => {
    await loadHelpData();
    if (welcomeMessage) {
        addMessage(welcomeMessage, 'bot');
    }
    loadState();
    if (currentState) {
        showContinueOption();
    }
    showResumeOption();
};

async function loadHelpData() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    const basePath = segments.length > 1 ? '/' + segments.slice(0, -1).join('/') : '';
    const helpUrl = basePath + '/help.txt';
    try {
        const response = await fetch(helpUrl);
        const text = await response.text();
        helpData = parseHelpText(text);
    } catch (error) {
        console.error('Error loading help data:', error);
        // Fallback to root
        try {
            const response = await fetch('/help.txt');
            const text = await response.text();
            helpData = parseHelpText(text);
        } catch (fallbackError) {
            console.error('Fallback error:', fallbackError);
        }
    }
}

function parseHelpText(text) {
    const lines = text.split('\n').map(line => line.trim());
    welcomeMessage = '';
    const data = [];
    let currentItem = null;

    lines.forEach(line => {
        if (line.startsWith('Welcome>:')) {
            welcomeMessage = line.substring(10).trim();
        } else if (line.startsWith('Question>:')) {
            if (currentItem) data.push(currentItem);
            currentItem = { question: line.substring(11).trim(), keys: [], answer: '', multiAnswer: '', steps: [] };
        } else if (line.startsWith('Key>:')) {
            if (currentItem) {
                currentItem.keys = line.substring(6).trim().split(',').map(k => k.trim().toLowerCase());
            }
        } else if (line.startsWith('Answer>:')) {
            if (currentItem) {
                currentItem.answer = line.substring(8).trim();
            }
        } else if (line.startsWith('Multi-Answer>:')) {
            if (currentItem) {
                currentItem.multiAnswer = line.substring(14).trim();
            }
        } else if (line.match(/^Step \d+ of \d+>:/)) {
            if (currentItem) {
                const stepText = line.split('>:')[1].trim();
                currentItem.steps.push(stepText);
            }
        }
    });
    if (currentItem) data.push(currentItem);
    return data;
}

function loadState() {
    const saved = localStorage.getItem('stepbot_sessions');
    if (saved) {
        sessions = JSON.parse(saved);
    }
    const currentTicket = localStorage.getItem('stepbot_current_ticket');
    if (currentTicket && sessions[currentTicket]) {
        currentState = sessions[currentTicket];
    }
}

function saveState() {
    localStorage.setItem('stepbot_sessions', JSON.stringify(sessions));
    if (currentState && currentState.ticket) {
        localStorage.setItem('stepbot_current_ticket', currentState.ticket);
        sessions[currentState.ticket] = currentState;
    } else {
        localStorage.removeItem('stepbot_current_ticket');
    }
}

function clearMemory() {
    currentState = null;
    saveState();
    addMessage('Session cleared.', 'bot');
}

function showResumeOption() {
    const resumeContainer = document.getElementById('resume-container');
    resumeContainer.style.display = 'block';
}

function resumeWithTicket() {
    const ticket = document.getElementById('ticket-input').value.trim();
    if (sessions[ticket]) {
        currentState = sessions[ticket];
        localStorage.setItem('stepbot_current_ticket', ticket);
        addMessage('Resuming session...', 'bot');
        continueSession();
        document.getElementById('resume-container').style.display = 'none';
    } else {
        addMessage('Invalid ticket. Please check and try again.', 'bot');
    }
}

function showContinueOption() {
    addMessage(`You have an ongoing session: "${currentState.question}". Do you want to continue?`, 'bot');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    const yesBtn = document.createElement('button');
    yesBtn.textContent = 'Yes, continue';
    yesBtn.className = 'option-btn continue-btn';
    yesBtn.onclick = () => {
        continueSession();
        optionsDiv.remove();
    };
    const noBtn = document.createElement('button');
    noBtn.textContent = 'No, start new';
    noBtn.className = 'option-btn';
    noBtn.onclick = () => {
        currentState = null;
        saveState();
        addMessage('Starting new session.', 'bot');
        optionsDiv.remove();
    };
    optionsDiv.appendChild(yesBtn);
    optionsDiv.appendChild(noBtn);
    document.getElementById('chat').appendChild(optionsDiv);
}

function continueSession() {
    if (currentState.multiAnswer) {
        showMultiStep(currentState);
    } else {
        addMessage(currentState.answer, 'bot');
    }
}

function sendMessage() {
    const input = document.getElementById('input');
    const message = input.value.trim();
    if (!message) return;
    addMessage(message, 'user');
    input.value = '';
    showThinking();
    setTimeout(() => {
        hideThinking();
        processMessage(message);
    }, 1500); // Simulate thinking time
}

function showThinking() {
    thinkingElement = document.createElement('div');
    thinkingElement.className = 'message bot thinking';
    thinkingElement.textContent = 'StepBot is thinking...';
    document.getElementById('chat').appendChild(thinkingElement);
    document.getElementById('chat').scrollTop = document.getElementById('chat').scrollHeight;
}

function hideThinking() {
    if (thinkingElement) {
        thinkingElement.remove();
        thinkingElement = null;
    }
}

function processMessage(message) {
    const matches = findMatches(message.toLowerCase());
    if (matches.length === 0) {
        addMessage('Sorry, I couldn\'t find relevant help. Try rephrasing your question.', 'bot');
        return;
    }
    showOptions(matches.slice(0, 6)); // up to 6
}

function findMatches(query) {
    const words = query.split(/\s+/);
    return helpData.filter(item => {
        return item.keys.some(key => words.some(word => key.includes(word) || word.includes(key)));
    });
}

function showOptions(options) {
    addMessage('Here are some related questions:', 'bot');
    const optionsDiv = document.createElement('div');
    optionsDiv.className = 'options';
    options.forEach(option => {
        const btn = document.createElement('button');
        btn.textContent = option.question;
        btn.className = 'option-btn';
        btn.onclick = () => {
            selectOption(option);
            optionsDiv.remove();
        };
        optionsDiv.appendChild(btn);
    });
    document.getElementById('chat').appendChild(optionsDiv);
}

function selectOption(option) {
    const ticket = generateTicket();
    currentState = { ...option, currentStep: 0, ticket };
    saveState();
    addMessage(`<div class="ticket">Your session ticket: <strong>${ticket}</strong><br>Please copy this ticket for later use.</div>`, 'bot');
    const pauseDiv = document.createElement('div');
    pauseDiv.className = 'options';
    const copiedBtn = document.createElement('button');
    copiedBtn.textContent = 'I have copied this';
    copiedBtn.className = 'option-btn';
    copiedBtn.onclick = () => {
        pauseDiv.remove();
        if (option.steps && option.steps.length > 0) {
            showMultiStep(option);
        } else {
            addMessage(option.answer, 'bot');
            currentState = null;
            saveState();
        }
    };
    pauseDiv.appendChild(copiedBtn);
    document.getElementById('chat').appendChild(pauseDiv);
}

function generateTicket() {
    return 'TICKET-' + Math.random().toString(36).substr(2, 9).toUpperCase();
}

function showMultiStep(option) {
    if (currentState.currentStep === 0) {
        addMessage(option.multiAnswer, 'bot');
    }
    const stepIndex = currentState.currentStep;
    if (stepIndex < option.steps.length) {
        addMessage(`Step ${stepIndex + 1} of ${option.steps.length}: ${option.steps[stepIndex]}`, 'bot');
        const buttonsDiv = document.createElement('div');
        buttonsDiv.className = 'options';
        const didBtn = document.createElement('button');
        didBtn.textContent = 'I did this';
        didBtn.className = 'step-btn';
        didBtn.onclick = () => {
            currentState.currentStep++;
            saveState();
            if (currentState.currentStep < option.steps.length) {
                showMultiStep(option);
            } else {
                addMessage('Great! You\'ve completed all steps.', 'bot');
                currentState = null;
                saveState();
            }
            buttonsDiv.remove();
        };
        const cantBtn = document.createElement('button');
        cantBtn.textContent = 'I can\'t do this';
        cantBtn.className = 'step-btn';
        cantBtn.onclick = () => {
            addMessage('Please try again or ask for more help.', 'bot');
            buttonsDiv.remove();
        };
        buttonsDiv.appendChild(didBtn);
        buttonsDiv.appendChild(cantBtn);
        document.getElementById('chat').appendChild(buttonsDiv);
    }
}

function addMessage(text, type) {
    const chat = document.getElementById('chat');
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = text; // Allow HTML
    chat.appendChild(msgDiv);
    chat.scrollTop = chat.scrollHeight;
}
