let helpItems = [];

async function loadHelp() {
    try {
        const response = await fetch('help.txt');
        const text = await response.text();
        helpItems = parseHelpText(text);
        displayItems();
    } catch (error) {
        console.error('Error loading help:', error);
        alert('Error loading help.txt. Make sure it exists.');
    }
}

function parseHelpText(text) {
    const blocks = text.split('\n\n').filter(block => block.trim());
    const data = [];
    blocks.forEach(block => {
        const lines = block.split('\n').map(line => line.trim());
        let item = { question: '', keys: '', answer: '', multiAnswer: '', steps: [] };
        lines.forEach(line => {
            if (line.startsWith('Question>:')) {
                item.question = line.substring(11).trim();
            } else if (line.startsWith('Key>:')) {
                item.keys = line.substring(6).trim();
            } else if (line.startsWith('Answer>:')) {
                item.answer = line.substring(8).trim();
            } else if (line.startsWith('Multi-Answer>:')) {
                item.multiAnswer = line.substring(14).trim();
            } else if (line.match(/^Step \d+ of \d+>:/)) {
                const stepText = line.split('>:')[1].trim();
                item.steps.push(stepText);
            }
        });
        data.push(item);
    });
    return data;
}

function displayItems() {
    const container = document.getElementById('items');
    container.innerHTML = '';
    helpItems.forEach((item, index) => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'item';
        itemDiv.innerHTML = `
            <label>Question:</label><input type="text" value="${item.question}" onchange="updateItem(${index}, 'question', this.value)">
            <label>Keys (comma separated):</label><input type="text" value="${item.keys}" onchange="updateItem(${index}, 'keys', this.value)">
            <label>Answer (leave empty for multi-step):</label><textarea onchange="updateItem(${index}, 'answer', this.value)">${item.answer}</textarea>
            <label>Multi-Answer (for multi-step):</label><textarea onchange="updateItem(${index}, 'multiAnswer', this.value)">${item.multiAnswer}</textarea>
            <label>Steps (one per line):</label><textarea onchange="updateSteps(${index}, this.value)">${item.steps.join('\n')}</textarea>
            <button class="delete-btn" onclick="deleteItem(${index})">Delete</button>
        `;
        container.appendChild(itemDiv);
    });
}

function updateItem(index, field, value) {
    helpItems[index][field] = value;
}

function updateSteps(index, value) {
    helpItems[index].steps = value.split('\n').map(s => s.trim()).filter(s => s);
}

function addItem() {
    helpItems.push({ question: '', keys: '', answer: '', multiAnswer: '', steps: [] });
    displayItems();
}

function deleteItem(index) {
    helpItems.splice(index, 1);
    displayItems();
}

function downloadHelp() {
    let text = '';
    helpItems.forEach(item => {
        if (item.question.trim()) {
            text += `Question>: ${item.question}\n`;
            text += `Key>: ${item.keys}\n`;
            if (item.answer.trim()) {
                text += `Answer>: ${item.answer}\n`;
            } else if (item.multiAnswer.trim() || item.steps.length > 0) {
                text += `Multi-Answer>: ${item.multiAnswer}\n`;
                item.steps.forEach((step, i) => {
                    text += `Step ${i + 1} of ${item.steps.length}>: ${step}\n`;
                });
            }
            text += '\n';
        }
    });
    const blob = new Blob([text], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'help.txt';
    a.click();
    URL.revokeObjectURL(url);
}
