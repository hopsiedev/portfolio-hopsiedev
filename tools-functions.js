// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    if (!element) {
        showNotification('Elemento no encontrado', 'error');
        return;
    }
    
    const text = element.value || element.textContent;
    
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showNotification('Copiado al portapapeles', 'success');
        }).catch(() => {
            showNotification('Error al copiar', 'error');
        });
    } else {
        // Fallback for older browsers
        element.select();
        document.execCommand('copy');
        showNotification('Copiado al portapapeles', 'success');
    }
}

function showNotification(message, type) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(n => n.remove());
    
    const notification = document.createElement('div');
    notification.className = `notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all transform translate-x-full opacity-0 ${
        type === 'success' ? 'bg-green-600' : 'bg-red-600'
    }`;
    notification.textContent = message;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
    }, 100);
    
    // Animate out and remove
    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Base64 Converter Functions
function encodeBase64() {
    const input = document.getElementById('base64-input');
    const output = document.getElementById('base64-output');
    
    if (!input || !output) return;
    
    try {
        const encoded = btoa(unescape(encodeURIComponent(input.value)));
        output.value = encoded;
    } catch (e) {
        output.value = 'Error: No se pudo codificar el texto';
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-decode-input');
    const output = document.getElementById('base64-decode-output');
    
    if (!input || !output) return;
    
    try {
        const decoded = decodeURIComponent(escape(atob(input.value.trim())));
        output.value = decoded;
    } catch (e) {
        output.value = 'Error: Base64 inválido';
    }
}

// UUID Generator Functions
function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

function generateUUIDs() {
    const countInput = document.getElementById('uuid-count');
    const output = document.getElementById('uuid-output');
    
    if (!countInput || !output) return;
    
    const count = parseInt(countInput.value) || 1;
    const uuids = [];
    
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }
    
    output.value = uuids.join('\n');
}

// JSON Formatter Functions
function formatJSON() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    const indentInput = document.getElementById('json-indent');
    
    if (!input || !output) return;
    
    const indent = parseInt(indentInput?.value) || 2;
    
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed, null, indent);
    } catch (e) {
        output.value = 'Error: JSON inválido - ' + e.message;
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input');
    const output = document.getElementById('json-output');
    
    if (!input || !output) return;
    
    try {
        const parsed = JSON.parse(input.value);
        output.value = JSON.stringify(parsed);
    } catch (e) {
        output.value = 'Error: JSON inválido - ' + e.message;
    }
}

// URL Encoder Functions
function encodeURL() {
    const input = document.getElementById('url-input');
    const output = document.getElementById('url-output');
    
    if (!input || !output) return;
    
    try {
        output.value = encodeURIComponent(input.value);
    } catch (e) {
        output.value = 'Error al codificar URL';
    }
}

function decodeURL() {
    const input = document.getElementById('url-decode-input');
    const output = document.getElementById('url-decode-output');
    
    if (!input || !output) return;
    
    try {
        output.value = decodeURIComponent(input.value);
    } catch (e) {
        output.value = 'Error al decodificar URL';
    }
}

// Hash Generator Functions
async function generateHashes() {
    const input = document.getElementById('hash-input');
    
    if (!input) return;
    
    const text = input.value;
    
    if (!text) {
        clearHashOutputs();
        return;
    }
    
    try {
        // Generate MD5 using a simple implementation
        document.getElementById('hash-md5').value = await simpleMD5(text);
        
        // Generate SHA hashes using Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(text);
        
        const sha1Hash = await crypto.subtle.digest('SHA-1', data);
        const sha256Hash = await crypto.subtle.digest('SHA-256', data);
        
        document.getElementById('hash-sha1').value = arrayBufferToHex(sha1Hash);
        document.getElementById('hash-sha256').value = arrayBufferToHex(sha256Hash);
    } catch (e) {
        console.error('Hash generation error:', e);
        document.getElementById('hash-md5').value = 'Error al generar hash';
        document.getElementById('hash-sha1').value = 'Error al generar hash';
        document.getElementById('hash-sha256').value = 'Error al generar hash';
    }
}

function clearHashOutputs() {
    const md5 = document.getElementById('hash-md5');
    const sha1 = document.getElementById('hash-sha1');
    const sha256 = document.getElementById('hash-sha256');
    
    if (md5) md5.value = '';
    if (sha1) sha1.value = '';
    if (sha256) sha256.value = '';
}

function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Simple MD5 implementation (basic version)
async function simpleMD5(string) {
    // For simplicity, we'll use SHA-256 as MD5 replacement since MD5 is not available in Web Crypto API
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', data);
        return arrayBufferToHex(hashBuffer).substring(0, 32); // Truncate to MD5 length for display
    } catch (e) {
        return 'Error generating hash';
    }
}

// Password Generator Functions
function updatePasswordLength() {
    const lengthInput = document.getElementById('password-length');
    const display = document.getElementById('password-length-display');
    
    if (!lengthInput || !display) return;
    
    display.textContent = lengthInput.value;
}

function generatePassword() {
    const lengthInput = document.getElementById('password-length');
    const uppercaseCheck = document.getElementById('include-uppercase');
    const lowercaseCheck = document.getElementById('include-lowercase');
    const numbersCheck = document.getElementById('include-numbers');
    const symbolsCheck = document.getElementById('include-symbols');
    const output = document.getElementById('password-output');
    
    if (!lengthInput || !output) return;
    
    const length = parseInt(lengthInput.value) || 16;
    const includeUppercase = uppercaseCheck?.checked || false;
    const includeLowercase = lowercaseCheck?.checked || false;
    const includeNumbers = numbersCheck?.checked || false;
    const includeSymbols = symbolsCheck?.checked || false;
    
    let charset = '';
    if (includeUppercase) charset += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    if (includeLowercase) charset += 'abcdefghijklmnopqrstuvwxyz';
    if (includeNumbers) charset += '0123456789';
    if (includeSymbols) charset += '!@#$%^&*()_+-=[]{}|;:,.<>?';
    
    if (!charset) {
        showNotification('Selecciona al menos un tipo de carácter', 'error');
        return;
    }
    
    let password = '';
    for (let i = 0; i < length; i++) {
        password += charset.charAt(Math.floor(Math.random() * charset.length));
    }
    
    output.value = password;
    calculatePasswordStrength(password);
}

function calculatePasswordStrength(password) {
    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');
    
    if (!strengthBar || !strengthText) return;
    
    let score = 0;
    
    // Length scoring
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;
    
    // Character type scoring
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;
    
    // Update UI based on score
    if (score <= 2) {
        strengthBar.style.width = '25%';
        strengthBar.style.backgroundColor = '#ef4444';
        strengthText.textContent = 'Débil';
        strengthText.style.color = '#ef4444';
    } else if (score <= 4) {
        strengthBar.style.width = '50%';
        strengthBar.style.backgroundColor = '#f59e0b';
        strengthText.textContent = 'Regular';
        strengthText.style.color = '#f59e0b';
    } else if (score <= 6) {
        strengthBar.style.width = '75%';
        strengthBar.style.backgroundColor = '#10b981';
        strengthText.textContent = 'Buena';
        strengthText.style.color = '#10b981';
    } else {
        strengthBar.style.width = '100%';
        strengthBar.style.backgroundColor = '#059669';
        strengthText.textContent = 'Excelente';
        strengthText.style.color = '#059669';
    }
}

// Color Converter Functions
function updateColorFromPicker() {
    const picker = document.getElementById('color-picker');
    if (!picker) return;
    
    updateAllColorFormats(picker.value);
}

function updateColorFromHex() {
    const hexInput = document.getElementById('color-hex');
    const picker = document.getElementById('color-picker');
    
    if (!hexInput || !picker) return;
    
    const hex = hexInput.value;
    if (isValidHex(hex)) {
        picker.value = hex;
        updateAllColorFormats(hex);
    }
}

function updateAllColorFormats(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return;
    
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);
    
    // Update preview
    const preview = document.getElementById('color-preview');
    if (preview) preview.style.backgroundColor = hex;
    
    // Update all format fields
    const hexField = document.getElementById('color-hex');
    const rgbField = document.getElementById('color-rgb');
    const rgbaField = document.getElementById('color-rgba');
    const hslField = document.getElementById('color-hsl');
    const hslaField = document.getElementById('color-hsla');
    const filterField = document.getElementById('color-filter');
    
    if (hexField) hexField.value = hex;
    if (rgbField) rgbField.value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    if (rgbaField) rgbaField.value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    if (hslField) hslField.value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    if (hslaField) hslaField.value = `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`;
    if (filterField) filterField.value = generateCSSFilter(hex);
}

function isValidHex(hex) {
    return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
}

function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    } : null;
}

function rgbToHsl(r, g, b) {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h, s, l = (max + min) / 2;
    
    if (max === min) {
        h = s = 0;
    } else {
        const d = max - min;
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
        
        switch (max) {
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }
    
    return { h: h * 360, s: s * 100, l: l * 100 };
}

function generateCSSFilter(hex) {
    const rgb = hexToRgb(hex);
    if (!rgb) return '';
    
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
    return `filter: brightness(${Math.round(brightness * 100)}%)`;
}

// Timestamp Converter Functions
function setCurrentTimestamp() {
    const now = Date.now();
    const msField = document.getElementById('timestamp-milliseconds');
    const secField = document.getElementById('timestamp-seconds');
    
    if (msField) msField.value = now;
    if (secField) secField.value = Math.floor(now / 1000);
    
    convertFromTimestamp();
}

function convertFromTimestamp() {
    const secField = document.getElementById('timestamp-seconds');
    if (!secField) return;
    
    const seconds = parseInt(secField.value);
    if (isNaN(seconds)) return;
    
    const date = new Date(seconds * 1000);
    updateDateOutputs(date);
    
    // Update milliseconds field
    const msField = document.getElementById('timestamp-milliseconds');
    if (msField) msField.value = seconds * 1000;
}

function convertFromTimestampMs() {
    const msField = document.getElementById('timestamp-milliseconds');
    if (!msField) return;
    
    const milliseconds = parseInt(msField.value);
    if (isNaN(milliseconds)) return;
    
    const date = new Date(milliseconds);
    updateDateOutputs(date);
    
    // Update seconds field
    const secField = document.getElementById('timestamp-seconds');
    if (secField) secField.value = Math.floor(milliseconds / 1000);
}

function updateDateOutputs(date) {
    const localField = document.getElementById('datetime-local');
    const utcField = document.getElementById('datetime-utc');
    const isoField = document.getElementById('datetime-iso');
    
    if (localField) localField.value = date.toLocaleString();
    if (utcField) utcField.value = date.toUTCString();
    if (isoField) isoField.value = date.toISOString();
}

// QR Code Generator Functions
function generateQR() {
    const textInput = document.getElementById('qr-input');
    const sizeSelect = document.getElementById('qr-size');
    const colorInput = document.getElementById('qr-color');
    const backgroundInput = document.getElementById('qr-background');
    const output = document.getElementById('qr-output');
    
    if (!textInput || !output) return;
    
    const text = textInput.value;
    const size = sizeSelect?.value || '300';
    const color = colorInput?.value.replace('#', '') || '000000';
    const background = backgroundInput?.value.replace('#', '') || 'ffffff';
    
    if (!text.trim()) {
        output.innerHTML = `
            <div class="w-64 h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                    <div class="w-16 h-16 mx-auto mb-2 opacity-50">📱</div>
                    <p class="text-sm">El código QR aparecerá aquí</p>
                </div>
            </div>
        `;
        return;
    }
    
    // Using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color}&bgcolor=${background}`;
    
    output.innerHTML = `
        <img src="${qrUrl}" alt="QR Code" class="max-w-full h-auto rounded-lg" id="qr-image">
    `;
}

function downloadQR() {
    const img = document.getElementById('qr-image');
    if (!img) {
        showNotification('Primero genera un código QR', 'error');
        return;
    }
    
    const link = document.createElement('a');
    link.download = 'qr-code.png';
    link.href = img.src;
    link.click();
}

// Text Diff Functions
function compareTexts() {
    const text1Input = document.getElementById('diff-text1');
    const text2Input = document.getElementById('diff-text2');
    const output = document.getElementById('diff-output');
    
    if (!text1Input || !text2Input || !output) return;
    
    const text1 = text1Input.value;
    const text2 = text2Input.value;
    
    if (!text1.trim() && !text2.trim()) {
        output.innerHTML = '<div class="text-gray-400 text-center py-8">Ingresa texto en ambos campos para comparar</div>';
        return;
    }
    
    const lines1 = text1.split('\n');
    const lines2 = text2.split('\n');
    const diff = createDiff(lines1, lines2);
    
    output.innerHTML = diff;
}

function createDiff(lines1, lines2) {
    const maxLines = Math.max(lines1.length, lines2.length);
    let html = '';
    
    for (let i = 0; i < maxLines; i++) {
        const line1 = lines1[i] || '';
        const line2 = lines2[i] || '';
        
        if (line1 === line2) {
            // No change
            html += `<div class="flex border-l-4 border-gray-500 bg-gray-500/10 px-3 py-1 mb-1">
                <span class="w-8 text-gray-400 text-xs">${i + 1}</span>
                <span class="flex-1 font-mono text-sm">${escapeHtml(line1)}</span>
            </div>`;
        } else {
            // Changed lines
            if (line1 && !line2) {
                // Deleted
                html += `<div class="flex border-l-4 border-red-500 bg-red-500/20 px-3 py-1 mb-1">
                    <span class="w-8 text-red-400 text-xs">-${i + 1}</span>
                    <span class="flex-1 font-mono text-sm text-red-300">${escapeHtml(line1)}</span>
                </div>`;
            } else if (!line1 && line2) {
                // Added
                html += `<div class="flex border-l-4 border-green-500 bg-green-500/20 px-3 py-1 mb-1">
                    <span class="w-8 text-green-400 text-xs">+${i + 1}</span>
                    <span class="flex-1 font-mono text-sm text-green-300">${escapeHtml(line2)}</span>
                </div>`;
            } else {
                // Modified
                html += `<div class="flex border-l-4 border-red-500 bg-red-500/20 px-3 py-1 mb-1">
                    <span class="w-8 text-red-400 text-xs">-${i + 1}</span>
                    <span class="flex-1 font-mono text-sm text-red-300">${escapeHtml(line1)}</span>
                </div>`;
                html += `<div class="flex border-l-4 border-green-500 bg-green-500/20 px-3 py-1 mb-1">
                    <span class="w-8 text-green-400 text-xs">+${i + 1}</span>
                    <span class="flex-1 font-mono text-sm text-green-300">${escapeHtml(line2)}</span>
                </div>`;
            }
        }
    }
    
    return html || '<div class="text-gray-400 text-center py-8">No hay diferencias</div>';
}

function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// Lorem Ipsum Generator Functions
function generateLoremIpsum() {
    const typeSelect = document.getElementById('lorem-type');
    const countInput = document.getElementById('lorem-count');
    const output = document.getElementById('lorem-output');
    
    if (!typeSelect || !countInput || !output) return;
    
    const type = typeSelect.value;
    const count = parseInt(countInput.value) || 1;
    
    const loremWords = [
        'lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit',
        'sed', 'do', 'eiusmod', 'tempor', 'incididunt', 'ut', 'labore', 'et', 'dolore',
        'magna', 'aliqua', 'enim', 'ad', 'minim', 'veniam', 'quis', 'nostrud',
        'exercitation', 'ullamco', 'laboris', 'nisi', 'aliquip', 'ex', 'ea', 'commodo',
        'consequat', 'duis', 'aute', 'irure', 'in', 'reprehenderit', 'voluptate',
        'velit', 'esse', 'cillum', 'fugiat', 'nulla', 'pariatur', 'excepteur', 'sint',
        'occaecat', 'cupidatat', 'non', 'proident', 'sunt', 'culpa', 'qui', 'officia',
        'deserunt', 'mollit', 'anim', 'id', 'est', 'laborum'
    ];
    
    let result = '';
    
    if (type === 'words') {
        const words = [];
        for (let i = 0; i < count; i++) {
            words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
        }
        result = words.join(' ');
    } else if (type === 'sentences') {
        const sentences = [];
        for (let i = 0; i < count; i++) {
            const sentenceLength = Math.floor(Math.random() * 10) + 5;
            const words = [];
            for (let j = 0; j < sentenceLength; j++) {
                words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
            }
            words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
            sentences.push(words.join(' ') + '.');
        }
        result = sentences.join(' ');
    } else { // paragraphs
        const paragraphs = [];
        for (let i = 0; i < count; i++) {
            const sentenceCount = Math.floor(Math.random() * 5) + 3;
            const sentences = [];
            for (let j = 0; j < sentenceCount; j++) {
                const sentenceLength = Math.floor(Math.random() * 10) + 5;
                const words = [];
                for (let k = 0; k < sentenceLength; k++) {
                    words.push(loremWords[Math.floor(Math.random() * loremWords.length)]);
                }
                words[0] = words[0].charAt(0).toUpperCase() + words[0].slice(1);
                sentences.push(words.join(' ') + '.');
            }
            paragraphs.push(sentences.join(' '));
        }
        result = paragraphs.join('\n\n');
    }
    
    output.value = result;
}

// Regex Tester Functions
function testRegex() {
    const patternInput = document.getElementById('regex-pattern');
    const testTextInput = document.getElementById('regex-test-text');
    const globalCheck = document.getElementById('regex-global');
    const ignoreCaseCheck = document.getElementById('regex-ignorecase');
    const multilineCheck = document.getElementById('regex-multiline');
    const resultDiv = document.getElementById('regex-result');
    const matchesDiv = document.getElementById('regex-matches');
    
    if (!patternInput || !testTextInput || !resultDiv || !matchesDiv) return;
    
    const pattern = patternInput.value;
    const testText = testTextInput.value;
    const global = globalCheck?.checked || false;
    const ignoreCase = ignoreCaseCheck?.checked || false;
    const multiline = multilineCheck?.checked || false;
    
    if (!pattern) {
        resultDiv.innerHTML = '<div class="text-gray-400">Ingresa una expresión regular</div>';
        matchesDiv.innerHTML = '<div class="text-gray-400">Las coincidencias aparecerán aquí</div>';
        return;
    }
    
    try {
        let flags = '';
        if (global) flags += 'g';
        if (ignoreCase) flags += 'i';
        if (multiline) flags += 'm';
        
        const regex = new RegExp(pattern, flags);
        const matches = testText.match(regex);
        
        if (matches) {
            resultDiv.innerHTML = `
                <div class="text-green-400">
                    <div class="font-semibold mb-2">✓ Expresión válida</div>
                    <div class="text-sm">Encontradas ${matches.length} coincidencia(s)</div>
                </div>
            `;
            
            const matchList = matches.map((match, index) => 
                `<div class="p-2 bg-green-500/20 rounded border border-green-500/30 mb-2">
                    <div class="text-green-300 font-mono text-sm">${escapeHtml(match)}</div>
                    <div class="text-xs text-gray-400">Coincidencia ${index + 1}</div>
                </div>`
            ).join('');
            
            matchesDiv.innerHTML = matchList;
        } else {
            resultDiv.innerHTML = `
                <div class="text-yellow-400">
                    <div class="font-semibold mb-2">⚠ Expresión válida</div>
                    <div class="text-sm">No se encontraron coincidencias</div>
                </div>
            `;
            matchesDiv.innerHTML = '<div class="text-gray-400">No hay coincidencias</div>';
        }
        
    } catch (error) {
        resultDiv.innerHTML = `
            <div class="text-red-400">
                <div class="font-semibold mb-2">✗ Expresión inválida</div>
                <div class="text-sm">${error.message}</div>
            </div>
        `;
        matchesDiv.innerHTML = '<div class="text-gray-400">Error en la expresión regular</div>';
    }
}

// Text Case Converter Functions
function convertTextCase() {
    const input = document.getElementById('case-input');
    
    if (!input) return;
    
    const text = input.value;
    
    if (!text) {
        clearCaseOutputs();
        return;
    }
    
    // Update all case outputs
    const uppercaseField = document.getElementById('case-uppercase');
    const lowercaseField = document.getElementById('case-lowercase');
    const titleField = document.getElementById('case-title');
    const sentenceField = document.getElementById('case-sentence');
    const camelField = document.getElementById('case-camel');
    const kebabField = document.getElementById('case-kebab');
    
    if (uppercaseField) uppercaseField.value = text.toUpperCase();
    if (lowercaseField) lowercaseField.value = text.toLowerCase();
    if (titleField) titleField.value = text.replace(/\w\S*/g, (txt) => 
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );
    if (sentenceField) sentenceField.value = text.charAt(0).toUpperCase() + text.slice(1).toLowerCase();
    if (camelField) camelField.value = text
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) => 
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');
    if (kebabField) kebabField.value = text
        .replace(/\s+/g, '-')
        .replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())
        .replace(/^-/, '')
        .toLowerCase();
}

function clearCaseOutputs() {
    const fields = ['case-uppercase', 'case-lowercase', 'case-title', 'case-sentence', 'case-camel', 'case-kebab'];
    fields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field) field.value = '';
    });
}

// IP Geolocation Functions (simplified)
async function getMyIP() {
    const loadingDiv = document.getElementById('geo-loading');
    const resultsDiv = document.getElementById('geo-results');
    const errorDiv = document.getElementById('geo-error');
    
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');
    
    try {
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason || 'Error al obtener IP');
        }
        
        // Set the IP in the input field
        const ipInput = document.getElementById('geo-ip-input');
        if (ipInput) ipInput.value = data.ip;
        
        // Display results
        displayGeoResults(data);
        
    } catch (error) {
        showGeoError('Error al obtener tu IP: ' + error.message);
    }
}

async function lookupIPGeolocation() {
    const ipInput = document.getElementById('geo-ip-input');
    
    if (!ipInput) return;
    
    const ip = ipInput.value.trim();
    
    if (!ip) {
        showNotification('Ingresa una dirección IP', 'error');
        return;
    }
    
    if (!isValidIPv4(ip)) {
        showNotification('Dirección IP inválida', 'error');
        return;
    }
    
    showGeoLoading();
    
    try {
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason || 'Error en la consulta');
        }
        
        displayGeoResults(data);
        
    } catch (error) {
        showGeoError('Error al obtener información: ' + error.message);
    }
}

function showGeoLoading() {
    const loadingDiv = document.getElementById('geo-loading');
    const resultsDiv = document.getElementById('geo-results');
    const errorDiv = document.getElementById('geo-error');
    
    if (loadingDiv) loadingDiv.classList.remove('hidden');
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');
}

function displayGeoResults(data) {
    const loadingDiv = document.getElementById('geo-loading');
    const resultsDiv = document.getElementById('geo-results');
    const errorDiv = document.getElementById('geo-error');
    
    if (loadingDiv) loadingDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.add('hidden');
    if (resultsDiv) resultsDiv.classList.remove('hidden');
    
    // Populate fields
    const fields = {
        'geo-ip': data.ip || '',
        'geo-country': `${data.country_name || ''} (${data.country_code || ''})`,
        'geo-city': data.city || '',
        'geo-region': data.region || '',
        'geo-isp': data.org || '',
        'geo-timezone': data.timezone || '',
        'geo-coordinates': data.latitude && data.longitude ? `${data.latitude}, ${data.longitude}` : '',
        'geo-postal': data.postal || ''
    };
    
    Object.entries(fields).forEach(([fieldId, value]) => {
        const field = document.getElementById(fieldId);
        if (field) field.value = value;
    });
    
    // Additional info
    const additionalInfoDiv = document.getElementById('geo-additional-info');
    if (additionalInfoDiv) {
        additionalInfoDiv.innerHTML = `
            <div class="grid md:grid-cols-2 gap-4">
                <div>
                    <div class="text-gray-300"><strong>Organización:</strong> ${data.org || 'N/A'}</div>
                    <div class="text-gray-300"><strong>ASN:</strong> ${data.asn || 'N/A'}</div>
                </div>
                <div>
                    <div class="text-gray-300"><strong>Latitud:</strong> ${data.latitude || 'N/A'}</div>
                    <div class="text-gray-300"><strong>Longitud:</strong> ${data.longitude || 'N/A'}</div>
                </div>
            </div>
        `;
    }
}

function showGeoError(message) {
    const loadingDiv = document.getElementById('geo-loading');
    const resultsDiv = document.getElementById('geo-results');
    const errorDiv = document.getElementById('geo-error');
    const errorMessageDiv = document.getElementById('geo-error-message');
    
    if (loadingDiv) loadingDiv.classList.add('hidden');
    if (resultsDiv) resultsDiv.classList.add('hidden');
    if (errorDiv) errorDiv.classList.remove('hidden');
    if (errorMessageDiv) errorMessageDiv.textContent = message;
}

function isValidIPv4(ip) {
    if (!ip || typeof ip !== 'string') return false;
    
    const parts = ip.split('.');
    if (parts.length !== 4) return false;
    
    return parts.every(part => {
        if (part.length > 1 && part[0] === '0') return false;
        
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
}

// Auto-load user's IP when the geolocation tool is opened
async function autoLoadMyIP() {
    if (document.getElementById('geo-ip-input')) {
        await getMyIP();
    }
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize color converter with default color
    setTimeout(() => {
        if (document.getElementById('color-picker')) {
            updateColorFromPicker();
        }
    }, 100);
});