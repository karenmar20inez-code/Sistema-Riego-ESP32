// Helpers de hashing usando SubtleCrypto
async function hashStringSHA256(str) {
    const enc = new TextEncoder();
    const data = enc.encode(str);
    const hashBuffer = await crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

window.capitalizeFirstLetter = function(value) {
    if (!value) return '';
    const trimmed = value.trim();
    if (!trimmed) return '';
    return trimmed.charAt(0).toUpperCase() + trimmed.slice(1);
};

window.getUserDisplayName = function() {
    const email = localStorage.getItem('userEmail');
    if (!email) return 'Usuario';

    const storedName = localStorage.getItem('userName:' + email.toLowerCase());
    if (storedName && storedName.trim()) {
        return window.capitalizeFirstLetter(storedName);
    }

    return window.capitalizeFirstLetter(email.split('@')[0] || 'Usuario');
};

window.updateWelcomeMessage = function() {
    const welcomeEl = document.getElementById('welcome-user');
    if (!welcomeEl) return;
    welcomeEl.textContent = 'Bienvenido, ' + window.getUserDisplayName();
};

// Guardar credenciales (almacena hash de la contraseña)
window.setUserCredentials = async function(email, password) {
    const key = 'user:' + email.toLowerCase();
    const hash = await hashStringSHA256(password);
    localStorage.setItem(key, hash);
};

// Verificar contraseña
window.checkUserPassword = async function(email, password) {
    const key = 'user:' + email.toLowerCase();
    const storedHash = localStorage.getItem(key);
    if (!storedHash) return false;
    const hash = await hashStringSHA256(password);
    return storedHash === hash;
};

// Obtener si el usuario existe
window.userExists = function(email) {
    const key = 'user:' + email.toLowerCase();
    return localStorage.getItem(key) !== null;
};

// Login handler
document.getElementById('login-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const email = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value;
    if (!email || !password) {
        alert('Por favor ingresa correo y contraseña');
        return;
    }

    // Validar formato de correo básico
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Por favor ingresa un correo válido');
        return;
    }

    const exists = userExists(email);
    if (exists) {
        const ok = await checkUserPassword(email, password);
        if (ok) {
            localStorage.setItem('loggedIn', 'true');
            localStorage.setItem('userEmail', email);
            if (!localStorage.getItem('userName:' + email.toLowerCase())) {
                localStorage.setItem('userName:' + email.toLowerCase(), email.split('@')[0]);
            }
            window.updateWelcomeMessage();
            document.getElementById('login-section').classList.add('hidden');
            document.getElementById('app-section').classList.remove('hidden');
        } else {
            alert('Contraseña incorrecta');
        }
    } else {
        // crear cuenta demo con validación de contraseña (mínimo 6 caracteres)
        if (password.length < 6) {
            alert('La contraseña debe tener al menos 6 caracteres');
            return;
        }
        await window.setUserCredentials(email, password);
        localStorage.setItem('loggedIn', 'true');
        localStorage.setItem('userEmail', email);
        if (!localStorage.getItem('userName:' + email.toLowerCase())) {
            localStorage.setItem('userName:' + email.toLowerCase(), email.split('@')[0]);
        }
        window.updateWelcomeMessage();
        alert('Cuenta creada (modo demo). Ahora has iniciado sesión.');
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
    }
});

// Logout
document.getElementById('logout-btn').addEventListener('click', function() {
    document.getElementById('login-section').classList.remove('hidden');
    document.getElementById('app-section').classList.add('hidden');
    localStorage.removeItem('loggedIn');
    localStorage.removeItem('userEmail');
    document.getElementById('login-form').reset();
});

// Check if already logged in
window.addEventListener('load', function() {
    if (localStorage.getItem('loggedIn') === 'true') {
        window.updateWelcomeMessage();
        document.getElementById('login-section').classList.add('hidden');
        document.getElementById('app-section').classList.remove('hidden');
    }
});