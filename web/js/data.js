class DatosRiego {
    constructor() {
        // Usar nombres de cultivos reales en vez de 'Planta 01..'
        this.plantas = [
            { id: 1, nombre: 'Tomate', temp: 24.2, humedad: 64, agua: 1.8, nutrientes: 32, ultimoRiego: '14:30' },
            { id: 2, nombre: 'Lechuga', temp: 24.7, humedad: 58, agua: 2.1, nutrientes: 28, ultimoRiego: '14:10' },
            { id: 3, nombre: 'Fresa', temp: 23.9, humedad: 72, agua: 2.3, nutrientes: 35, ultimoRiego: '14:45' },
            { id: 4, nombre: 'Albahaca', temp: 25.1, humedad: 45, agua: 1.5, nutrientes: 22, ultimoRiego: '13:50' },
            { id: 5, nombre: 'Pimiento', temp: 24.4, humedad: 68, agua: 2.0, nutrientes: 30, ultimoRiego: '14:25' },
        ];

        this.datosActuales = {
            temperatura: 24.5,
            humedad: 68,
            humedadSuelo: 52,
            consumoNutrientes: 245,
            minutosUltimoRiego: 10,
            minutosProximoRiego: 35,
            tanque: Math.floor(60 + Math.random() * 40) // porcentaje inicial aleatorio 60-99
        };

        this.datosHistoricos = this.generarDatosHistoricos();
        this.alertas = this.generarAlertas();

        // Historial de riegos (simulado)
        this.historialRiego = [
            { fecha: '2026-08-12', hora: '08:00', duracion: '10 min', agua: '2.4 L', estado: 'Completado' },
            { fecha: '2026-08-11', hora: '14:30', duracion: '12 min', agua: '2.6 L', estado: 'Completado' },
            { fecha: '2026-08-10', hora: '18:00', duracion: '8 min',  agua: '2.0 L', estado: 'Completado' },
        ];

        // Programaciones de riego (simuladas)
        this.programaciones = [
            { id: 1, hora: '08:00', duracion: 10 },
            { id: 2, hora: '14:00', duracion: 12 },
        ];
    }

    generarDatosHistoricos() {
        const horas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        const temperaturas = [22.1, 23.4, 25.2, 26.8, 25.5, 24.2, 23.1];
        const humedad = [65, 62, 58, 52, 55, 62, 68];

        return {
            etiquetas: horas,
            temperaturas,
            humedad,
        };
    }

    generarAlertas() {
        return [
            {
                tipo: 'success',
                icono: '✓',
                titulo: 'Riego Completado',
                mensaje: 'Grupo de plantas A regado exitosamente a las 14:30.',
            },
            {
                tipo: 'info',
                icono: 'ℹ',
                titulo: 'Estado del Sistema',
                mensaje: 'Todos los sensores están en línea y funcionando correctamente.',
            },
            {
                tipo: 'warning',
                icono: '⚠',
                titulo: 'Baja Humedad del Suelo',
                mensaje: 'Planta 04 requiere riego. Nivel de humedad: 45%',
            },
        ];
    }

    actualizarDatos() {
        this.datosActuales.temperatura += (Math.random() - 0.5) * 0.5;
        this.datosActuales.humedad += (Math.random() - 0.5) * 2;
        this.datosActuales.humedadSuelo += (Math.random() - 0.5) * 2;
        this.datosActuales.consumoNutrientes += Math.random() * 2;
        this.datosActuales.minutosUltimoRiego += 1;

        this.datosActuales.temperatura = Math.max(20, Math.min(30, this.datosActuales.temperatura));
        this.datosActuales.humedad = Math.max(30, Math.min(90, this.datosActuales.humedad));
        this.datosActuales.humedadSuelo = Math.max(20, Math.min(80, this.datosActuales.humedadSuelo));

        // Simular consumo o recarga del tanque de agua (disminuye lentamente o varía un poco)
        const deltaTank = (Math.random() - 0.3) * 1.5; // tiende a disminuir
        this.datosActuales.tanque = Math.round(Math.max(0, Math.min(100, this.datosActuales.tanque + deltaTank)));

        // También actualizar métricas por planta de forma simple
        this.plantas.forEach(p => {
            p.temp += (Math.random() - 0.5) * 0.3;
            p.humedad += (Math.random() - 0.5) * 1.5;
            p.agua = Math.max(0, +(p.agua + (Math.random() - 0.5) * 0.1).toFixed(2));
        });

        return this.datosActuales;
    }

    obtenerDistribucionNutrientes() {
        if (this.distribucionNutrientes) return this.distribucionNutrientes;
        return {
            etiquetas: ['Nitrógeno', 'Fósforo', 'Potasio', 'Micronutrientes'],
            datos: [35, 25, 30, 10],
            colores: ['#f97316', '#3b82f6', '#10b981', '#8b5cf6'],
        };
    }

    obtenerNutrientesPorPlanta() {
        if (this.nutrientesPorPlanta) return this.nutrientesPorPlanta;
        return {
            etiquetas: ['Planta 01', 'Planta 02', 'Planta 03', 'Planta 04', 'Planta 05'],
            datos: [22, 18, 25, 15, 20],
            colores: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6'],
        };
    }

    obtenerEventosRiego() {
        if (this.eventosRiego) return this.eventosRiego;
        return {
            etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datos: [4, 3, 5, 2, 6, 4, 3],
        };
    }

    obtenerTemperaturaSemanal() {
        if (this.tempSemanal) return this.tempSemanal;
        return {
            etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datos: [22.5, 23.1, 24.8, 25.3, 24.9, 23.6, 22.8],
        };
    }

    obtenerHumedadSemanal() {
        if (this.humedadSemanal) return this.humedadSemanal;
        return {
            etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datos: [65, 62, 58, 55, 60, 68, 70],
        };
    }

    // Genera una simulación completa y aleatoria para la UI
    generarSimulacion() {
        const rnd = (min, max) => Math.random() * (max - min) + min;
        const rndInt = (min, max) => Math.round(rnd(min, max));
        const pad = n => (n < 10 ? '0' + n : '' + n);
        const randomTime = () => `${pad(rndInt(6, 20))}:${pad(rndInt(0,59))}`;

        // Datos actuales aleatorios
        this.datosActuales = {
            temperatura: +rnd(18, 30).toFixed(1),
            humedad: rndInt(30, 90),
            humedadSuelo: rndInt(20, 80),
            consumoNutrientes: Math.round(rnd(50, 400)),
            minutosUltimoRiego: rndInt(0, 120),
            minutosProximoRiego: rndInt(5, 240),
            tanque: rndInt(10, 100),
        };

        // Plantas aleatorias (mantener ids y nombres)
        this.plantas = this.plantas.map((p, idx) => ({
            id: p.id,
            nombre: p.nombre,
            temp: +rnd(18, 28).toFixed(1),
            humedad: rndInt(30, 85),
            agua: +rnd(0.8, 3.5).toFixed(2),
            nutrientes: rndInt(10, 60),
            ultimoRiego: randomTime(),
        }));

        // Datos históricos (7 puntos)
        const etiquetas = ['08:00', '10:00', '12:00', '14:00', '16:00', '18:00', '20:00'];
        const temperaturas = etiquetas.map(() => +rnd(18, 30).toFixed(1));
        const humedad = etiquetas.map(() => rndInt(30, 85));
        this.datosHistoricos = { etiquetas, temperaturas, humedad };

        // Eventos de riego por día (7 días)
        this.eventosRiego = {
            etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'],
            datos: Array.from({length:7}, () => rndInt(1, 6))
        };

        // Datos semanales para temperatura/humedad
        this.tempSemanal = { etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], datos: Array.from({length:7}, () => +rnd(18,30).toFixed(1)) };
        this.humedadSemanal = { etiquetas: ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'], datos: Array.from({length:7}, () => rndInt(35,85)) };

        // Distribución de nutrientes aleatoria
        this.distribucionNutrientes = {
            etiquetas: ['Nitrógeno', 'Fósforo', 'Potasio', 'Micronutrientes'],
            datos: (() => { const a = [rnd(20,45), rnd(10,35), rnd(10,40), rnd(5,20)]; const tot = a.reduce((s,x)=>s+x,0); return a.map(x=>Math.round((x/tot)*100)); })(),
            colores: ['#f97316', '#3b82f6', '#10b981', '#8b5cf6']
        };

        // Nutrientes por planta
        this.nutrientesPorPlanta = {
            etiquetas: this.plantas.map(p=>p.nombre),
            datos: this.plantas.map(()=> rndInt(10,40)),
            colores: ['#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1', '#8b5cf6']
        };

        // Historial de riego (5 entradas)
        const historial = [];
        for (let i = 0; i < 5; i++) {
            const daysAgo = i;
            const d = new Date();
            d.setDate(d.getDate() - daysAgo);
            const fecha = d.toISOString().slice(0,10);
            historial.push({
                fecha,
                hora: randomTime(),
                duracion: `${rndInt(5, 20)} min`,
                agua: `${(rnd(1.5, 3.5)).toFixed(1)} L`,
                estado: 'Completado'
            });
        }
        this.historialRiego = historial;

        // Programaciones (3 entradas)
        this.programaciones = [
            { id: 1, hora: '08:00', duracion: rndInt(5, 20) },
            { id: 2, hora: '13:00', duracion: rndInt(5, 20) },
            { id: 3, hora: '18:00', duracion: rndInt(5, 20) },
        ];

        // Alertas basadas en umbrales y condiciones realistas
        const alertas = [];

        // Tanque bajo
        if (this.datosActuales.tanque < 20) {
            alertas.push({ tipo: 'danger', icono: '⛔', titulo: 'Tanque de agua bajo', mensaje: `Nivel de agua: ${this.datosActuales.tanque}%. Reponer tanque para evitar cortes en riego.` });
        } else if (this.datosActuales.tanque < 40) {
            alertas.push({ tipo: 'warning', icono: '⚠', titulo: 'Tanque de agua reducido', mensaje: `Nivel de agua: ${this.datosActuales.tanque}%. Planificar recarga pronto.` });
        }

        // Plantas con baja humedad y recomendaciones por cultivo
        this.plantas.forEach(p => {
            if (p.humedad < 35) {
                alertas.push({
                    tipo: 'warning',
                    icono: '💧',
                    titulo: `${p.nombre} requiere riego`,
                    mensaje: `${p.nombre} tiene humedad ${p.humedad}%. Programar riego inmediato para evitar estrés.`
                });
            }
            // Nutrientes bajos
            if (p.nutrientes < 18) {
                alertas.push({
                    tipo: 'warning',
                    icono: '🌱',
                    titulo: `${p.nombre} baja de nutrientes`,
                    mensaje: `${p.nombre} muestra nivel de nutrientes ${p.nutrientes} ml. Considerar fertilización.`
                });
            }
            // Temperatura extrema por planta (si aplica)
            if (p.temp > 30) {
                alertas.push({
                    tipo: 'info',
                    icono: '🌡️',
                    titulo: `${p.nombre} - temperatura alta`,
                    mensaje: `Temperatura ${p.temp}°C. Monitorizar para evitar estrés por calor.`
                });
            }
        });

        // Temperatura ambiente alta
        if (this.datosActuales.temperatura > 29) {
            alertas.push({ tipo: 'warning', icono: '🔥', titulo: 'Alta temperatura ambiente', mensaje: `Temperatura ambiente ${this.datosActuales.temperatura}°C. Vigilar ventilación y riego.` });
        }

        // Evento aleatorio: fallo de bomba (baja probabilidad)
        if (Math.random() < 0.02) {
            alertas.push({ tipo: 'danger', icono: '🔌', titulo: 'Posible fallo de bomba', mensaje: 'Se ha detectado una posible caída en el rendimiento de la bomba. Revisar conexiones y estado.' });
        }

        // Información general (no sustituye las alertas operativas)
        alertas.push({ tipo: 'info', icono: 'ℹ', titulo: 'Estado de simulación', mensaje: 'Datos generados para demostración; las alertas reflejan condiciones típicas de un sistema de riego.' });

        this.alertas = alertas;
    }
}

const datosRiego = new DatosRiego();
// Generar estado inicial aleatorio para toda la página
if (typeof datosRiego.generarSimulacion === 'function') datosRiego.generarSimulacion();
// Alias para compatibilidad con otros módulos
window.datosRiego = datosRiego;
// Algunas implementaciones esperan `datosRiego.actual`
datosRiego.actual = datosRiego.datosActuales;