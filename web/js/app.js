// Inicialización de la aplicación

// Resolver dinámico de API: intenta varios endpoints (si abres la página desde el servidor mismo
// éste responderá usando window.location.origin). Esto ayuda cuando la IP del PC cambia.
const CANDIDATE_BASES = [
    window.location.origin,                // si sirves la web desde node -> same origin
    'http://10.196.34.222:3000',           // IP conocida (ajusta si la PC cambia de IP)
    'http://127.0.0.1:3000',
    'http://localhost:3000'
].filter(Boolean);

// Intenta cada base y devuelve la primera que responda correctamente a /api/sensor
async function findWorkingApiBase() {
    for (const base of CANDIDATE_BASES) {
        try {
            const controller = new AbortController();
            const timer = setTimeout(() => controller.abort(), 2000);
            const res = await fetch(base + '/api/sensor', { method: 'GET', cache: 'no-store', signal: controller.signal });
            clearTimeout(timer);
            if (res.ok) {
                console.log('API responde en', base);
                return base;
            }
        } catch (e) {
            // sigue al siguiente candidato
        }
    }
    // Si ninguno responde, devolver el primer candidato para fallar de forma predecible
    return CANDIDATE_BASES[0];
}

// Cacheamos la promesa para no volver a escanear cada llamada
let API_BASE_PROMISE = findWorkingApiBase();

async function cargarDatosDesdeESP32() {
    try {
        // Resolver la base de la API (espera si aún se está buscando)
        const apiBase = (typeof API_BASE_PROMISE === 'string') ? API_BASE_PROMISE : await API_BASE_PROMISE;
        const response = await fetch(apiBase + '/api/sensor', { cache: 'no-store' });
        if (!response.ok) {
            throw new Error('No se pudo obtener los datos del ESP32 (HTTP ' + response.status + ')');
        }

        const json = await response.json();
        // El server devuelve { ok: true, data: ultimoSensor }
        const data = (json && json.data) ? json.data : json;
        if (!data) throw new Error('Respuesta sin datos');

        const temp = Number(data.temperatura);
        const humedad = Number(data.humedad);
        const humedadSuelo = data.humedadSuelo !== undefined ? Number(data.humedadSuelo) : null;
        const sueloSimulado = !!data.humedadSueloSimulada;

        const tempEl = document.getElementById('kpi-temp');
        const tempSideEl = document.getElementById('sidebar-temp');
        const humSideEl = document.getElementById('sidebar-humidity');
        const moistureSideEl = document.getElementById('sidebar-moisture');
        const kpiHumidityEl = document.getElementById('kpi-humidity');

        if (tempEl && !isNaN(temp)) tempEl.textContent = temp.toFixed(1);
        if (tempSideEl && !isNaN(temp)) tempSideEl.textContent = temp.toFixed(1) + ' °C';

        if (humSideEl && !isNaN(humedad)) humSideEl.textContent = humedad.toFixed(0) + ' %';
        if (kpiHumidityEl && !isNaN(humedad)) kpiHumidityEl.textContent = humedad.toFixed(0);

        if (moistureSideEl) {
            if (humedadSuelo === null || isNaN(humedadSuelo)) {
                moistureSideEl.textContent = '--';
            } else {
                moistureSideEl.textContent = humedadSuelo.toFixed(0) + ' %' + (sueloSimulado ? ' (simulada)' : '');
            }
        }

        const kpiMoistureEl = document.getElementById('kpi-moisture');
        const badgeEl = document.getElementById('kpi-moisture-badge');
        if (kpiMoistureEl) {
            if (humedadSuelo === null || isNaN(humedadSuelo)) {
                kpiMoistureEl.textContent = '--';
                if (badgeEl) badgeEl.classList.add('hidden');
            } else {
                kpiMoistureEl.textContent = String(Math.round(humedadSuelo));
                if (badgeEl) {
                    if (sueloSimulado) badgeEl.classList.remove('hidden'); else badgeEl.classList.add('hidden');
                }
            }
        }

        console.log('Datos del ESP32:', data);

        // Mostrar JSON crudo en la sección de depuración
        const debugPre = document.getElementById('debug-json');
        if (debugPre) debugPre.textContent = JSON.stringify(data, null, 2);

        // Actualizar estado de conexión y hora de última lectura
        const statusDot = document.getElementById('connection-dot');
        const statusText = document.getElementById('connection-text');
        const lastReadEl = document.getElementById('last-read');

        if (statusDot) {
            statusDot.classList.remove('bg-red-500');
            statusDot.classList.add('bg-green-500');
        }
        if (statusText) statusText.textContent = 'Conectado';
        if (lastReadEl) lastReadEl.textContent = new Date(data.recibidoEn || Date.now()).toLocaleString();

    } catch (error) {
        console.error('Error conectando con ESP32:', error);

        const statusDot = document.getElementById('connection-dot');
        const statusText = document.getElementById('connection-text');
        if (statusDot) {
            statusDot.classList.remove('bg-green-500');
            statusDot.classList.add('bg-red-500');
        }
        if (statusText) statusText.textContent = 'Desconectado';
    }
}

document.addEventListener('DOMContentLoaded', function() {
    console.log('Iniciando Dashboard de Riego Automatizado...');

    cargarDatosDesdeESP32();
    setInterval(cargarDatosDesdeESP32, 5000);

    // Cargar plantas
    renderizarPlantas();

    // Cargar historial
    renderizarHistorial();

    // Cargar programaciones
    renderizarProgramaciones();

    // Inicializar gráficos
    inicializarGraficos();

    // Actualizar KPIs iniciales
    actualizarKPIs();

    // Actualizar datos cada 5 segundos
    setInterval(actualizarKPIs, 5000);

    // Hook para botón de refresco manual (depuración)
    const refreshBtn = document.getElementById('refresh-now');
    if (refreshBtn) refreshBtn.addEventListener('click', () => cargarDatosDesdeESP32());

    // Event listeners para formularios
    document.getElementById('formAutomatico').addEventListener('submit', function(e) {
        e.preventDefault();
        const enabledEl = document.getElementById('enableAutomatic');
        const minMoistureEl = document.getElementById('minMoisture');
        const enabled = !!(enabledEl && enabledEl.checked);
        const minVal = Number(minMoistureEl ? minMoistureEl.value : 40) || 40;
        localStorage.setItem('autoEnabled', enabled ? '1' : '0');
        localStorage.setItem('autoMinMoisture', String(minVal));
        alert('✓ Configuración guardada correctamente');
    });

    document.getElementById('formCuenta').addEventListener('submit', async function(e) {
        e.preventDefault();
        const name = document.getElementById('cuenta-nombre').value.trim();
        const emailField = document.getElementById('cuenta-correo');
        const email = (emailField && emailField.value.trim()) || localStorage.getItem('userEmail');

        if (!email) {
            alert('No se encontró correo de usuario.');
            return;
        }
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            alert('Correo inválido');
            return;
        }

        // Guardar nombre (opcional)
        localStorage.setItem('userName:' + email.toLowerCase(), name);

        // Manejo de cambio de contraseña
        const current = document.getElementById('cuenta-current-password').value;
        const nuevo = document.getElementById('cuenta-new-password').value;

        if (nuevo) {
            if (nuevo.length < 6) {
                alert('La nueva contraseña debe tener al menos 6 caracteres');
                return;
            }
            const exists = window.userExists(email);
            if (exists) {
                if (!current) {
                    alert('Ingresa la contraseña actual para cambiarla');
                    return;
                }
                const ok = await window.checkUserPassword(email, current);
                if (!ok) {
                    alert('Contraseña actual incorrecta');
                    return;
                }
            }
            await window.setUserCredentials(email, nuevo);
        }

        alert('✓ Cambios guardados correctamente');
    });

    document.getElementById('formProgramacion').addEventListener('submit', function(e) {
        e.preventDefault();
        alert('✓ Programación añadida correctamente');
        document.getElementById('formProgramacion').reset();
    });

    console.log('Dashboard iniciado correctamente');
});

function renderizarPlantas() {
    // Compatibilidad: buscar primero 'plants-container' (nuevo), si no existe usar 'plantasContainer' (antiguo)
    const container = document.getElementById('plants-container') || document.getElementById('plantasContainer');
    if (!container) return;

    container.innerHTML = datosRiego.plantas.map(planta => `
        <div class="bg-slate-800 rounded-xl p-6 border border-slate-700 hover:border-cyan-500/50 transition">
            <div class="flex items-start justify-between mb-4">
                <h3 class="text-lg font-bold text-white">${planta.nombre}</h3>
                <span class="px-3 py-1 bg-green-500/20 text-green-300 text-xs rounded-full">ACTIVA</span>
            </div>
            
            <div class="space-y-3 mb-4">
                <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Temperatura</span>
                    <span class="text-orange-400 font-semibold">${planta.temp}°C</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Humedad</span>
                    <span class="text-cyan-400 font-semibold">${planta.humedad}%</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Agua (L)</span>
                    <span class="text-blue-400 font-semibold">${planta.agua}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Nutrientes (ml)</span>
                    <span class="text-purple-400 font-semibold">${planta.nutrientes}</span>
                </div>
                <div class="flex justify-between items-center">
                    <span class="text-gray-400 text-sm">Último Riego</span>
                    <span class="text-gray-300 font-semibold">${planta.ultimoRiego}</span>
                </div>
            </div>
            
            <button class="btn-plant-manual w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 rounded-lg transition" data-plant-id="${planta.id}">
                Riego Manual
            </button>
        </div>
    `).join('');
}

function renderizarHistorial() {
    const container = document.getElementById('historialContainer');
    if (!container) return;

    container.innerHTML = datosRiego.historialRiego.map(registro => `
        <tr class="hover:bg-slate-700/50 transition">
            <td class="px-6 py-4 text-gray-300">${registro.fecha}</td>
            <td class="px-6 py-4 text-gray-300">${registro.hora}</td>
            <td class="px-6 py-4 text-gray-300">${registro.duracion}</td>
            <td class="px-6 py-4 text-cyan-400 font-semibold">${registro.agua}</td>
            <td class="px-6 py-4">
                <span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">✓ ${registro.estado}</span>
            </td>
        </tr>
    `).join('');
}

function renderizarProgramaciones() {
    const container = document.getElementById('programacionesContainer');
    if (!container) return;

    container.innerHTML = datosRiego.programaciones.map(prog => `
        <div class="flex items-center justify-between p-4 bg-slate-700/50 rounded-lg">
            <div>
                <p class="font-semibold text-white">Programación ${prog.id}</p>
                <p class="text-sm text-gray-400">${prog.hora} - ${prog.duracion} minutos</p>
            </div>
            <span class="w-3 h-3 rounded-full bg-green-500"></span>
        </div>
    `).join('');
}