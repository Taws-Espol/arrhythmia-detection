#include <WiFi.h>
#include <ArduinoWebsockets.h>

const char* ssid = "TU_SSID";
const char* password = "TU_PASSWORD";
const char* websocket_server = "ws://direccion_del_servidor:5000";

int estadoElectrodos = 0;                             // Variable de estado de los electrodos
const int numCoefs = 5;                               // Número de coeficientes del filtro FIR
float coefs[numCoefs] = { 0.1, 0.2, 0.4, 0.2, 0.1 };  // Coeficientes del filtro FIR

float buffer[numCoefs] = { 0 };  // Buffer para almacenar valores anteriores
int bufferIndex = 0;             // Índice del buffer

float escala = 1023.0;

using namespace websockets;
WebsocketsClient client;

void setup() {
    Serial.begin(115200);

    WiFi.begin(ssid, password);
    while(WiFi.status() != WL_CONNECTED) {
        delay(1000);
        Serial.println("Conectando a WiFi...");
    }
    Serial.println("Conectado a WiFi");
    client.connect(websocket_server);

    // Conexion con placa
    Serial.begin(115200);
    pinMode(A0, INPUT);
    pinMode(34, INPUT);  // Configuración para la detección de desconexión de electrodos LO +
    pinMode(35, INPUT);  // Configuración para la detección de desconexión de electrodos LO -
    digitalWrite(34, LOW);
    digitalWrite(35, LOW);
}

void loop() {
    if(client.connectionOpen()) {
            float pulsoCardiaco = leerPulsoCardiaco();
        client.send(String(pulsoCardiaco));
        delay(30); 
    }
    client.poll();
}
// Implementación de un filtro de media móvil simple
float filtroMediaMovil(int newValue, float alpha) {
    static float filteredValue = 0;
    filteredValue = alpha * newValue + (1 - alpha) * filteredValue;
    return filteredValue;
}

float filtroFIR(float newValue) {
    buffer[bufferIndex] = newValue;  // Agregar el nuevo valor al buffer
    float result = 0;

    for (int i = 0; i < numCoefs; i++) {
      result += coefs[i] * buffer[(bufferIndex + i) % numCoefs];
    }

    bufferIndex = (bufferIndex + 1) % numCoefs;  // Avanzar el índice del buffer

    return result;
}

float leerPulsoCardiaco() {
    result = 0;
    // Tu código para leer el pulso cardíaco del sensor va aquí
    // Verifica si los electrodos están desconectados
    if ((digitalRead(34) == 1) || (digitalRead(35) == 1)) {
        Serial.println("! Electrodos desconectados !");
        estadoElectrodos = 0;  // Actualiza el estado de los electrodos
    } else {
        if (estadoElectrodos == 0) {
        Serial.println("Electrodos conectados");
        estadoElectrodos = 1;  // Actualiza el estado de los electrodos
        }

        float valorAD8232 = analogRead(A0);
        float filtro = filtroMediaMovil(valorAD8232, 0.8);
        float result = filtroFIR(filtro);
        result /= escala;
        }
    return estadoElectrodos == 1 ? result : 0; 
}