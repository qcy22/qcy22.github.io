// 主程序入口点
const shell = document.getElementById('shell');
const input = document.getElementById('input');
const username = 'user@webshell:/home$ ';

let userInput = '';
let history = [];
let historyIndex = -1;

function renderInput() {
    const suggestion = getGhostSuggestion(userInput);
    input.innerHTML = `<span class="username">${username}</span>${escapeHTML(userInput)}<span class="ghost">${escapeHTML(suggestion)}</span>`;
    placeCursorAtEnd(input);
}

function getGhostSuggestion(current) {
    if (!current) return '';
    const possibilities = Object.keys(commands).filter(cmd => cmd.startsWith(current));
    if (possibilities.length === 1 && possibilities[0] !== current) {
        return possibilities[0].slice(current.length);
    }
    return '';
}

function placeCursorAtEnd(el) {
    const range = document.createRange();
    const sel = window.getSelection();
    range.selectNodeContents(el);
    range.collapse(false);
    sel.removeAllRanges();
    sel.addRange(range);
}

// 命令处理模块
const files = {};

function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;' }[tag]
    ));
}

const commands = {
    help: () => `<pre class="cmd-info">${help_text}</pre>`,

    ls: () => `<span class="cmd-file">${Object.keys(files).join('  ') || 'No files yet.'}</span>`,

    echo: (args) => `<span class="cmd-output">${args.join(' ')}</span>`,

    date: () => `<span class="cmd-info">${new Date().toString()}</span>`,

    whoami: () => '<span class="cmd-info">user</span>',

    clear: () => { shell.innerHTML = ''; return ''; },

    fortune: () => {
        const id = `fortune-${Date.now()}`;
        fetch('https://qcy-test.deno.dev/quote')
            .then(res => res.json())
            .then(data => {
                console.log(data);
                const element = document.getElementById(id);
                if (element) {
                    let quote = escapeHTML(data.hitokoto);
                    let from = data.from_who || '佚名';
                    element.innerHTML = `${quote} <br><span style="color:#888">—— ${escapeHTML(from)}</span>`;
                }
            })
            .catch(err => {
                const element = document.getElementById(id);
                if (element) {
                    element.innerHTML = 'Failed to fetch quote 😢';
                }
            });

        return `<span class="cmd-info" id="${id}">Loading quote...</span>`;
    },

    math: (args) => {
        try {
            return `<span class="cmd-output">${eval(args.join(' ')).toString()}</span>`;
        } catch {
            return '<span class="cmd-error">Invalid math expression</span>';
        }
    },

    cd: (args) => `<span class="cmd-info">Changed directory to ${args[0] || '~'}</span>`,

    weather: () => "<span class=\"cmd-info\">It's always sunny in the shell 🌞</span>",

    ascii: (args) => {
        const key = args[0] || 'cow'; // 默认是 cow
        const art = asciiArt[key];
        if (art) {
            return `<pre class="cmd-ascii">${art}</pre>`;
        } else {
            return `<span class="cmd-error">No such ascii art: ${key}</span>`;
        }
    },

    touch: (args) => {
        if (!args[0]) return '<span class="cmd-error">Usage: touch [filename]</span>';
        files[args[0]] = '';
        return `<span class="cmd-info">Created file: ${args[0]}</span>`;
    },

    cat: (args) => {
        if (!args[0]) return '<span class="cmd-error">Usage: cat [filename]</span>';
        return files[args[0]] ? `<span class="cmd-output">${files[args[0]]}</span>` : `<span class="cmd-error">No such file: ${args[0]}</span>`;
    },

    vim: (args) => {
        if (!args[0]) return '<span class="cmd-error">Usage: vim [filename]</span>';
        let content = prompt(`Enter content for ${args[0]}:`);
        if (content !== null) {
            files[args[0]] = content;
            return `<span class="cmd-info">Edited file: ${args[0]}</span>`;
        }
        return '<span class="cmd-info">Edit cancelled</span>';
    },

    theme: (args) => {
        const theme = args[0];
        if (theme === 'light') {
            document.body.style.backgroundColor = '#fff';
            document.body.style.color = '#000';
            input.style.color = '#000';
            shell.style.backgroundColor = '#eee';
            shell.style.borderColor = '#000';
            return '<span class="cmd-info">Switched to light theme</span>';
        } else {
            document.body.style.backgroundColor = '#111';
            document.body.style.color = '#0f0';
            input.style.color = '#0f0';
            shell.style.backgroundColor = '#000';
            shell.style.borderColor = '#0f0';
            return '<span class="cmd-info">Switched to dark theme</span>';
        }
    },

    donut: (args) => {
        let duration = parseInt(args[0]);
        if (isNaN(duration) || duration <= 0) duration = 5;
        startDonutAnimation(duration);
        return `<span class="cmd-info">Rendering rotating donut for ${duration} second(s)... 🍩</span>`;
    },

    img: (args) => {
        const filename = args[0];
        if (!filename) return '<span class="cmd-error">Usage: img [filename]</span>';
        if (!imageStore[filename]) return `<span class="cmd-error">No such image: ${filename}</span>`;
        return `<div style="line-height: 0.6; font-family: monospace;">${imageStore[filename]}</div>`;
    },
};

function executeCommand(cmd) {
    if (!cmd.trim()) return;
    history.push(cmd);
    historyIndex = history.length;
    const args = cmd.trim().split(' ');
    const commandName = args.shift();

    // Special handling for 'clear' command
    if (commandName === 'clear') {
        shell.innerHTML = ''; // Clear the shell content directly
        userInput = ''; // Reset user input
        renderInput(); // Re-render the input prompt area
        return; // Exit early
    }

    // --- Append Command Line ---
    const commandLineDiv = document.createElement('div');
    const userSpan = document.createElement('span');
    userSpan.className = 'username';
    userSpan.textContent = username;
    commandLineDiv.appendChild(userSpan);
    // Append the actual command text safely using createTextNode
    commandLineDiv.appendChild(document.createTextNode(cmd));
    shell.appendChild(commandLineDiv);

    // --- Execute Command and Get Output HTML ---
    let outputHtml = '';
    if (commands[commandName]) {
        outputHtml = commands[commandName](args);
    } else {
        outputHtml = `<span class="cmd-error">Command not found: ${commandName}</span>`;
    }

    // --- Append Output Line (if any) ---
    if (outputHtml) {
        const outputLineDiv = document.createElement('div');
        outputLineDiv.innerHTML = outputHtml;
        shell.appendChild(outputLineDiv);
    }

    // --- Append Spacer ---
    if (commandName !== 'donut') {
        const spacerDiv = document.createElement('div');
        spacerDiv.style.marginBottom = '15px';
        shell.appendChild(spacerDiv);
    }

    // --- Scroll ---
    shell.scrollTop = shell.scrollHeight;
}

input.addEventListener('keydown', function (event) {
    if (event.key === 'Enter') {
        event.preventDefault();
        executeCommand(userInput);
        userInput = '';
        renderInput();
    } else if (event.key === 'Backspace') {
        event.preventDefault();
        userInput = userInput.slice(0, -1);
        renderInput();
    } else if (event.key === 'ArrowUp') {
        if (historyIndex > 0) {
            historyIndex--;
            userInput = history[historyIndex];
        }
        renderInput();
        event.preventDefault();
    } else if (event.key === 'ArrowDown') {
        if (historyIndex < history.length - 1) {
            historyIndex++;
            userInput = history[historyIndex];
        } else {
            historyIndex = history.length;
            userInput = '';
        }
        renderInput();
        event.preventDefault();
    } else if (event.key === 'ArrowRight') {
        const suggestion = getGhostSuggestion(userInput);
        if (suggestion) {
            event.preventDefault();
            userInput += suggestion + ' ';
            renderInput();
        }
    } else if (event.key.length === 1 && !event.ctrlKey && !event.metaKey) {
        event.preventDefault();
        userInput += event.key;
        renderInput();
    }
});

// 初始化
renderInput();