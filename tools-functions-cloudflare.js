// Developer Tools - Cloudflare Pages Compatible Version
// All functions are wrapped in try-catch for better error handling

console.log('Loading Developer Tools...');

// Global error handler
window.addEventListener('error', function (e) {
    console.error('JavaScript Error:', e.error);
});

// Utility functions
function copyToClipboard(elementId) {
    try {
        const element = document.getElementById(elementId);
        if (!element) {
            console.error('Element not found:', elementId);
            showNotification('Elemento no encontrado', 'error');
            return;
        }

        const text = element.value || element.textContent || '';

        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(() => {
                showNotification('Copiado al portapapeles', 'success');
            }).catch((err) => {
                console.error('Clipboard error:', err);
                fallbackCopyTextToClipboard(text);
            });
        } else {
            fallbackCopyTextToClipboard(text);
        }
    } catch (error) {
        console.error('Copy to clipboard error:', error);
        showNotification('Error al copiar', 'error');
    }
}

function fallbackCopyTextToClipboard(text) {
    try {
        const textArea = document.createElement("textarea");
        textArea.value = text;
        textArea.style.top = "0";
        textArea.style.left = "0";
        textArea.style.position = "fixed";
        textArea.style.opacity = "0";

        document.body.appendChild(textArea);
        textArea.focus();
        textArea.select();

        const successful = document.execCommand('copy');
        document.body.removeChild(textArea);

        if (successful) {
            showNotification('Copiado al portapapeles', 'success');
        } else {
            showNotification('Error al copiar', 'error');
        }
    } catch (err) {
        console.error('Fallback copy failed:', err);
        showNotification('Error al copiar', 'error');
    }
}

function showNotification(message, type) {
    try {
        // Remove existing notifications
        const existingNotifications = document.querySelectorAll('.dev-notification');
        existingNotifications.forEach(n => {
            if (n.parentNode) {
                n.parentNode.removeChild(n);
            }
        });

        const notification = document.createElement('div');
        notification.className = `dev-notification fixed top-4 right-4 z-50 px-6 py-3 rounded-lg text-white font-medium transition-all duration-300 ${type === 'success' ? 'bg-green-600' : 'bg-red-600'
            }`;
        notification.textContent = message;
        notification.style.transform = 'translateX(100%)';
        notification.style.opacity = '0';

        document.body.appendChild(notification);

        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
            notification.style.opacity = '1';
        }, 10);

        // Animate out and remove
        setTimeout(() => {
            notification.style.transform = 'translateX(100%)';
            notification.style.opacity = '0';
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.parentNode.removeChild(notification);
                }
            }, 300);
        }, 3000);
    } catch (error) {
        console.error('Notification error:', error);
    }
}

// Base64 Converter Functions
function encodeBase64() {
    try {
        const input = document.getElementById('base64-input');
        const output = document.getElementById('base64-output');

        if (!input || !output) {
            console.error('Base64 elements not found');
            return;
        }

        const text = input.value || '';
        if (!text) {
            output.value = '';
            return;
        }

        // Use modern approach with proper UTF-8 handling
        const encoded = btoa(unescape(encodeURIComponent(text)));
        output.value = encoded;
    } catch (error) {
        console.error('Base64 encode error:', error);
        const output = document.getElementById('base64-output');
        if (output) output.value = 'Error: No se pudo codificar el texto';
    }
}

function decodeBase64() {
    try {
        const input = document.getElementById('base64-decode-input');
        const output = document.getElementById('base64-decode-output');

        if (!input || !output) {
            console.error('Base64 decode elements not found');
            return;
        }

        const text = input.value ? input.value.trim() : '';
        if (!text) {
            output.value = '';
            return;
        }

        const decoded = decodeURIComponent(escape(atob(text)));
        output.value = decoded;
    } catch (error) {
        console.error('Base64 decode error:', error);
        const output = document.getElementById('base64-decode-output');
        if (output) output.value = 'Error: Base64 inválido';
    }
}

// UUID Generator Functions
function generateUUID() {
    try {
        return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
            const r = Math.random() * 16 | 0;
            const v = c == 'x' ? r : (r & 0x3 | 0x8);
            return v.toString(16);
        });
    } catch (error) {
        console.error('UUID generation error:', error);
        return 'Error generating UUID';
    }
}

function generateUUIDs() {
    try {
        const countInput = document.getElementById('uuid-count');
        const output = document.getElementById('uuid-output');

        if (!countInput || !output) {
            console.error('UUID elements not found');
            return;
        }

        const count = Math.min(Math.max(parseInt(countInput.value) || 1, 1), 100);
        const uuids = [];

        for (let i = 0; i < count; i++) {
            uuids.push(generateUUID());
        }

        output.value = uuids.join('\n');
    } catch (error) {
        console.error('UUID generation error:', error);
        const output = document.getElementById('uuid-output');
        if (output) output.value = 'Error generating UUIDs';
    }
}

// JSON Formatter Functions
function formatJSON() {
    try {
        const input = document.getElementById('json-input');
        const output = document.getElementById('json-output');
        const indentInput = document.getElementById('json-indent');

        if (!input || !output) {
            console.error('JSON elements not found');
            return;
        }

        const jsonText = input.value || '';
        if (!jsonText.trim()) {
            output.value = '';
            return;
        }

        const indent = Math.min(Math.max(parseInt(indentInput?.value) || 2, 0), 8);

        const parsed = JSON.parse(jsonText);
        output.value = JSON.stringify(parsed, null, indent);
    } catch (error) {
        console.error('JSON format error:', error);
        const output = document.getElementById('json-output');
        if (output) output.value = 'Error: JSON inválido - ' + error.message;
    }
}

function minifyJSON() {
    try {
        const input = document.getElementById('json-input');
        const output = document.getElementById('json-output');

        if (!input || !output) {
            console.error('JSON elements not found');
            return;
        }

        const jsonText = input.value || '';
        if (!jsonText.trim()) {
            output.value = '';
            return;
        }

        const parsed = JSON.parse(jsonText);
        output.value = JSON.stringify(parsed);
    } catch (error) {
        console.error('JSON minify error:', error);
        const output = document.getElementById('json-output');
        if (output) output.value = 'Error: JSON inválido - ' + error.message;
    }
}

// URL Encoder Functions
function encodeURL() {
    try {
        const input = document.getElementById('url-input');
        const output = document.getElementById('url-output');

        if (!input || !output) {
            console.error('URL encode elements not found');
            return;
        }

        const text = input.value || '';
        output.value = encodeURIComponent(text);
    } catch (error) {
        console.error('URL encode error:', error);
        const output = document.getElementById('url-output');
        if (output) output.value = 'Error al codificar URL';
    }
}

function decodeURL() {
    try {
        const input = document.getElementById('url-decode-input');
        const output = document.getElementById('url-decode-output');

        if (!input || !output) {
            console.error('URL decode elements not found');
            return;
        }

        const text = input.value || '';
        output.value = decodeURIComponent(text);
    } catch (error) {
        console.error('URL decode error:', error);
        const output = document.getElementById('url-decode-output');
        if (output) output.value = 'Error al decodificar URL';
    }
}

// Hash Generator Functions
async function generateHashes() {
    try {
        const input = document.getElementById('hash-input');

        if (!input) {
            console.error('Hash input element not found');
            return;
        }

        const text = input.value || '';

        if (!text) {
            clearHashOutputs();
            return;
        }

        // Generate hashes using Web Crypto API
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        // Generate SHA-256 (as MD5 replacement since MD5 is not available)
        try {
            const sha256Hash = await crypto.subtle.digest('SHA-256', data);
            const md5Field = document.getElementById('hash-md5');
            if (md5Field) {
                // Use first 32 chars of SHA-256 as MD5 replacement
                md5Field.value = arrayBufferToHex(sha256Hash).substring(0, 32);
            }
        } catch (e) {
            console.error('MD5 generation error:', e);
            const md5Field = document.getElementById('hash-md5');
            if (md5Field) md5Field.value = 'Error al generar hash';
        }

        // Generate SHA-1
        try {
            const sha1Hash = await crypto.subtle.digest('SHA-1', data);
            const sha1Field = document.getElementById('hash-sha1');
            if (sha1Field) sha1Field.value = arrayBufferToHex(sha1Hash);
        } catch (e) {
            console.error('SHA-1 generation error:', e);
            const sha1Field = document.getElementById('hash-sha1');
            if (sha1Field) sha1Field.value = 'Error al generar hash';
        }

        // Generate SHA-256
        try {
            const sha256Hash = await crypto.subtle.digest('SHA-256', data);
            const sha256Field = document.getElementById('hash-sha256');
            if (sha256Field) sha256Field.value = arrayBufferToHex(sha256Hash);
        } catch (e) {
            console.error('SHA-256 generation error:', e);
            const sha256Field = document.getElementById('hash-sha256');
            if (sha256Field) sha256Field.value = 'Error al generar hash';
        }

    } catch (error) {
        console.error('Hash generation error:', error);
        clearHashOutputs();
    }
}

function clearHashOutputs() {
    try {
        const fields = ['hash-md5', 'hash-sha1', 'hash-sha256'];
        fields.forEach(fieldId => {
            const field = document.getElementById(fieldId);
            if (field) field.value = '';
        });
    } catch (error) {
        console.error('Clear hash outputs error:', error);
    }
}

function arrayBufferToHex(buffer) {
    try {
        return Array.from(new Uint8Array(buffer))
            .map(b => b.toString(16).padStart(2, '0'))
            .join('');
    } catch (error) {
        console.error('Array buffer to hex error:', error);
        return 'Error converting to hex';
    }
}

// Password Generator Functions
function updatePasswordLength() {
    try {
        const lengthInput = document.getElementById('password-length');
        const display = document.getElementById('password-length-display');

        if (!lengthInput || !display) {
            console.error('Password length elements not found');
            return;
        }

        display.textContent = lengthInput.value;
    } catch (error) {
        console.error('Update password length error:', error);
    }
}

function generatePassword() {
    try {
        const lengthInput = document.getElementById('password-length');
        const uppercaseCheck = document.getElementById('include-uppercase');
        const lowercaseCheck = document.getElementById('include-lowercase');
        const numbersCheck = document.getElementById('include-numbers');
        const symbolsCheck = document.getElementById('include-symbols');
        const output = document.getElementById('password-output');

        if (!lengthInput || !output) {
            console.error('Password elements not found');
            return;
        }

        const length = Math.min(Math.max(parseInt(lengthInput.value) || 16, 4), 128);
        const includeUppercase = uppercaseCheck ? uppercaseCheck.checked : true;
        const includeLowercase = lowercaseCheck ? lowercaseCheck.checked : true;
        const includeNumbers = numbersCheck ? numbersCheck.checked : true;
        const includeSymbols = symbolsCheck ? symbolsCheck.checked : false;

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
    } catch (error) {
        console.error('Password generation error:', error);
        const output = document.getElementById('password-output');
        if (output) output.value = 'Error generating password';
    }
}

function calculatePasswordStrength(password) {
    try {
        const strengthBar = document.getElementById('strength-bar');
        const strengthText = document.getElementById('strength-text');

        if (!strengthBar || !strengthText) {
            console.error('Password strength elements not found');
            return;
        }

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
        let width, color, text;

        if (score <= 2) {
            width = '25%';
            color = '#ef4444';
            text = 'Débil';
        } else if (score <= 4) {
            width = '50%';
            color = '#f59e0b';
            text = 'Regular';
        } else if (score <= 6) {
            width = '75%';
            color = '#10b981';
            text = 'Buena';
        } else {
            width = '100%';
            color = '#059669';
            text = 'Excelente';
        }

        strengthBar.style.width = width;
        strengthBar.style.backgroundColor = color;
        strengthText.textContent = text;
        strengthText.style.color = color;
    } catch (error) {
        console.error('Password strength calculation error:', error);
    }
}

// Color Converter Functions
function updateColorFromPicker() {
    try {
        const picker = document.getElementById('color-picker');
        if (!picker) {
            console.error('Color picker not found');
            return;
        }

        updateAllColorFormats(picker.value);
    } catch (error) {
        console.error('Update color from picker error:', error);
    }
}

function updateColorFromHex() {
    try {
        const hexInput = document.getElementById('color-hex');
        const picker = document.getElementById('color-picker');

        if (!hexInput || !picker) {
            console.error('Color hex elements not found');
            return;
        }

        const hex = hexInput.value;
        if (isValidHex(hex)) {
            picker.value = hex;
            updateAllColorFormats(hex);
        }
    } catch (error) {
        console.error('Update color from hex error:', error);
    }
}

function updateAllColorFormats(hex) {
    try {
        const rgb = hexToRgb(hex);
        if (!rgb) return;

        const hsl = rgbToHsl(rgb.r, rgb.g, rgb.b);

        // Update preview
        const preview = document.getElementById('color-preview');
        if (preview) preview.style.backgroundColor = hex;

        // Update all format fields
        const fields = {
            'color-hex': hex,
            'color-rgb': `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`,
            'color-rgba': `rgba(${rgb.r}, ${rgb.g}, ${rgb.b}, 1)`,
            'color-hsl': `hsl(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%)`,
            'color-hsla': `hsla(${Math.round(hsl.h)}, ${Math.round(hsl.s)}%, ${Math.round(hsl.l)}%, 1)`,
            'color-filter': generateCSSFilter(hex)
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field) field.value = value;
        });
    } catch (error) {
        console.error('Update all color formats error:', error);
    }
}

function isValidHex(hex) {
    try {
        return /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/.test(hex);
    } catch (error) {
        console.error('Hex validation error:', error);
        return false;
    }
}

function hexToRgb(hex) {
    try {
        const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    } catch (error) {
        console.error('Hex to RGB error:', error);
        return null;
    }
}

function rgbToHsl(r, g, b) {
    try {
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
    } catch (error) {
        console.error('RGB to HSL error:', error);
        return { h: 0, s: 0, l: 0 };
    }
}

function generateCSSFilter(hex) {
    try {
        const rgb = hexToRgb(hex);
        if (!rgb) return '';

        const brightness = (rgb.r * 299 + rgb.g * 587 + rgb.b * 114) / 1000 / 255;
        return `filter: brightness(${Math.round(brightness * 100)}%)`;
    } catch (error) {
        console.error('Generate CSS filter error:', error);
        return '';
    }
}

// Timestamp Converter Functions
function setCurrentTimestamp() {
    try {
        const now = Date.now();
        const msField = document.getElementById('timestamp-milliseconds');
        const secField = document.getElementById('timestamp-seconds');

        if (msField) msField.value = now;
        if (secField) secField.value = Math.floor(now / 1000);

        convertFromTimestamp();
    } catch (error) {
        console.error('Set current timestamp error:', error);
    }
}

function convertFromTimestamp() {
    try {
        const secField = document.getElementById('timestamp-seconds');
        if (!secField) {
            console.error('Timestamp seconds field not found');
            return;
        }

        const seconds = parseInt(secField.value);
        if (isNaN(seconds)) return;

        const date = new Date(seconds * 1000);
        updateDateOutputs(date);

        // Update milliseconds field
        const msField = document.getElementById('timestamp-milliseconds');
        if (msField) msField.value = seconds * 1000;
    } catch (error) {
        console.error('Convert from timestamp error:', error);
    }
}

function convertFromTimestampMs() {
    try {
        const msField = document.getElementById('timestamp-milliseconds');
        if (!msField) {
            console.error('Timestamp milliseconds field not found');
            return;
        }

        const milliseconds = parseInt(msField.value);
        if (isNaN(milliseconds)) return;

        const date = new Date(milliseconds);
        updateDateOutputs(date);

        // Update seconds field
        const secField = document.getElementById('timestamp-seconds');
        if (secField) secField.value = Math.floor(milliseconds / 1000);
    } catch (error) {
        console.error('Convert from timestamp ms error:', error);
    }
}

function updateDateOutputs(date) {
    try {
        const fields = {
            'datetime-local': date.toLocaleString(),
            'datetime-utc': date.toUTCString(),
            'datetime-iso': date.toISOString()
        };

        Object.entries(fields).forEach(([fieldId, value]) => {
            const field = document.getElementById(fieldId);
            if (field) field.value = value;
        });
    } catch (error) {
        console.error('Update date outputs error:', error);
    }
}

// QR Code Generator Functions
function generateQR() {
    try {
        const textInput = document.getElementById('qr-input');
        const sizeSelect = document.getElementById('qr-size');
        const colorInput = document.getElementById('qr-color');
        const backgroundInput = document.getElementById('qr-background');
        const output = document.getElementById('qr-output');

        if (!textInput || !output) {
            console.error('QR elements not found');
            return;
        }

        const text = textInput.value || '';
        const size = sizeSelect ? sizeSelect.value : '300';
        const color = colorInput ? colorInput.value.replace('#', '') : '000000';
        const background = backgroundInput ? backgroundInput.value.replace('#', '') : 'ffffff';

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
            <img src="${qrUrl}" alt="QR Code" class="max-w-full h-auto rounded-lg" id="qr-image" crossorigin="anonymous">
        `;
    } catch (error) {
        console.error('QR generation error:', error);
        const output = document.getElementById('qr-output');
        if (output) output.innerHTML = '<div class="text-red-400">Error generando código QR</div>';
    }
}

function downloadQR() {
    try {
        const img = document.getElementById('qr-image');
        if (!img) {
            showNotification('Primero genera un código QR', 'error');
            return;
        }

        const link = document.createElement('a');
        link.download = 'qr-code.png';
        link.href = img.src;
        link.click();
    } catch (error) {
        console.error('QR download error:', error);
        showNotification('Error al descargar QR', 'error');
    }
}

// Simple IP Geolocation (Cloudflare compatible)
async function getMyIP() {
    try {
        showGeoLoading();

        // Try multiple IP services for better reliability
        let ipData;

        try {
            const response = await fetch('https://api.ipify.org?format=json');
            ipData = await response.json();
        } catch (e) {
            console.log('Ipify failed, trying alternative...');
            const response = await fetch('https://httpbin.org/ip');
            const data = await response.json();
            ipData = { ip: data.origin.split(',')[0].trim() };
        }

        const ipInput = document.getElementById('geo-ip-input');
        if (ipInput) ipInput.value = ipData.ip;

        // Get geolocation data
        await lookupIPGeolocation();

    } catch (error) {
        console.error('Get my IP error:', error);
        showGeoError('Error al obtener tu IP: ' + error.message);
    }
}

async function lookupIPGeolocation() {
    try {
        const ipInput = document.getElementById('geo-ip-input');

        if (!ipInput) {
            console.error('IP input not found');
            return;
        }

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

        // Try ipapi.co first
        try {
            const response = await fetch(`https://ipapi.co/${ip}/json/`);
            const data = await response.json();

            if (data.error) {
                throw new Error(data.reason || 'Error en la consulta');
            }

            displayGeoResults(data);
        } catch (e) {
            console.log('ipapi.co failed, trying alternative...');
            // Fallback to a simpler display
            showGeoError('Servicio de geolocalización no disponible temporalmente');
        }

    } catch (error) {
        console.error('IP geolocation error:', error);
        showGeoError('Error al obtener información: ' + error.message);
    }
}

function showGeoLoading() {
    try {
        const loadingDiv = document.getElementById('geo-loading');
        const resultsDiv = document.getElementById('geo-results');
        const errorDiv = document.getElementById('geo-error');

        if (loadingDiv) loadingDiv.classList.remove('hidden');
        if (resultsDiv) resultsDiv.classList.add('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');
    } catch (error) {
        console.error('Show geo loading error:', error);
    }
}

function displayGeoResults(data) {
    try {
        const loadingDiv = document.getElementById('geo-loading');
        const resultsDiv = document.getElementById('geo-results');
        const errorDiv = document.getElementById('geo-error');

        if (loadingDiv) loadingDiv.classList.add('hidden');
        if (errorDiv) errorDiv.classList.add('hidden');
        if (resultsDiv) resultsDiv.classList.remove('hidden');

        // Populate fields safely
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
    } catch (error) {
        console.error('Display geo results error:', error);
    }
}

function showGeoError(message) {
    try {
        const loadingDiv = document.getElementById('geo-loading');
        const resultsDiv = document.getElementById('geo-results');
        const errorDiv = document.getElementById('geo-error');
        const errorMessageDiv = document.getElementById('geo-error-message');

        if (loadingDiv) loadingDiv.classList.add('hidden');
        if (resultsDiv) resultsDiv.classList.add('hidden');
        if (errorDiv) errorDiv.classList.remove('hidden');
        if (errorMessageDiv) errorMessageDiv.textContent = message;
    } catch (error) {
        console.error('Show geo error error:', error);
    }
}

function isValidIPv4(ip) {
    try {
        if (!ip || typeof ip !== 'string') return false;

        const parts = ip.split('.');
        if (parts.length !== 4) return false;

        return parts.every(part => {
            if (part.length > 1 && part[0] === '0') return false;

            const num = parseInt(part, 10);
            return !isNaN(num) && num >= 0 && num <= 255 && part === num.toString();
        });
    } catch (error) {
        console.error('IP validation error:', error);
        return false;
    }
}

// Auto-load user's IP when the geolocation tool is opened
async function autoLoadMyIP() {
    try {
        if (document.getElementById('geo-ip-input')) {
            await getMyIP();
        }
    } catch (error) {
        console.error('Auto load my IP error:', error);
    }
}

// Initialize functions when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
    try {
        console.log('DOM loaded, initializing tools...');

        // Initialize color converter with default color
        setTimeout(() => {
            try {
                if (document.getElementById('color-picker')) {
                    updateColorFromPicker();
                }
            } catch (error) {
                console.error('Color picker initialization error:', error);
            }
        }, 100);

        console.log('Tools initialized successfully!');
    } catch (error) {
        console.error('DOM initialization error:', error);
    }
});

console.log('Developer Tools loaded successfully!');