// Load theme.css if exists
async function loadTheme() {
    const path = window.location.pathname;
    const segments = path.split('/').filter(s => s);
    const basePath = segments.length > 1 ? '/' + segments.slice(0, -1).join('/') : '';
    const themeUrl = basePath + '/theme.css';
    try {
        const response = await fetch(themeUrl);
        if (response.ok) {
            const css = await response.text();
            const style = document.createElement('style');
            style.textContent = css;
            document.head.appendChild(style);
            applyThemeVariables(css);
        }
    } catch (error) {
        console.log('No custom theme found, using default');
    }
}

function applyThemeVariables(css) {
    const root = document.documentElement;
    const matches = css.match(/--[^:]+:\s*[^;]+/g);
    if (matches) {
        matches.forEach(match => {
            const [prop, value] = match.split(':').map(s => s.trim());
            root.style.setProperty(prop, value);
        });
    }
    // Update title and logo if defined
    const titleMatch = css.match(/--title:\s*"([^"]+)"/);
    if (titleMatch) {
        document.title = titleMatch[1];
        const h1 = document.querySelector('h1');
        if (h1) h1.textContent = titleMatch[1];
    }
    const logoMatch = css.match(/--logo:\s*"([^"]+)"/);
    if (logoMatch && logoMatch[1]) {
        // Add logo to header or somewhere
        const logoImg = document.createElement('img');
        logoImg.src = logoMatch[1];
        logoImg.style.maxHeight = '50px';
        logoImg.style.marginLeft = '10px';
        const h1 = document.querySelector('h1');
        if (h1) h1.appendChild(logoImg);
    }
}

loadTheme();
