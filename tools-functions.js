// Base64 Converter Functions
function encodeBase64() {
    const input = document.getElementById('base64-input').value;
    const output = document.getElementById('base64-output');

    try {
        // Modern approach using TextEncoder
        const encoder = new TextEncoder();
        const data = encoder.encode(input);
        output.value = btoa(String.fromCharCode(...data));
    } catch (e) {
        output.value = 'Error: No se pudo codificar el texto';
    }
}

function decodeBase64() {
    const input = document.getElementById('base64-decode-input').value.trim();
    const output = document.getElementById('base64-decode-output');

    try {
        // Modern approach using TextDecoder
        const binaryString = atob(input);
        const bytes = new Uint8Array(binaryString.length);
        for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const decoder = new TextDecoder();
        output.value = decoder.decode(bytes);
    } catch (e) {
        output.value = 'Error: Base64 inválido';
    }
}

// UUID Generator Functions
function generateUUIDs() {
    const count = parseInt(document.getElementById('uuid-count').value) || 1;
    const output = document.getElementById('uuid-output');

    const uuids = [];
    for (let i = 0; i < count; i++) {
        uuids.push(generateUUID());
    }

    output.value = uuids.join('\n');
}

function generateUUID() {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        const r = Math.random() * 16 | 0;
        const v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

// JSON Formatter Functions
function formatJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');
    const indent = parseInt(document.getElementById('json-indent').value) || 2;

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed, null, indent);
    } catch (e) {
        output.value = 'Error: JSON inválido - ' + e.message;
    }
}

function minifyJSON() {
    const input = document.getElementById('json-input').value;
    const output = document.getElementById('json-output');

    try {
        const parsed = JSON.parse(input);
        output.value = JSON.stringify(parsed);
    } catch (e) {
        output.value = 'Error: JSON inválido - ' + e.message;
    }
}

// URL Encoder Functions
function encodeURL() {
    const input = document.getElementById('url-input').value;
    const output = document.getElementById('url-output');

    try {
        output.value = encodeURIComponent(input);
    } catch (e) {
        output.value = 'Error al codificar URL';
    }
}

function decodeURL() {
    const input = document.getElementById('url-decode-input').value;
    const output = document.getElementById('url-decode-output');

    try {
        output.value = decodeURIComponent(input);
    } catch (e) {
        output.value = 'Error al decodificar URL';
    }
}

// Hash Generator Functions
async function generateHashes() {
    const input = document.getElementById('hash-input').value;

    if (!input) {
        document.getElementById('hash-md5').value = '';
        document.getElementById('hash-sha1').value = '';
        document.getElementById('hash-sha256').value = '';
        return;
    }

    // MD5 (usando una implementación simple)
    document.getElementById('hash-md5').value = await md5(input);

    // SHA-1 y SHA-256 usando Web Crypto API
    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(input);

        const sha1Hash = await crypto.subtle.digest('SHA-1', data);
        const sha256Hash = await crypto.subtle.digest('SHA-256', data);

        document.getElementById('hash-sha1').value = arrayBufferToHex(sha1Hash);
        document.getElementById('hash-sha256').value = arrayBufferToHex(sha256Hash);
    } catch (e) {
        document.getElementById('hash-sha1').value = 'Error al generar hash';
        document.getElementById('hash-sha256').value = 'Error al generar hash';
    }
}

function arrayBufferToHex(buffer) {
    return Array.from(new Uint8Array(buffer))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('');
}

// Simple MD5 implementation (fallback to SHA-256 since MD5 is not available in Web Crypto API)
async function md5(string) {
    try {
        // MD5 is not available in Web Crypto API, so we'll use a simple implementation
        return simpleMD5(string);
    } catch (e) {
        // Fallback to SHA-256 if MD5 fails
        const utf8 = new TextEncoder().encode(string);
        const hashBuffer = await crypto.subtle.digest('SHA-256', utf8);
        const hashArray = Array.from(new Uint8Array(hashBuffer));
        return hashArray.map(bytes => bytes.toString(16).padStart(2, '0')).join('');
    }
}

// Simple MD5 implementation
function simpleMD5(string) {
    function md5cycle(x, k) {
        var a = x[0], b = x[1], c = x[2], d = x[3];
        a = ff(a, b, c, d, k[0], 7, -680876936);
        d = ff(d, a, b, c, k[1], 12, -389564586);
        c = ff(c, d, a, b, k[2], 17, 606105819);
        b = ff(b, c, d, a, k[3], 22, -1044525330);
        a = ff(a, b, c, d, k[4], 7, -176418897);
        d = ff(d, a, b, c, k[5], 12, 1200080426);
        c = ff(c, d, a, b, k[6], 17, -1473231341);
        b = ff(b, c, d, a, k[7], 22, -45705983);
        a = ff(a, b, c, d, k[8], 7, 1770035416);
        d = ff(d, a, b, c, k[9], 12, -1958414417);
        c = ff(c, d, a, b, k[10], 17, -42063);
        b = ff(b, c, d, a, k[11], 22, -1990404162);
        a = ff(a, b, c, d, k[12], 7, 1804603682);
        d = ff(d, a, b, c, k[13], 12, -40341101);
        c = ff(c, d, a, b, k[14], 17, -1502002290);
        b = ff(b, c, d, a, k[15], 22, 1236535329);
        a = gg(a, b, c, d, k[1], 5, -165796510);
        d = gg(d, a, b, c, k[6], 9, -1069501632);
        c = gg(c, d, a, b, k[11], 14, 643717713);
        b = gg(b, c, d, a, k[0], 20, -373897302);
        a = gg(a, b, c, d, k[5], 5, -701558691);
        d = gg(d, a, b, c, k[10], 9, 38016083);
        c = gg(c, d, a, b, k[15], 14, -660478335);
        b = gg(b, c, d, a, k[4], 20, -405537848);
        a = gg(a, b, c, d, k[9], 5, 568446438);
        d = gg(d, a, b, c, k[14], 9, -1019803690);
        c = gg(c, d, a, b, k[3], 14, -187363961);
        b = gg(b, c, d, a, k[8], 20, 1163531501);
        a = gg(a, b, c, d, k[13], 5, -1444681467);
        d = gg(d, a, b, c, k[2], 9, -51403784);
        c = gg(c, d, a, b, k[7], 14, 1735328473);
        b = gg(b, c, d, a, k[12], 20, -1926607734);
        a = hh(a, b, c, d, k[5], 4, -378558);
        d = hh(d, a, b, c, k[8], 11, -2022574463);
        c = hh(c, d, a, b, k[11], 16, 1839030562);
        b = hh(b, c, d, a, k[14], 23, -35309556);
        a = hh(a, b, c, d, k[1], 4, -1530992060);
        d = hh(d, a, b, c, k[4], 11, 1272893353);
        c = hh(c, d, a, b, k[7], 16, -155497632);
        b = hh(b, c, d, a, k[10], 23, -1094730640);
        a = hh(a, b, c, d, k[13], 4, 681279174);
        d = hh(d, a, b, c, k[0], 11, -358537222);
        c = hh(c, d, a, b, k[3], 16, -722521979);
        b = hh(b, c, d, a, k[6], 23, 76029189);
        a = hh(a, b, c, d, k[9], 4, -640364487);
        d = hh(d, a, b, c, k[12], 11, -421815835);
        c = hh(c, d, a, b, k[15], 16, 530742520);
        b = hh(b, c, d, a, k[2], 23, -995338651);
        a = ii(a, b, c, d, k[0], 6, -198630844);
        d = ii(d, a, b, c, k[7], 10, 1126891415);
        c = ii(c, d, a, b, k[14], 15, -1416354905);
        b = ii(b, c, d, a, k[5], 21, -57434055);
        a = ii(a, b, c, d, k[12], 6, 1700485571);
        d = ii(d, a, b, c, k[3], 10, -1894986606);
        c = ii(c, d, a, b, k[10], 15, -1051523);
        b = ii(b, c, d, a, k[1], 21, -2054922799);
        a = ii(a, b, c, d, k[8], 6, 1873313359);
        d = ii(d, a, b, c, k[15], 10, -30611744);
        c = ii(c, d, a, b, k[6], 15, -1560198380);
        b = ii(b, c, d, a, k[13], 21, 1309151649);
        a = ii(a, b, c, d, k[4], 6, -145523070);
        d = ii(d, a, b, c, k[11], 10, -1120210379);
        c = ii(c, d, a, b, k[2], 15, 718787259);
        b = ii(b, c, d, a, k[9], 21, -343485551);
        x[0] = add32(a, x[0]);
        x[1] = add32(b, x[1]);
        x[2] = add32(c, x[2]);
        x[3] = add32(d, x[3]);
    }

    function cmn(q, a, b, x, s, t) {
        a = add32(add32(a, q), add32(x, t));
        return add32((a << s) | (a >>> (32 - s)), b);
    }

    function ff(a, b, c, d, x, s, t) {
        return cmn((b & c) | ((~b) & d), a, b, x, s, t);
    }

    function gg(a, b, c, d, x, s, t) {
        return cmn((b & d) | (c & (~d)), a, b, x, s, t);
    }

    function hh(a, b, c, d, x, s, t) {
        return cmn(b ^ c ^ d, a, b, x, s, t);
    }

    function ii(a, b, c, d, x, s, t) {
        return cmn(c ^ (b | (~d)), a, b, x, s, t);
    }

    function md51(s) {
        var n = s.length,
            state = [1732584193, -271733879, -1732584194, 271733878], i;
        for (i = 64; i <= s.length; i += 64) {
            md5cycle(state, md5blk(s.substring(i - 64, i)));
        }
        s = s.substring(i - 64);
        var tail = [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
        for (i = 0; i < s.length; i++)
            tail[i >> 2] |= s.charCodeAt(i) << ((i % 4) << 3);
        tail[i >> 2] |= 0x80 << ((i % 4) << 3);
        if (i > 55) {
            md5cycle(state, tail);
            for (i = 0; i < 16; i++) tail[i] = 0;
        }
        tail[14] = n * 8;
        md5cycle(state, tail);
        return state;
    }

    function md5blk(s) {
        var md5blks = [], i;
        for (i = 0; i < 64; i += 4) {
            md5blks[i >> 2] = s.charCodeAt(i)
                + (s.charCodeAt(i + 1) << 8)
                + (s.charCodeAt(i + 2) << 16)
                + (s.charCodeAt(i + 3) << 24);
        }
        return md5blks;
    }

    var hex_chr = '0123456789abcdef'.split('');

    function rhex(n) {
        var s = '', j = 0;
        for (; j < 4; j++)
            s += hex_chr[(n >> (j * 8 + 4)) & 0x0F]
                + hex_chr[(n >> (j * 8)) & 0x0F];
        return s;
    }

    function hex(x) {
        for (var i = 0; i < x.length; i++)
            x[i] = rhex(x[i]);
        return x.join('');
    }

    function add32(a, b) {
        return (a + b) & 0xFFFFFFFF;
    }

    return hex(md51(string));
}

// Password Generator Functions
function updatePasswordLength() {
    const length = document.getElementById('password-length').value;
    document.getElementById('password-length-display').textContent = length;
}

function generatePassword() {
    const length = parseInt(document.getElementById('password-length').value);
    const includeUppercase = document.getElementById('include-uppercase').checked;
    const includeLowercase = document.getElementById('include-lowercase').checked;
    const includeNumbers = document.getElementById('include-numbers').checked;
    const includeSymbols = document.getElementById('include-symbols').checked;

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

    document.getElementById('password-output').value = password;
    calculatePasswordStrength(password);
}

function calculatePasswordStrength(password) {
    let score = 0;

    // Length
    if (password.length >= 8) score += 1;
    if (password.length >= 12) score += 1;
    if (password.length >= 16) score += 1;

    // Character types
    if (/[a-z]/.test(password)) score += 1;
    if (/[A-Z]/.test(password)) score += 1;
    if (/[0-9]/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password)) score += 1;

    const strengthBar = document.getElementById('strength-bar');
    const strengthText = document.getElementById('strength-text');

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
    const color = document.getElementById('color-picker').value;
    updateAllColorFormats(color);
}

function updateColorFromHex() {
    const hex = document.getElementById('color-hex').value;
    if (isValidHex(hex)) {
        document.getElementById('color-picker').value = hex;
        updateAllColorFormats(hex);
    }
}

function updateAllColorFormats(hex) {
    const rgb = hexToRgb(hex);
    const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

    document.getElementById('color-preview').style.backgroundColor = hex;
    document.getElementById('color-hex').value = hex;
    document.getElementById('color-rgb').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`;
    document.getElementById('color-rgba').value = `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`;
    document.getElementById('color-hsl').value = `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`;
    document.getElementById('color-hsla').value = `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`;

    // Generate CSS filter (approximation)
    const filter = generateCSSFilter(hex);
    document.getElementById('color-filter').value = filter;
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
    // This is a simplified approximation
    const rgb = hexToRgb(hex);
    const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
    return `filter: brightness(${Math.round(brightness * 100)}%)`;
}

// Timestamp Converter Functions
function setCurrentTimestamp() {
    const now = Date.now();
    document.getElementById('timestamp-milliseconds').value = now;
    document.getElementById('timestamp-seconds').value = Math.floor(now / 1000);
    convertFromTimestamp();
}

function convertFromTimestamp() {
    const seconds = parseInt(document.getElementById('timestamp-seconds').value);
    if (isNaN(seconds)) return;

    const date = new Date(seconds * 1000);
    updateDateOutputs(date);

    // Update milliseconds field
    document.getElementById('timestamp-milliseconds').value = seconds * 1000;
}

function convertFromTimestampMs() {
    const milliseconds = parseInt(document.getElementById('timestamp-milliseconds').value);
    if (isNaN(milliseconds)) return;

    const date = new Date(milliseconds);
    updateDateOutputs(date);

    // Update seconds field
    document.getElementById('timestamp-seconds').value = Math.floor(milliseconds / 1000);
}

function updateDateOutputs(date) {
    document.getElementById('datetime-local').value = date.toLocaleString();
    document.getElementById('datetime-utc').value = date.toUTCString();
    document.getElementById('datetime-iso').value = date.toISOString();
}

// QR Code Generator Functions
function generateQR() {
    const text = document.getElementById('qr-input').value;
    const size = document.getElementById('qr-size').value;
    const color = document.getElementById('qr-color').value.replace('#', '');
    const background = document.getElementById('qr-background').value.replace('#', '');

    if (!text.trim()) {
        document.getElementById('qr-output').innerHTML = `
            <div class="w-64 h-64 flex items-center justify-center text-gray-400">
                <div class="text-center">
                    <i data-lucide="qr-code" class="w-16 h-16 mx-auto mb-2 opacity-50"></i>
                    <p class="text-sm">El código QR aparecerá aquí</p>
                </div>
            </div>
        `;
        lucide.createIcons();
        return;
    }

    // Using QR Server API
    const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encodeURIComponent(text)}&color=${color}&bgcolor=${background}`;

    document.getElementById('qr-output').innerHTML = `
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

function copyQRToClipboard() {
    const img = document.getElementById('qr-image');
    if (!img) {
        showNotification('Primero genera un código QR', 'error');
        return;
    }

    // Create canvas and copy image
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    img.onload = function () {
        canvas.width = img.width;
        canvas.height = img.height;
        ctx.drawImage(img, 0, 0);

        canvas.toBlob(function (blob) {
            navigator.clipboard.write([
                new ClipboardItem({ 'image/png': blob })
            ]).then(() => {
                showNotification('Imagen copiada al portapapeles', 'success');
            }).catch(() => {
                showNotification('Error al copiar imagen', 'error');
            });
        });
    };

    if (img.complete) {
        img.onload();
    }
}

// Text Diff Functions
function compareTexts() {
    const text1 = document.getElementById('diff-text1').value;
    const text2 = document.getElementById('diff-text2').value;
    const output = document.getElementById('diff-output');

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

// Utility functions
function copyToClipboard(elementId) {
    const element = document.getElementById(elementId);
    const text = element.value || element.textContent;

    navigator.clipboard.writeText(text).then(() => {
        showNotification('Copiado al portapapeles', 'success');
    }).catch(() => {
        showNotification('Error al copiar', 'error');
    });
}

function showNotification(message, type) {
    const notification = document.createElement('div');
    notification.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all transform translate-x-full opacity-0 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
        }`;
    notification.textContent = message;

    document.body.appendChild(notification);

    setTimeout(() => {
        notification.classList.remove('translate-x-full', 'opacity-0');
    }, 100);

    setTimeout(() => {
        notification.classList.add('translate-x-full', 'opacity-0');
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

// Initialize color converter with default color
document.addEventListener('DOMContentLoaded', function () {
    setTimeout(() => {
        if (document.getElementById('color-picker')) {
            updateColorFromPicker();
        }
    }, 100);
});
// 
Lorem Ipsum Generator Functions
function generateLoremIpsum() {
    const type = document.getElementById('lorem-type').value;
    const count = parseInt(document.getElementById('lorem-count').value) || 1;
    const output = document.getElementById('lorem-output');

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
    const pattern = document.getElementById('regex-pattern').value;
    const testText = document.getElementById('regex-test-text').value;
    const global = document.getElementById('regex-global').checked;
    const ignoreCase = document.getElementById('regex-ignorecase').checked;
    const multiline = document.getElementById('regex-multiline').checked;

    const resultDiv = document.getElementById('regex-result');
    const matchesDiv = document.getElementById('regex-matches');

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

        // Highlight matches in the text
        if (matches && testText) {
            let highlightedText = testText;
            matches.forEach(match => {
                highlightedText = highlightedText.replace(
                    new RegExp(escapeRegExp(match), 'g'),
                    `<mark class="bg-yellow-400 text-black">${match}</mark>`
                );
            });

            resultDiv.innerHTML += `
                <div class="mt-4">
                    <div class="text-sm text-gray-300 mb-2">Texto con coincidencias resaltadas:</div>
                    <div class="p-3 bg-gray-800 rounded border font-mono text-sm whitespace-pre-wrap">${highlightedText}</div>
                </div>
            `;
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

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Text Case Converter Functions
function convertTextCase() {
    const input = document.getElementById('case-input').value;

    if (!input) {
        document.getElementById('case-uppercase').value = '';
        document.getElementById('case-lowercase').value = '';
        document.getElementById('case-title').value = '';
        document.getElementById('case-sentence').value = '';
        document.getElementById('case-camel').value = '';
        document.getElementById('case-kebab').value = '';
        return;
    }

    // Uppercase
    document.getElementById('case-uppercase').value = input.toUpperCase();

    // Lowercase
    document.getElementById('case-lowercase').value = input.toLowerCase();

    // Title Case
    document.getElementById('case-title').value = input.replace(/\w\S*/g, (txt) =>
        txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase()
    );

    // Sentence Case
    document.getElementById('case-sentence').value = input.charAt(0).toUpperCase() + input.slice(1).toLowerCase();

    // camelCase
    document.getElementById('case-camel').value = input
        .replace(/(?:^\w|[A-Z]|\b\w)/g, (word, index) =>
            index === 0 ? word.toLowerCase() : word.toUpperCase()
        )
        .replace(/\s+/g, '');

    // kebab-case
    document.getElementById('case-kebab').value = input
        .replace(/\s+/g, '-')
        .replace(/[A-Z]/g, (letter) => '-' + letter.toLowerCase())
        .replace(/^-/, '')
        .toLowerCase();
}// IP Ad
dress Converter Functions
function convertIP() {
    const input = document.getElementById('ip-input').value.trim();

    if (!input) {
        clearIPOutputs();
        return;
    }

    if (!isValidIPv4(input)) {
        clearIPOutputs();
        document.getElementById('ip-info').innerHTML = '<div class="text-red-400">Dirección IP inválida</div>';
        return;
    }

    const parts = input.split('.').map(part => parseInt(part));
    const decimal = (parts[0] << 24) + (parts[1] << 16) + (parts[2] << 8) + parts[3];

    // Convert to unsigned 32-bit integer
    const unsignedDecimal = decimal >>> 0;

    // Decimal
    document.getElementById('ip-decimal').value = unsignedDecimal;

    // Hexadecimal
    document.getElementById('ip-hex').value = '0x' + unsignedDecimal.toString(16).toUpperCase().padStart(8, '0');

    // Binary
    const binary = parts.map(part => part.toString(2).padStart(8, '0')).join('.');
    document.getElementById('ip-binary').value = binary;

    // Octal
    const octal = parts.map(part => part.toString(8).padStart(3, '0')).join('');
    document.getElementById('ip-octal').value = '0' + octal;

    // IP Info
    updateIPInfo(input, parts);
}

function clearIPOutputs() {
    document.getElementById('ip-decimal').value = '';
    document.getElementById('ip-hex').value = '';
    document.getElementById('ip-binary').value = '';
    document.getElementById('ip-octal').value = '';
    document.getElementById('ip-info').innerHTML = '<div class="text-gray-400">Ingresa una dirección IP válida para ver la información</div>';
}

function updateIPInfo(ip, parts) {
    const ipClass = getIPClass(parts[0]);
    const isPrivate = isPrivateIP(parts);
    const isLoopback = parts[0] === 127;
    const isMulticast = parts[0] >= 224 && parts[0] <= 239;

    const info = `
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <div class="text-gray-300"><strong>Clase:</strong> ${ipClass}</div>
                <div class="text-gray-300"><strong>Tipo:</strong> ${isPrivate ? 'Privada' : 'Pública'}</div>
                <div class="text-gray-300"><strong>Especial:</strong> ${isLoopback ? 'Loopback' : isMulticast ? 'Multicast' : 'Normal'}</div>
            </div>
            <div>
                <div class="text-gray-300"><strong>Octetos:</strong> ${parts.join(', ')}</div>
                <div class="text-gray-300"><strong>Formato:</strong> IPv4</div>
                <div class="text-gray-300"><strong>Válida:</strong> ✓ Sí</div>
            </div>
        </div>
    `;

    document.getElementById('ip-info').innerHTML = info;
}

function isValidIPv4(ip) {
    if (!ip || typeof ip !== 'string') return false;
    
    const parts = ip.split('.');
    if (parts.length !== 4) return false;

    return parts.every(part => {
        // Check for leading zeros (except for "0" itself)
        if (part.length > 1 && part[0] === '0') return false;
        
        const num = parseInt(part, 10);
        return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
    });
}

function getIPClass(firstOctet) {
    if (firstOctet >= 1 && firstOctet <= 126) return 'A';
    if (firstOctet >= 128 && firstOctet <= 191) return 'B';
    if (firstOctet >= 192 && firstOctet <= 223) return 'C';
    if (firstOctet >= 224 && firstOctet <= 239) return 'D (Multicast)';
    if (firstOctet >= 240 && firstOctet <= 255) return 'E (Experimental)';
    return 'Desconocida';
}

function isPrivateIP(parts) {
    const [a, b, c, d] = parts;

    // 10.0.0.0/8
    if (a === 10) return true;

    // 172.16.0.0/12
    if (a === 172 && b >= 16 && b <= 31) return true;

    // 192.168.0.0/16
    if (a === 192 && b === 168) return true;

    return false;
}

// Subnet Calculator Functions
function calculateSubnet() {
    const ip = document.getElementById('subnet-ip').value.trim();
    const mask = document.getElementById('subnet-mask').value.trim();

    if (!ip || !mask) {
        clearSubnetOutputs();
        return;
    }

    if (!isValidIPv4(ip)) {
        clearSubnetOutputs();
        document.getElementById('subnet-info').innerHTML = '<div class="text-red-400">Dirección IP inválida</div>';
        return;
    }

    let cidr;
    let netmask;

    if (mask.startsWith('/')) {
        cidr = parseInt(mask.substring(1));
        if (cidr < 0 || cidr > 32) {
            clearSubnetOutputs();
            document.getElementById('subnet-info').innerHTML = '<div class="text-red-400">CIDR inválido (0-32)</div>';
            return;
        }
        netmask = cidrToNetmask(cidr);
    } else if (isValidIPv4(mask)) {
        netmask = mask;
        cidr = netmaskToCidr(mask);
    } else {
        clearSubnetOutputs();
        document.getElementById('subnet-info').innerHTML = '<div class="text-red-400">Máscara inválida</div>';
        return;
    }

    const ipParts = ip.split('.').map(part => parseInt(part));
    const maskParts = netmask.split('.').map(part => parseInt(part));

    // Calculate network address
    const networkParts = ipParts.map((part, i) => part & maskParts[i]);
    const networkAddress = networkParts.join('.');

    // Calculate broadcast address
    const wildcardParts = maskParts.map(part => 255 - part);
    const broadcastParts = networkParts.map((part, i) => part | wildcardParts[i]);
    const broadcastAddress = broadcastParts.join('.');

    // Calculate first and last usable IPs
    const firstUsable = [...networkParts];
    firstUsable[3] += 1;
    const lastUsable = [...broadcastParts];
    lastUsable[3] -= 1;

    // Calculate total hosts
    const hostBits = 32 - cidr;
    const totalHosts = Math.pow(2, hostBits);
    const usableHosts = totalHosts - 2; // Subtract network and broadcast

    // Update outputs
    document.getElementById('subnet-network').value = networkAddress;
    document.getElementById('subnet-broadcast').value = broadcastAddress;
    document.getElementById('subnet-netmask').value = netmask;
    document.getElementById('subnet-first').value = firstUsable.join('.');
    document.getElementById('subnet-last').value = lastUsable.join('.');
    document.getElementById('subnet-hosts').value = `${usableHosts} (${totalHosts} total)`;

    // Update info
    updateSubnetInfo(cidr, totalHosts, usableHosts, networkAddress, broadcastAddress);
}

function clearSubnetOutputs() {
    document.getElementById('subnet-network').value = '';
    document.getElementById('subnet-broadcast').value = '';
    document.getElementById('subnet-netmask').value = '';
    document.getElementById('subnet-first').value = '';
    document.getElementById('subnet-last').value = '';
    document.getElementById('subnet-hosts').value = '';
    document.getElementById('subnet-info').innerHTML = '<div class="text-gray-400">Ingresa una IP y máscara válidas</div>';
}

function updateSubnetInfo(cidr, totalHosts, usableHosts, network, broadcast) {
    const info = `
        <div>
            <div class="text-gray-300"><strong>CIDR:</strong> /${cidr}</div>
            <div class="text-gray-300"><strong>Bits de Host:</strong> ${32 - cidr}</div>
            <div class="text-gray-300"><strong>Bits de Red:</strong> ${cidr}</div>
        </div>
        <div>
            <div class="text-gray-300"><strong>Total de IPs:</strong> ${totalHosts.toLocaleString()}</div>
            <div class="text-gray-300"><strong>IPs Utilizables:</strong> ${usableHosts.toLocaleString()}</div>
            <div class="text-gray-300"><strong>Rango:</strong> ${network} - ${broadcast}</div>
        </div>
    `;

    document.getElementById('subnet-info').innerHTML = info;
}

function cidrToNetmask(cidr) {
    const mask = [];
    for (let i = 0; i < 4; i++) {
        const bits = Math.min(8, Math.max(0, cidr - i * 8));
        mask.push(256 - Math.pow(2, 8 - bits));
    }
    return mask.join('.');
}

function netmaskToCidr(netmask) {
    const parts = netmask.split('.').map(part => parseInt(part));
    let cidr = 0;

    for (const part of parts) {
        const binary = part.toString(2);
        const ones = binary.split('1').length - 1;
        cidr += ones;
        if (part !== 255 && ones < 8) break;
    }

    return cidr;
}

// IP Geolocation Functions
async function lookupIPGeolocation() {
    const ip = document.getElementById('geo-ip-input').value.trim();

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
        const data = await getSimpleGeolocation(ip);
        displayGeoResults(data);
    } catch (error) {
        showGeoError('Error al obtener información de geolocalización: ' + error.message);
    }
}

async function getMyIP() {
    showGeoLoading();

    try {
        // Get user's IP and geolocation in one call
        const response = await fetch('https://ipapi.co/json/');
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason || 'Error al obtener IP');
        }

        // Set the IP in the input field
        document.getElementById('geo-ip-input').value = data.ip;

        // Convert and display the results
        const geoData = {
            status: 'success',
            query: data.ip,
            country: data.country_name || 'N/A',
            countryCode: data.country_code || 'N/A',
            region: data.region_code || 'N/A',
            regionName: data.region || 'N/A',
            city: data.city || 'N/A',
            zip: data.postal || 'N/A',
            lat: data.latitude || 'N/A',
            lon: data.longitude || 'N/A',
            timezone: data.timezone || 'N/A',
            isp: data.org || 'N/A',
            org: data.org || 'N/A',
            as: data.asn || 'N/A'
        };

        displayGeoResults(geoData);
        
    } catch (error) {
        showGeoError('Error al obtener tu IP: ' + error.message);
    }
}

// Auto-load user's IP when the geolocation tool is opened
async function autoLoadMyIP() {
    // Check if we're on the geolocation tool
    if (document.getElementById('geo-ip-input')) {
        await getMyIP();
    }
}

function showGeoLoading() {
    document.getElementById('geo-loading').classList.remove('hidden');
    document.getElementById('geo-results').classList.add('hidden');
    document.getElementById('geo-error').classList.add('hidden');
}

function displayGeoResults(data) {
    document.getElementById('geo-loading').classList.add('hidden');
    document.getElementById('geo-error').classList.add('hidden');
    document.getElementById('geo-results').classList.remove('hidden');

    // Populate fields
    document.getElementById('geo-ip').value = data.query || '';
    document.getElementById('geo-country').value = `${data.country || ''} (${data.countryCode || ''})`;
    document.getElementById('geo-city').value = data.city || '';
    document.getElementById('geo-region').value = data.regionName || '';
    document.getElementById('geo-isp').value = data.isp || '';
    document.getElementById('geo-timezone').value = data.timezone || '';
    document.getElementById('geo-coordinates').value = data.lat && data.lon ? `${data.lat}, ${data.lon}` : '';
    document.getElementById('geo-postal').value = data.zip || '';

    // Additional info
    const additionalInfo = `
        <div class="grid md:grid-cols-2 gap-4">
            <div>
                <div class="text-gray-300"><strong>Organización:</strong> ${data.org || 'N/A'}</div>
                <div class="text-gray-300"><strong>AS:</strong> ${data.as || 'N/A'}</div>
            </div>
            <div>
                <div class="text-gray-300"><strong>Latitud:</strong> ${data.lat || 'N/A'}</div>
                <div class="text-gray-300"><strong>Longitud:</strong> ${data.lon || 'N/A'}</div>
            </div>
        </div>
    `;

    document.getElementById('geo-additional-info').innerHTML = additionalInfo;
}

function showGeoError(message) {
    document.getElementById('geo-loading').classList.add('hidden');
    document.getElementById('geo-results').classList.add('hidden');
    document.getElementById('geo-error').classList.remove('hidden');
    document.getElementById('geo-error-message').textContent = message;
}

// Alternative geolocation function using a simpler approach
async function getSimpleGeolocation(ip) {
    try {
        // Use a CORS-friendly API
        const response = await fetch(`https://ipapi.co/${ip}/json/`);
        
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.error) {
            throw new Error(data.reason || 'API Error');
        }
        
        return {
            status: 'success',
            query: data.ip,
            country: data.country_name || 'N/A',
            countryCode: data.country_code || 'N/A',
            region: data.region_code || 'N/A',
            regionName: data.region || 'N/A',
            city: data.city || 'N/A',
            zip: data.postal || 'N/A',
            lat: data.latitude || 'N/A',
            lon: data.longitude || 'N/A',
            timezone: data.timezone || 'N/A',
            isp: data.org || 'N/A',
            org: data.org || 'N/A',
            as: data.asn || 'N/A'
        };
    } catch (error) {
        console.error('Geolocation error:', error);
        throw error;
    }
}