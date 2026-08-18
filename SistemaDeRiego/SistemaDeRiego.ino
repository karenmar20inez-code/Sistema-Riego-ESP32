#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* ssid = "INFINITUM5E27";
const char* password = "Hz6stSeSY3";

const char* serverUrl = "http://192.168.1.105:3000/api/sensor";


// ===== Sensor DHT11 =====
#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

// Parámetros de simulación para humedad de suelo
const int SOIL_MIN = 30; // % mínimo simulado
const int SOIL_MAX = 70; // % máximo simulado

void setup() {
Serial.begin(115200);
dht.begin();
// semilla para random (ruido ADC)
randomSeed(analogRead(34));

WiFi.begin(ssid, password);
Serial.print("Conectando a WiFi");
unsigned long start = millis();
while (WiFi.status() != WL_CONNECTED && millis() - start < 30000) {
delay(500);
Serial.print(".");
}
if (WiFi.status() == WL_CONNECTED) {
Serial.println();
Serial.println("WiFi conectado");
Serial.print("IP del ESP32: ");
Serial.println(WiFi.localIP());
} else {
Serial.println();
Serial.println("NO se conectó a WiFi (timeout)");
}
}

void loop() {
float temperatura = dht.readTemperature();
float humedad = dht.readHumidity();

static float ultimaTemperaturaValida = 24.0;
static float ultimaHumedadValida = 50.0;
if (isnan(temperatura) || isnan(humedad)) {
Serial.println("Error leyendo DHT11, usando último valor válido");
temperatura = ultimaTemperaturaValida;
humedad = ultimaHumedadValida;
} else {
ultimaTemperaturaValida = temperatura;
ultimaHumedadValida = humedad;
}

// Solo la humedad de suelo es simulada
int humedadSueloSimulada = random(SOIL_MIN, SOIL_MAX + 1);

Serial.println("Temperatura DHT11: " + String(temperatura, 1) + " °C");
Serial.println("Humedad DHT11: " + String(humedad, 1) + " %");
Serial.println("Humedad suelo (SIMULADA): " + String(humedadSueloSimulada) + " %");

if (WiFi.status() == WL_CONNECTED) {
HTTPClient http;
http.begin(serverUrl);
http.addHeader("Content-Type", "application/json");
String payload = "{";
payload += "\"temperatura\":" + String(temperatura, 1) + ",";
payload += "\"humedad\":" + String(humedad, 1) + ",";
payload += "\"humedadSuelo\":" + String(humedadSueloSimulada) + ",";
payload += "\"humedadSueloSimulada\":true";
payload += "}";

int httpCode = http.POST(payload);
if (httpCode > 0) {
  String response = http.getString();
  Serial.println("HTTP code: " + String(httpCode));
  Serial.println("Respuesta: " + response);
} else {
  Serial.println("Error al enviar datos");
  Serial.println(http.errorToString(httpCode));
}
http.end();
} else {
Serial.println("WiFi desconectado - no se envió");
}

delay(5000);
}
