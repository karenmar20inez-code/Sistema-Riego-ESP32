#include <WiFi.h>
#include <HTTPClient.h>
#include <DHT.h>

const char* ssid = "JULIOCADENA18";
const char* password = "12345678";
// ¡Tu enlace real de Firebase listo!
const char* firebaseURL = "https://sistemaderiego-c9ca5-default-rtdb.firebaseio.com/datos.json"; 

#define DHTPIN 4
#define DHTTYPE DHT11
DHT dht(DHTPIN, DHTTYPE);

void setup() {
  Serial.begin(115200);
  dht.begin();
  randomSeed(analogRead(34));

  WiFi.begin(ssid, password);
  Serial.print("Conectando a WiFi");
  while (WiFi.status() != WL_CONNECTED) {
    delay(500);
    Serial.print(".");
  }
  Serial.println("\n¡WiFi conectado! Listo para enviar a la nube.");
}

void loop() {
  if (WiFi.status() == WL_CONNECTED) {
    float t = dht.readTemperature();
    float h = dht.readHumidity();

    if (isnan(t) || isnan(h)) {
      t = 24.5; 
      h = 49.0;
    }

    int humedadSuelo = random(30, 71);

    // Empaquetar los datos
    String json = "{";
    json += "\"temperatura\":" + String(t, 1) + ",";
    json += "\"humedad\":" + String(h, 1) + ",";
    json += "\"humedadSuelo\":" + String(humedadSuelo);
    json += "}";

    // Enviar a Firebase
    HTTPClient http;
    http.begin(firebaseURL);
    http.addHeader("Content-Type", "application/json");
    
    int httpResponseCode = http.PUT(json);
    
    if (httpResponseCode > 0) {
      Serial.println("Enviado a Firebase: " + json);
    } else {
      Serial.println("Error de envío: " + String(httpResponseCode));
    }
    http.end();
  }
  delay(5000); // Enviar cada 5 segundos
}