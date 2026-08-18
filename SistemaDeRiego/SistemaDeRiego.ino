#include <WiFi.h>
#include <WebServer.h>
#include <DHT.h>

const char* ssid = "INFINITUM5E27";
const char* password = "Hz6stSeSY3";

// Creamos el servidor web en el puerto 80
WebServer server(80);

// ===== Sensor DHT11 =====
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Variables globales para mantener el último valor leído
float temperaturaActual = 24.0;
float humedadActual = 50.0;
int humedadSueloActual = 50;

void setup() {
  Serial.begin(115200);
  dht.begin();
  
  // Semilla para el random de la humedad de suelo
  randomSeed(analogRead(34));

  // Conexión WiFi
  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  
  // Mostrar la IP en el Monitor Serie
  Serial.println();
  Serial.println("¡WiFi conectado!");
  Serial.print("IP del ESP32: ");
  Serial.println(WiFi.localIP()); 

  // ===== RUTA PARA QUE TU PÁGINA WEB LEA LOS DATOS =====
  server.on("/datos", HTTP_GET, []() {
    String json = "{";
    json += "\"temperatura\":" + String(temperaturaActual, 1) + ",";
    json += "\"humedad\":" + String(humedadActual, 1) + ",";
    json += "\"humedadSuelo\":" + String(humedadSueloActual);
    json += "}";

    // Permite que Live Server (tu VS Code) lea los datos sin bloqueo de seguridad
    server.sendHeader("Access-Control-Allow-Origin", "*");
    server.send(200, "application/json", json);
  });

  // Arrancamos el servidor
  server.begin();
}

void loop() {
  // 1. Atender a la página web si está pidiendo datos
  server.handleClient();

  // 2. Leer los sensores cada 5 segundos SIN usar delay()
  static unsigned long ultimaLectura = 0;
  if (millis() - ultimaLectura > 5000) {
    ultimaLectura = millis();

    float t = dht.readTemperature();
    float h = dht.readHumidity();

    // Validar que la lectura del DHT11 sea correcta
    if (!isnan(t) && !isnan(h)) {
      temperaturaActual = t;
      humedadActual = h;
    }

    // Simular humedad de suelo entre 30% y 70%
    humedadSueloActual = random(30, 71);

    // Imprimir en una sola línea para que se vea ordenado en el Monitor Serie
    Serial.println("Temp: " + String(temperaturaActual, 1) + " °C | Hum: " + String(humedadActual, 1) + " % | Suelo (Simulada): " + String(humedadSueloActual) + " %");
  }
}