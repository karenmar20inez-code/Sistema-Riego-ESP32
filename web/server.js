const express = require('express');
const path = require('path');
const app = express();

app.use(express.json());

// almacenamiento en memoria del último dato recibido
let ultimoSensor = null;

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Servir archivos estáticos (index.html, js/, css/, etc.) desde la carpeta del proyecto
app.use(express.static(path.join(__dirname)));

// Devuelve último dato recibido (útil para la web)
app.get('/api/sensor', (req, res) => {
  if (!ultimoSensor) return res.json({ ok: false, mensaje: 'No hay datos aún' });
  res.json({ ok: true, data: ultimoSensor });
});

// Recibe datos del ESP32
app.post('/api/sensor', (req, res) => {
  const data = req.body || {};
  // Añadimos timestamp en servidor
  data.recibidoEn = new Date().toISOString();
  ultimoSensor = data;

  // Log claro en la consola indicando si la humedad de suelo es simulada
  if (data.humedadSueloSimulada) {
    console.log(`[SIMULADO] Datos recibidos: temp=${data.temperatura}°C hum=${data.humedad}% suelo(sim)= ${data.humedadSuelo}%.`);
  } else {
    console.log(`Datos recibidos: temp=${data.temperatura}°C hum=${data.humedad}% suelo=${data.humedadSuelo}%.`);
  }

  res.json({ ok: true, mensaje: 'Datos recibidos', data });
});

// Si se accede a la raíz, servir index.html (útil si abres http://<TU_IP>:3000)
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, '0.0.0.0', () => {
  console.log('Servidor escuchando en http://0.0.0.0:' + PORT);
});