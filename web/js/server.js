const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

let sensorData = {
  temperatura: 24.5,
  humedad: 68,
  humedadSuelo: 52
};

app.get('/api/sensor', (req, res) => {
  res.json(sensorData);
});

app.post('/api/sensor', (req, res) => {
  const { temperatura, humedad, humedadSuelo } = req.body;

  if (temperatura !== undefined) sensorData.temperatura = temperatura;
  if (humedad !== undefined) sensorData.humedad = humedad;
  if (humedadSuelo !== undefined) sensorData.humedadSuelo = humedadSuelo;

  console.log('Datos recibidos:', sensorData);
  res.json({ ok: true });
});

app.listen(port, () => {
  console.log(`Servidor escuchando en http://localhost:${port}`);
});