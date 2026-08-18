// Funciones de interfaz de usuario

function handleLogin(event) {
    event.preventDefault();
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (email && password) {
        document.getElementById('loginScreen').classList.add('hidden');
        document.getElementById('dashboardScreen').classList.remove('hidden');
        cambiarPagina('resumen');
    } else {
        alert('Por favor completa todos los campos');
    }
}

function cerrarSesion() {
    if (confirm('¿Deseas cerrar sesión?')) {
        document.getElementById('loginScreen').classList.remove('hidden');
        document.getElementById('dashboardScreen').classList.add('hidden');
        document.getElementById('loginForm').reset();
    }
}

function cambiarPagina(pagina) {
    // Ocultar todas las páginas
    document.querySelectorAll('.pageContent').forEach(p => {
        p.classList.add('hidden');
    });

    // Mostrar la página solicitada
    const pag = document.getElementById('pag' + pagina.charAt(0).toUpperCase() + pagina.slice(1));
    if (pag) {
        pag.classList.remove('hidden');
    }
}

function iniciarRiego() {
    const duracion = document.getElementById('duracionManual').value;
    document.getElementById('riegoManualStatus').textContent = `✓ Riego activo: ${duracion} minutos`;
    document.getElementById('riegoManualStatus').className = 'mt-6 p-4 bg-green-500/20 rounded-lg text-green-300 text-center';
}

function detenerRiego() {
    document.getElementById('riegoManualStatus').textContent = 'Sistema en espera';
    document.getElementById('riegoManualStatus').className = 'mt-6 p-4 bg-slate-700 rounded-lg text-center text-gray-300';
}

function descargarReporte() {
    const contenido = `REPORTE DEL SISTEMA DE RIEGO AUTOMATIZADO
Fecha: ${new Date().toLocaleString()}

=== DATOS ACTUALES ===
Temperatura: ${document.getElementById('kpiTemp').textContent}°C
Humedad del Suelo: ${document.getElementById('kpiHumedad').textContent}%
Último Riego: ${document.getElementById('kpiUltimoRiego').textContent} minutos atrás
Consumo de Nutrientes: ${document.getElementById('kpiNutrientes').textContent} ml

=== PLANTAS MONITOREADAS ===
Planta 01 - Temperatura: 24.2°C, Humedad: 64%
Planta 02 - Temperatura: 24.7°C, Humedad: 58%
Planta 03 - Temperatura: 23.9°C, Humedad: 72%
Planta 04 - Temperatura: 25.1°C, Humedad: 45%
Planta 05 - Temperatura: 24.4°C, Humedad: 68%

=== ESTADO DEL SISTEMA ===
Bomba: ACTIVA
Sensores: TODOS OK
Nutrientes: ADECUADOS
Tanque de Agua: 65%

=== RECOMENDACIONES ===
- Mantener vigilancia en Planta 04 (humedad baja)
- Próximo mantenimiento de bomba en 30 días
- Considerar recarga de tanque cuando alcance 20%

Generado automáticamente por el Sistema de Riego`;

    const blob = new Blob([contenido], { type: 'text/plain;charset=utf-8' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = `Reporte_Riego_${new Date().getTime()}.txt`;
    link.click();
}

function actualizarKPIs() {
    datosRiego.actualizarDatos();
    document.getElementById('kpiTemp').textContent = Math.round(datosRiego.actual.temperatura * 10) / 10;
    document.getElementById('kpiHumedad').textContent = Math.round(datosRiego.actual.humedadSuelo);
    document.getElementById('kpiUltimoRiego').textContent = datosRiego.actual.ultimoRiego;
    document.getElementById('kpiNutrientes').textContent = Math.round(datosRiego.actual.nutrientes);
    
    // Actualizar también en páginas individuales
    document.getElementById('tempActual').textContent = Math.round(datosRiego.actual.temperatura * 10) / 10;
    document.getElementById('humedadActual').textContent = Math.round(datosRiego.actual.humedad);
    document.getElementById('humedadSueloActual').textContent = Math.round(datosRiego.actual.humedadSuelo);
}
        
        // Mostrar sección
        this.mostrarSeccion(seccion);
    }

    mostrarSeccion(seccion) {
        // Ocultar todas las secciones
        document.querySelectorAll('.section-content').forEach(s => {
            s.classList.add('hidden');
        });

        // Mostrar la sección seleccionada
        const elemento = document.getElementById(`${seccion}-section`);
        if (elemento) {
            elemento.classList.remove('hidden');
        }

        this.seccionActual = seccion;
    }

    actualizarKPIs() {
        const datos = datosRiego.datosActuales;

        const kpiTemp = document.getElementById('kpi-temp');
        if (kpiTemp) kpiTemp.textContent = datos.temperatura.toFixed(1);

        const kpiMoisture = document.getElementById('kpi-moisture');
        if (kpiMoisture) kpiMoisture.textContent = Math.round(datos.humedadSuelo);

        const kpiLastIrrigation = document.getElementById('kpi-last-irrigation');
        if (kpiLastIrrigation) kpiLastIrrigation.textContent = Math.round(datos.minutosUltimoRiego);

        const kpiNextIrrigation = document.getElementById('kpi-next-irrigation');
        if (kpiNextIrrigation) kpiNextIrrigation.textContent = Math.round(datos.minutosProximoRiego) + ' min';

        const kpiNutrients = document.getElementById('kpi-nutrients');
        if (kpiNutrients) kpiNutrients.textContent = Math.round(datos.consumoNutrientes);

        // Sidebar
        const sidebarTemp = document.getElementById('sidebar-temp');
        if (sidebarTemp) sidebarTemp.textContent = datos.temperatura.toFixed(1) + ' °C';

        const sidebarHumidity = document.getElementById('sidebar-humidity');
        if (sidebarHumidity) sidebarHumidity.textContent = Math.round(datos.humedad) + ' %';

        const sidebarMoisture = document.getElementById('sidebar-moisture');
        if (sidebarMoisture) sidebarMoisture.textContent = Math.round(datos.humedadSuelo) + ' %';
    }

    renderizarAlertas() {
        const contenedor = document.getElementById('alerts-container');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';

        datosRiego.alertas.forEach(alerta => {
            const elemento = document.createElement('div');
            elemento.className = `alert ${alerta.tipo}`;
            elemento.innerHTML = `
                <span class="text-lg">${alerta.icono}</span>
                <div>
                    <p class="font-semibold">${alerta.titulo}</p>
                    <p class="text-sm opacity-90">${alerta.mensaje}</p>
                </div>
            `;
            contenedor.appendChild(elemento);
        });
    }

    renderizarPlantas() {
        const contenedor = document.getElementById('plants-container');
        if (!contenedor) return;
        
        contenedor.innerHTML = '';

        datosRiego.plantas.forEach(planta => {
            const tarjeta = document.createElement('div');
            tarjeta.className = 'bg-gradient-to-br from-slate-800 to-slate-700 rounded-2xl p-6 border border-blue-500/20 shadow-lg';
            tarjeta.innerHTML = `
                <h3 class="text-lg font-semibold mb-4">${planta.nombre}</h3>
                <div class="space-y-3 text-sm">
                    <div class="flex justify-between">
                        <span class="text-gray-400">Temperatura</span>
                        <span class="text-orange-400 font-semibold">${planta.temp.toFixed(1)} °C</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Humedad del Suelo</span>
                        <span class="text-cyan-400 font-semibold">${planta.humedad} %</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Agua</span>
                        <span class="text-blue-400 font-semibold">${planta.agua} L</span>
                    </div>
                    <div class="flex justify-between">
                        <span class="text-gray-400">Nutrientes</span>
                        <span class="text-purple-400 font-semibold">${planta.nutrientes} ml</span>
                    </div>
                    <div class="flex justify-between pt-3 border-t border-slate-600">
                        <span class="text-gray-400">Último Riego</span>
                        <span class="text-gray-300 font-semibold">${planta.ultimoRiego}</span>
                    </div>
                </div>
            `;
            contenedor.appendChild(tarjeta);
        });
    }

    descargarReporte() {
        const datos = datosRiego.datosActuales;
        const plantas = datosRiego.plantas;

        let contenido = 'REPORTE DEL SISTEMA DE RIEGO INTELIGENTE\n';
        contenido += '=====================================\n\n';
        contenido += `Generado: ${new Date().toLocaleString()}\n\n`;

        contenido += 'ESTADO ACTUAL\n';
        contenido += '─────────────\n';
        contenido += `Temperatura: ${datos.temperatura.toFixed(1)} °C\n`;
        contenido += `Humedad: ${datos.humedad.toFixed(1)} %\n`;
        contenido += `Humedad del Suelo: ${datos.humedadSuelo.toFixed(1)} %\n`;
        contenido += `Consumo de Nutrientes: ${datos.consumoNutrientes.toFixed(1)} ml\n`;
        contenido += `Último Riego: ${datos.minutosUltimoRiego} minutos atrás\n`;
        contenido += `Próximo Riego: ${datos.minutosProximoRiego} minutos\n\n`;

        contenido += 'DETALLES DE PLANTAS\n';
        contenido += '──────────────────\n';
        plantas.forEach(planta => {
            contenido += `\n${planta.nombre}\n`;
            contenido += `  Temperatura: ${planta.temp} °C\n`;
            contenido += `  Humedad del Suelo: ${planta.humedad} %\n`;
            contenido += `  Agua: ${planta.agua} L\n`;
            contenido += `  Nutrientes: ${planta.nutrientes} ml\n`;
            contenido += `  Último Riego: ${planta.ultimoRiego}\n`;
        });

        contenido += '\n\nFIN DEL REPORTE\n';

        const elemento = document.createElement('a');
        elemento.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(contenido));
        elemento.setAttribute('download', `reporte-riego-${new Date().getTime()}.txt`);
        elemento.style.display = 'none';
        document.body.appendChild(elemento);
        elemento.click();
        document.body.removeChild(elemento);

        alert('Reporte descargado correctamente');
    }
}

const gestorInterfaz = new GestorInterfaz();