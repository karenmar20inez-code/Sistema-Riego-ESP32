// Puente simple para usar el simulador de datos y actualizar la UI y gráficos

(function() {
    function safe(id) { return document.getElementById(id); }

    // Flag global: true = usar simulador, false = esperar datos reales
    window.useSimulator = (window.useSimulator === undefined) ? true : !!window.useSimulator;

    // Vincular toggle de UI si existe
    const toggle = safe('toggle-simulator');
    if (toggle) {
        // checkbox checked = simulador ON
        toggle.checked = window.useSimulator;
        toggle.addEventListener('change', function() {
            window.useSimulator = !!toggle.checked;
            console.info('useSimulator ->', window.useSimulator);
        });
    }

    // Función para generar y descargar un reporte basado en datosRiego
    function downloadReport() {
        if (!window.datosRiego) return;
        const d = datosRiego.datosActuales || {};
        const plants = datosRiego.plantas || [];
        const prog = datosRiego.programaciones || [];
        const hist = datosRiego.historialRiego || [];
        const alerts = datosRiego.alertas || [];

        let contenido = '';
        contenido += `REPORTE DEL SISTEMA DE RIEGO - ${new Date().toLocaleString()}\n\n`;
        contenido += '=== DATOS ACTUALES ===\n';
        contenido += `Temperatura: ${d.temperatura ?? 'N/A'} °C\n`;
        contenido += `Humedad (aire): ${d.humedad ?? 'N/A'} %\n`;
        contenido += `Humedad del Suelo: ${d.humedadSuelo ?? 'N/A'} %\n`;
        contenido += `Consumo de Nutrientes: ${d.consumoNutrientes ?? 'N/A'} ml\n`;
        contenido += `Minutos desde último riego: ${d.minutosUltimoRiego ?? 'N/A'}\n`;
        contenido += `Minutos al próximo riego: ${d.minutosProximoRiego ?? 'N/A'}\n`;
        contenido += `Tanque de Agua: ${d.tanque ?? 'N/A'} %\n\n`;

        contenido += '=== PLANTAS ===\n';
        plants.forEach(p => {
            contenido += `${p.nombre} - Temp: ${p.temp} °C, Humedad: ${p.humedad} %, Agua: ${p.agua} L, Nutrientes: ${p.nutrientes} ml, Último riego: ${p.ultimoRiego}\n`;
        });
        contenido += '\n';

        contenido += '=== PROGRAMACIONES ===\n';
        prog.forEach(p => {
            contenido += `ID ${p.id} - Hora: ${p.hora}, Duración: ${p.duracion} min\n`;
        });
        contenido += '\n';

        contenido += '=== HISTORIAL DE RIEGO ===\n';
        hist.forEach(h => {
            contenido += `${h.fecha} ${h.hora} - ${h.duracion} - ${h.agua} - ${h.estado}\n`;
        });
        contenido += '\n';

        contenido += '=== ALERTAS ===\n';
        alerts.forEach(a => {
            contenido += `${a.titulo || ''} - ${a.mensaje || ''} (${a.tipo || 'info'})\n`;
        });

        const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `reporte_riego_${Date.now()}.txt`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
    }

    // Vincular botón de descarga de reporte si existe
    const downloadBtn = safe('download-report');
    if (downloadBtn) downloadBtn.addEventListener('click', downloadReport);

    // Inicializa gráficos si está disponible
    if (typeof inicializarGraficos === 'function') {
        try { inicializarGraficos(); } catch (e) { console.warn('Error inicializando gráficos:', e); }
    }

    function renderPlants() {
        const cont = safe('plants-container');
        if (!cont || !window.datosRiego) return;
        cont.innerHTML = '';
        datosRiego.plantas.forEach(planta => {
            const div = document.createElement('div');
            div.className = 'bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-blue-500/20 shadow-lg';
            div.innerHTML = `
                <h3 class="text-lg font-semibold mb-4">${planta.nombre}</h3>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between"><span class="text-gray-400">Temperatura</span><span class="text-orange-400 font-semibold">${planta.temp.toFixed(1)} °C</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Humedad del Suelo</span><span class="text-cyan-400 font-semibold">${Math.round(planta.humedad)} %</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Agua</span><span class="text-blue-400 font-semibold">${planta.agua} L</span></div>
                    <div class="flex justify-between"><span class="text-gray-400">Nutrientes</span><span class="text-purple-400 font-semibold">${planta.nutrientes} ml</span></div>
                    <div class="flex justify-between pt-3 border-t border-slate-600"><span class="text-gray-400">Último Riego</span><span class="text-gray-300 font-semibold">${planta.ultimoRiego}</span></div>
                </div>
                <button class="btn-plant-manual w-full bg-cyan-600 hover:bg-cyan-700 text-white text-sm font-semibold py-2 rounded-lg transition mt-4" data-plant-id="${planta.id}">Riego Manual</button>
            `;
            cont.appendChild(div);
        });
    }

    function renderHistorial() {
        const container = safe('historialContainer') || safe('history-table-body');
        if (!container || !datosRiego.historialRiego) return;

        // If it's a tbody
        if (container.tagName === 'TBODY' || container.tagName === 'TABLE' || container.id === 'historialContainer') {
            // try to populate as table body if table exists
            let html = '';
            datosRiego.historialRiego.forEach(reg => {
                html += `
                    <tr class="hover:bg-slate-700/50 transition">
                        <td class="px-6 py-4 text-gray-300">${reg.fecha}</td>
                        <td class="px-6 py-4 text-gray-300">${reg.hora}</td>
                        <td class="px-6 py-4 text-gray-300">${reg.duracion}</td>
                        <td class="px-6 py-4 text-cyan-400 font-semibold">${reg.agua}</td>
                        <td class="px-6 py-4"><span class="px-3 py-1 bg-green-500/20 text-green-300 rounded-full text-sm font-semibold">✓ ${reg.estado}</span></td>
                    </tr>`;
            });
            container.innerHTML = html;
        }
    }

    // Automatic irrigation config helpers
    function loadAutoConfig() {
        const enabled = localStorage.getItem('autoEnabled') === '1';
        const minM = Number(localStorage.getItem('autoMinMoisture')) || 40;
        return { enabled, minM };
    }

    let lastAutoIrrigation = 0; // timestamp ms of last automatic irrigation
    const AUTO_COOLDOWN_MS = 30 * 1000; // 30s cooldown in demo (adjustable)

    function updateKPIs() {
        if (!window.datosRiego) return;
        if (window.useSimulator) {
            if (typeof datosRiego.generarSimulacion === 'function') {
                datosRiego.generarSimulacion();
                // mantener compatibilidad
                datosRiego.actual = datosRiego.datosActuales;
            } else {
                datosRiego.actualizarDatos();
            }
        }
        const d = datosRiego.datosActuales || datosRiego.actual || {};

        const setText = (id, value) => { const el = safe(id); if (el) el.textContent = value; };

        setText('kpi-temp', (d.temperatura || 0).toFixed(1));
        setText('kpi-moisture', Math.round(d.humedadSuelo || 0));
        setText('kpi-last-irrigation', Math.round(d.minutosUltimoRiego || 0));
        setText('kpi-next-irrigation', Math.round(d.minutosProximoRiego || 0) + ' min');
        setText('kpi-nutrients', Math.round(d.consumoNutrientes || 0));

        setText('sidebar-temp', (d.temperatura || 0).toFixed(1) + ' °C');
        setText('sidebar-humidity', Math.round(d.humedad || 0) + ' %');
        setText('sidebar-moisture', Math.round(d.humedadSuelo || 0) + ' %');
        setText('sidebar-tank', (d.tanque !== undefined ? Math.round(d.tanque) : 0) + '%');

        // After updating KPIs, evaluate automatic irrigation rules (system-wide)
        try {
            const cfg = loadAutoConfig();
            if (cfg.enabled) {
                // compute average soil moisture across plants
                const plants = datosRiego.plantas || [];
                if (plants.length) {
                    const avg = Math.round(plants.reduce((s,p)=>s + (p.humedad||0),0)/plants.length);
                    // if average below threshold and cooldown passed, perform automatic irrigation
                    const now = Date.now();
                    if (avg < cfg.minM && (now - lastAutoIrrigation) > AUTO_COOLDOWN_MS) {
                        performAutomaticIrrigation(avg, cfg.minM);
                        lastAutoIrrigation = now;
                    }
                }
            }
        } catch (e) { console.warn('Error evaluating automatic irrigation', e); }

        // Update charts if available
        if (window.graficos) {
            try {
                // Temp/Humedad chart
                if (graficos.tempHumedad && datosRiego.datosHistoricos) {
                    const g = graficos.tempHumedad;
                    if (g.data && g.data.datasets) {
                        g.data.labels = datosRiego.datosHistoricos.etiquetas;
                        if (g.data.datasets[0]) g.data.datasets[0].data = datosRiego.datosHistoricos.temperaturas;
                        if (g.data.datasets[1]) g.data.datasets[1].data = datosRiego.datosHistoricos.humedad;
                        g.update();
                    }
                }

                // Distribución de nutrientes
                if (graficos.nutrienteDist && typeof datosRiego.obtenerDistribucionNutrientes === 'function') {
                    const dnut = datosRiego.obtenerDistribucionNutrientes();
                    graficos.nutrienteDist.data.labels = dnut.etiquetas;
                    graficos.nutrienteDist.data.datasets[0].data = dnut.datos;
                    graficos.nutrienteDist.update();
                }

                // Nutrientes por planta
                if (graficos.nutrientePlanta && typeof datosRiego.obtenerNutrientesPorPlanta === 'function') {
                    const np = datosRiego.obtenerNutrientesPorPlanta();
                    graficos.nutrientePlanta.data.labels = np.etiquetas;
                    graficos.nutrientePlanta.data.datasets[0].data = np.datos;
                    graficos.nutrientePlanta.update();
                }

                // Eventos de riego
                if (graficos.eventosRiego && typeof datosRiego.obtenerEventosRiego === 'function') {
                    const ev = datosRiego.obtenerEventosRiego ? datosRiego.obtenerEventosRiego() : (datosRiego.eventosRiego || null);
                    if (ev) {
                        graficos.eventosRiego.data.labels = ev.etiquetas;
                        graficos.eventosRiego.data.datasets[0].data = ev.datos;
                        graficos.eventosRiego.update();
                    }
                }

                // Weekly temp/humidity
                if (graficos.tempSemanal && typeof datosRiego.obtenerTemperaturaSemanal === 'function') {
                    const ts = datosRiego.obtenerTemperaturaSemanal();
                    graficos.tempSemanal.data.labels = ts.etiquetas;
                    graficos.tempSemanal.data.datasets[0].data = ts.datos;
                    graficos.tempSemanal.update();
                }

                if (graficos.humedadSemanal && typeof datosRiego.obtenerHumedadSemanal === 'function') {
                    const hs = datosRiego.obtenerHumedadSemanal();
                    graficos.humedadSemanal.data.labels = hs.etiquetas;
                    graficos.humedadSemanal.data.datasets[0].data = hs.datos;
                    graficos.humedadSemanal.update();
                }

            } catch (e) { console.warn('Error actualizando gráficos', e); }
        }

        // Render alerts based on datosRiego.alertas
        function renderAlerts() {
            const cont = safe('alerts-container');
            if (!cont) return;
            cont.innerHTML = '';
            const alerts = datosRiego.alertas || [];

            if (!alerts.length) {
                const p = document.createElement('div');
                p.className = 'text-sm text-gray-400';
                p.textContent = 'Sin alertas';
                cont.appendChild(p);
                return;
            }

            alerts.forEach(a => {
                const wrap = document.createElement('div');
                const colorMap = { success: 'bg-green-600/20', info: 'bg-cyan-600/10', warning: 'bg-yellow-600/10', danger: 'bg-red-600/10' };
                const dotMap = { success: 'bg-green-500', info: 'bg-cyan-400', warning: 'bg-yellow-400', danger: 'bg-red-500' };
                const bg = colorMap[a.tipo] || 'bg-slate-700/30';
                const dot = dotMap[a.tipo] || 'bg-slate-400';

                wrap.className = `p-3 rounded-lg flex items-start gap-3 ${bg}`;
                wrap.innerHTML = `
                    <div class="w-8 h-8 rounded-full ${dot} flex items-center justify-center text-white font-bold">${a.icono || ''}</div>
                    <div>
                        <p class="font-semibold text-white mb-1">${a.titulo || ''}</p>
                        <p class="text-sm text-gray-300">${a.mensaje || ''}</p>
                    </div>
                `;
                cont.appendChild(wrap);
            });
        }

        // Actualizar la vista de alertas cada tick
        renderAlerts();

        // Re-render plants so their small values update
        renderPlants();
        renderHistorial();
    }

    // Primera renderización
    renderPlants();
    renderHistorial();
    updateKPIs();

    // Rellenar formulario de perfil con datos simulados o guardados
    function populateProfile() {
        const nameEl = safe('cuenta-nombre');
        const emailEl = safe('cuenta-correo');
        const storedEmail = localStorage.getItem('userEmail');
        const email = storedEmail || (datosRiego && datosRiego.userEmail) || '';
        if (emailEl) emailEl.value = email;

        if (nameEl) {
            // Buscar nombre en localStorage por email
            const storedName = email ? localStorage.getItem('userName:' + email.toLowerCase()) : null;
            if (storedName) {
                nameEl.value = storedName;
            } else if (datosRiego && datosRiego.userName) {
                nameEl.value = datosRiego.userName;
            } else if (email) {
                const prefix = email.split('@')[0];
                nameEl.value = prefix.charAt(0).toUpperCase() + prefix.slice(1).replace(/[.\d_-]/g,' ');
            } else {
                nameEl.value = 'Usuario Demo';
            }
        }

        // Limpiar campos de contraseña por seguridad
        const currentPwEl = safe('cuenta-current-password');
        const newPwEl = safe('cuenta-new-password');
        if (currentPwEl) currentPwEl.value = '';
        if (newPwEl) newPwEl.value = '';
    }

    populateProfile();

    // Conectar botones de navegación (.nav-item) para mostrar secciones
    function showSection(section) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section-content').forEach(s => s.classList.add('hidden'));
        // Mostrar la solicitada
        const el = document.getElementById(section + '-section');
        if (el) el.classList.remove('hidden');
    }

    document.querySelectorAll('.nav-item').forEach(btn => {
        btn.addEventListener('click', function (e) {
            const sec = btn.getAttribute('data-section');
            if (!sec) return;

            // Actualizar estado activo en la UI
            document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            // Mostrar sección correspondiente
            showSection(sec);
        });
    });

    // Botón ver historial
    const viewHistoryBtn = safe('view-history-btn');
    if (viewHistoryBtn) viewHistoryBtn.addEventListener('click', function() {
        showSection('history');
        // set active nav item to history
        document.querySelectorAll('.nav-item').forEach(b => b.classList.remove('active'));
        const histNav = document.querySelector('[data-section="history"]');
        if (histNav) histNav.classList.add('active');
    });

    // Cancel account button
    const cancelCuenta = safe('btn-cancel-cuenta');
    if (cancelCuenta) cancelCuenta.addEventListener('click', function() {
        // repopulate from stored values
        populateProfile();
    });

    // Start/Stop manual riego buttons (manual section)
    const btnStartManual = safe('btn-start-manual');
    if (btnStartManual) btnStartManual.addEventListener('click', function() {
        const durEl = safe('duracionManual');
        const minutes = durEl ? Math.max(1, Number(durEl.value) || 5) : 5;
        // Map 1 minute -> 1000ms for demo speed, cap at 60s
        const durationMs = Math.min(60000, minutes * 1000);
        setManualStatusActive(`Riego activo: ${minutes} min`, durationMs);
    });

    const btnStopManual = safe('btn-stop-manual');
    if (btnStopManual) btnStopManual.addEventListener('click', function() {
        clearManualStatus();
    });

    // Delegación: manejar botones que no tienen handler directo
    document.addEventListener('click', function(e) {
        const btn = e.target.closest('button');
        if (!btn) return;

        // Riego manual por planta
        if (btn.classList.contains('btn-plant-manual')) {
            const plantId = btn.getAttribute('data-plant-id');
            if (plantId) {
                performManualIrrigation(Number(plantId));
            }
        }
    });

    // Estado y timer para riego manual
    let manualIrrigationTimerId = null;
    function setManualStatusActive(text, durationMs) {
        const statusEl = safe('riegoManualStatus');
        if (statusEl) {
            statusEl.textContent = `✓ ${text}`;
            statusEl.className = 'mt-6 p-4 bg-green-500/20 rounded-lg text-green-300 text-center';
        }
        // Clear previous timer
        if (manualIrrigationTimerId) {
            clearTimeout(manualIrrigationTimerId);
            manualIrrigationTimerId = null;
        }
        // Set a demo timer to return to waiting state
        manualIrrigationTimerId = setTimeout(() => {
            // After simulated duration, reset status
            const s = safe('riegoManualStatus');
            if (s) {
                s.textContent = 'Sistema en espera';
                s.className = 'mt-6 p-4 bg-slate-700 rounded-lg text-center text-gray-300';
            }
            manualIrrigationTimerId = null;
        }, durationMs);
    }

    function clearManualStatus() {
        if (manualIrrigationTimerId) {
            clearTimeout(manualIrrigationTimerId);
            manualIrrigationTimerId = null;
        }
        const s = safe('riegoManualStatus');
        if (s) {
            s.textContent = 'Sistema en espera';
            s.className = 'mt-6 p-4 bg-slate-700 rounded-lg text-center text-gray-300';
        }
    }

    // Acción: riego manual de una planta
    function performManualIrrigation(plantId) {
        const planta = datosRiego.plantas.find(p => p.id === plantId);
        if (!planta) return alert('Planta no encontrada');

        // Consumir agua del tanque según la necesidad de la planta (litros -> % tanque)
        const litros = planta.agua || 2;
        const percentPerL = 2; // 1 L = 2% tanque (simulado)
        const consume = Math.min(datosRiego.datosActuales.tanque, Math.round(litros * percentPerL));
        datosRiego.datosActuales.tanque = Math.max(0, datosRiego.datosActuales.tanque - consume);

        // Actualizar planta: humedad aumenta y último riego actual
        planta.humedad = Math.min(100, Math.round(planta.humedad + 10));
        const now = new Date();
        const hh = now.getHours().toString().padStart(2,'0');
        const mm = now.getMinutes().toString().padStart(2,'0');
        planta.ultimoRiego = `${hh}:${mm}`;

        // Añadir al historial
        datosRiego.historialRiego.unshift({ fecha: now.toISOString().slice(0,10), hora: `${hh}:${mm}`, duracion: '5 min', agua: `${litros.toFixed(1)} L`, estado: 'Manual' });
        // limitar historial a 50
        if (datosRiego.historialRiego.length > 50) datosRiego.historialRiego.pop();

        // Reset minutos desde último riego y ajustar próximo riego
        datosRiego.datosActuales.minutosUltimoRiego = 0;
        datosRiego.datosActuales.minutosProximoRiego = 60;

        // Actualizar UI
        updateKPIs();
        // Mostrar estado de riego activo por 5s (demo)
        setManualStatusActive(`Riego activo para ${planta.nombre}: 5 min`, 5000);
        alert(`Riego manual iniciado para ${planta.nombre}: ${litros} L (consumió ${consume}% del tanque)`);
    }

    // Riego automático: regar solo plantas por debajo del umbral
    function performAutomaticIrrigation(currentAvg, threshold) {
        try {
            const plants = datosRiego.plantas || [];
            if (!plants.length) return;

            // Seleccionar solo las plantas con humedad < threshold
            const below = plants.filter(p => (p.humedad || 0) < threshold);
            if (!below.length) {
                // No hay plantas para regar; añadir alerta informativa
                datosRiego.alertas = datosRiego.alertas || [];
                datosRiego.alertas.unshift({ titulo: 'Riego automático (omitido)', mensaje: `No se encontraron plantas por debajo del umbral ${threshold}%. Humedad media ${currentAvg}%.`, tipo: 'info', icono: 'i' });
                if (datosRiego.alertas.length > 10) datosRiego.alertas.pop();
                // Actualizar indicadores (esto mostrará la alerta en la UI)
                updateKPIs();
                return;
            }

            const litrosPorPlanta = 1.5; // L por planta (demo)
            let totalLitros = 0;

            below.forEach(p => {
                p.humedad = Math.min(100, Math.round((p.humedad || 20) + 8 + Math.random() * 12));
                const now = new Date();
                const hh = now.getHours().toString().padStart(2,'0');
                const mm = now.getMinutes().toString().padStart(2,'0');
                p.ultimoRiego = `${hh}:${mm}`;
                totalLitros += litrosPorPlanta;
            });

            // Consumo en tanque (demo): 1 L = 2% tanque
            const tankBefore = datosRiego.datosActuales.tanque || 0;
            const tankConsumption = Math.round(totalLitros * 2);
            datosRiego.datosActuales.tanque = Math.max(0, tankBefore - tankConsumption);

            // Añadir entrada al historial (resumen)
            const now = new Date();
            const hh = now.getHours().toString().padStart(2,'0');
            const mm = now.getMinutes().toString().padStart(2,'0');
            const plantNames = below.map(p => p.nombre).slice(0,5).join(', ') + (below.length > 5 ? ', ...' : '');
            datosRiego.historialRiego.unshift({ fecha: now.toISOString().slice(0,10), hora: `${hh}:${mm}`, duracion: 'Auto', agua: `${totalLitros.toFixed(1)} L`, estado: 'Automático' });
            if (datosRiego.historialRiego.length > 100) datosRiego.historialRiego.pop();

            // Generar alerta informativa
            datosRiego.alertas = datosRiego.alertas || [];
            datosRiego.alertas.unshift({ titulo: 'Riego automático', mensaje: `Riego automático ejecutado para ${below.length} planta(s): ${plantNames}. Humedad media ${currentAvg}% (umbral ${threshold}%).`, tipo: 'info', icono: 'A' });
            if (datosRiego.alertas.length > 10) datosRiego.alertas.pop();

            // Actualizar UI
            renderPlants();
            renderHistorial();
            updateKPIs();
        } catch (err) {
            console.error('Error en riego automático:', err);
        }
    }

    // Botón para forzar recalculo/actualización de gráficos si existe
    const refreshChartsBtn = safe('refresh-charts-btn');
    if (refreshChartsBtn) refreshChartsBtn.addEventListener('click', function() {
        const g = (window.graficos && Object.keys(window.graficos).length) ? window.graficos : (typeof graficos !== 'undefined' ? graficos : null);
        if (!g) return alert('No hay gráficos inicializados todavía');
        Object.values(g).forEach(ch => {
            try { ch.update(); if (typeof ch.resize === 'function') ch.resize(); } catch(e) { /* ignore */ }
        });
        alert('Gráficos recalculados');
    });

    // Inicializar la sección activa (por defecto 'overview')
    const initial = document.querySelector('.nav-item.active') || document.querySelector('[data-section="overview"]');
    if (initial) {
        const s = initial.getAttribute('data-section');
        if (s) showSection(s);
    }

    // Actualizar cada 5 segundos
    setInterval(updateKPIs, 5000);

})();