# 🌱 Dashboard de Sistema de Riego Automatizado

Un panel de control completo y moderno para monitoreo y gestión de un sistema de riego automático.

## ✨ Características Principales

### 1. **Autenticación**
- Login con email y contraseña (sin validación real)
- Cerrar sesión desde el menú
- Sesión persistente en la página

### 2. **Interfaz Responsive**
- Diseño dark mode profesional
- Compatible con desktop, tablet y mobile
- Colores: Azul marino, Cyan, Morado, Naranja
- Tailwind CSS + CSS personalizado

### 3. **Panel de Monitoreo (Resumen)**
- **4 Tarjetas KPI:**
  - Temperatura Actual (°C)
  - Humedad del Suelo (%)
  - Último Riego (minutos atrás)
  - Consumo de Nutrientes (ml)

- **Gráficos Interactivos:**
  - Gráfico de línea: Temperatura y Humedad (7 horas)
  - Gráfico de barras: Frecuencia de Riego (últimos 5)
  - Gráfico circular: Distribución de Nutrientes
  - Gráfico circular: Consumo por Planta
  - Gráfico de barras: Eventos por Día de la Semana

- **Alertas del Sistema:**
  - ✓ Sistema Óptimo
  - ℹ️ Información de Estado
  - ⚠️ Advertencias

### 4. **Menú Lateral Completo**

#### PERFIL
- Mi Cuenta
- Cerrar Sesión

#### MONITOREO
- Resumen (página principal)
- Gráficos (análisis detallados)
- Plantas (monitoreo individual)

#### RIEGO
- Automático (configuración del sistema)
- Manual (controles rápidos)
- Programación (crear horarios)
- Historial (tabla de eventos)

#### ESTADO AMBIENTAL
- Temperatura
- Humedad del Aire
- Humedad del Suelo

#### ESTADO DEL SISTEMA
- Bomba
- Sensores
- Nutrientes
- Tanque de Agua

#### DESCARGAS
- Descargar Reporte en texto

## 📊 Páginas Disponibles

### Resumen
- Vista principal con KPIs y gráficos
- Actualización en tiempo real cada 5 segundos
- Alertas del sistema

### Gráficos Detallados
- Temperatura semanal
- Humedad semanal

### Plantas
- Tarjetas individuales para 5 plantas
- Monitoreo de: Temperatura, Humedad, Agua, Nutrientes, Último Riego

### Riego Automático
- Configuración de intervalo (minutos)
- Duración del riego (minutos)
- Humedad objetivo (%)
- Botón Guardar

### Riego Manual
- Botón Iniciar Riego (verde)
- Botón Detener Riego (rojo)
- Campo de duración

### Programación
- Lista de programaciones activas
- Formulario para agregar nuevas programaciones
- Especificar hora y duración

### Historial
- Tabla con registros de riego
- Columnas: Fecha, Hora, Duración, Agua Usada, Estado

### Mi Cuenta
- Campos editables: Nombre, Email, Nombre de Granja
- Preferencias: Notificaciones, Alertas, Reportes

### Estado Ambiental
- Páginas individuales para Temperatura, Humedad, Humedad del Suelo
- Valores actuales con rangos óptimos

### Estado del Sistema
- Página Bomba: Estado y especificaciones
- Página Sensores: Estado de todos los sensores
- Página Nutrientes: Gráficos de disponibilidad
- Página Tanque de Agua: Nivel y capacidad

## 🛠️ Tecnologías Utilizadas

- **HTML5** - Estructura semántica
- **CSS3** - Estilos modernos
- **Tailwind CSS** - Framework de diseño
- **JavaScript Vanilla** - Sin frameworks
- **Chart.js** - Gráficos interactivos

## 📁 Estructura de Carpetas

```
smart-irrigation-dashboard/
├── index.html              # Página principal
├── css/
│   └── styles.css         # Estilos personalizados
├── js/
│   ├── data.js            # Datos simulados
│   ├── charts.js          # Inicialización de gráficos
│   ├── ui.js              # Lógica de interfaz
│   ├── app.js             # Inicialización de la app
│   └── script.js          # Funciones adicionales
├── assets/
│   └── img/               # Imágenes
└── pages/                 # Páginas adicionales
```

## 🚀 Cómo Usar

1. **Abrir el archivo:** Abre `index.html` en tu navegador
2. **Login:** Usa cualquier email y contraseña
3. **Navegar:** Usa el menú lateral para cambiar de sección
4. **Interactuar:** 
   - Los gráficos se actualizan automáticamente
   - Los valores de KPI cambian cada 5 segundos
   - Los formularios pueden diligenciarse y guardarse
5. **Descargar Reporte:** Haz clic en "Descargar Reporte" para obtener un archivo de texto

## 📊 Datos Simulados

- Los datos se actualizan cada 5 segundos
- Los valores cambian aleatoriamente dentro de rangos realistas
- 5 plantas monitoreadas
- Historial de 5 riegos anteriores
- 3 programaciones de ejemplo

## 🎨 Personalización

### Colores Principales
- **Azul Marino:** #0f172a
- **Cyan:** #06b6d4
- **Morado:** #a855f7
- **Naranja:** #f97316

### Modificar Datos
Edita el archivo `js/data.js` para cambiar:
- Número de plantas
- Valores iniciales
- Historiales
- Programaciones

## 📝 Notas

- No requiere backend - todo es simulado
- Sin validación real de credenciales
- Compatible con todos los navegadores modernos
- Completamente responsive
- Código limpio y bien organizado

## ✅ Estado

✓ Autenticación funcional
✓ Navegación entre secciones
✓ Gráficos interactivos
✓ Actualización en tiempo real
✓ Responsive design
✓ Todos los formularios funcionales
✓ Descarga de reportes

---

**Proyecto:** Sistema de Riego Automatizado  
**Versión:** 1.0  
**Última actualización:** 2024
