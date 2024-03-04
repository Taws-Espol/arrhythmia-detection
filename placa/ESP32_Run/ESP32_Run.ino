/*
	Esp32 Websockets Client

	This sketch:
        1. Connects to a WiFi network
        2. Connects to a Websockets server
        3. Sends the websockets server a message ("Hello Server")
        4. Prints all incoming messages while the connection is open

	Hardware:
        For this sketch you only need an ESP32 board.

	Created 15/02/2019
	By Gil Maimon
	https://github.com/gilmaimon/ArduinoWebsockets

*/

#include <ArduinoWebsockets.h>
#include <WiFi.h>

//proyect
const int numCoefs = 5;                               // Número de coeficientes del filtro FIR
float coefs[numCoefs] = { 0.1, 0.2, 0.4, 0.2, 0.1 };  // Coeficientes del filtro FIR

float buffer[numCoefs] = { 0 };  // Buffer para almacenar valores anteriores
int bufferIndex = 0;             // Índice del buffer

float escala = 1023.0;

const char* ssid = "NETLIFE-MUNIZAGA"; //Enter SSID
const char* password = "Jemjj202728"; //Enter Password
const char* websockets_server_host = "//192.168.100.6"; //Enter server adress
const uint16_t websockets_server_port = 5000; // Enter server port

using namespace websockets;

WebsocketsClient client;

//funciones
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
    // Tu código para leer el pulso cardíaco del sensor va aquí
    // Verifica si los electrodos están desconectados
    if ((digitalRead(34) == 1) || (digitalRead(35) == 1)) {
      // Actualiza el estado de los electrodos
        //Serial.println("! Electrodos desconectados !");
        return 0;
    } else {
        float valorAD8232 = analogRead(A0);
        float filtro = filtroMediaMovil(valorAD8232, 0.8);
        float result = filtroFIR(filtro);
        return (result /= escala);
        }
}

void setup() {
    Serial.begin(115200);

    // Conexion con placa
    Serial.begin(115200);
    pinMode(A0, INPUT);
    pinMode(34, INPUT);  // Configuración para la detección de desconexión de electrodos LO +
    pinMode(35, INPUT);  // Configuración para la detección de desconexión de electrodos LO -
    digitalWrite(34, LOW);
    digitalWrite(35, LOW);

    // Connect to wifi
    WiFi.begin(ssid, password);

    // Wait some time to connect to wifi
    for(int i = 0; i < 10 && WiFi.status() != WL_CONNECTED; i++) {
        Serial.print(".");
        delay(1000);
    }

    // Check if connected to wifi
    if(WiFi.status() != WL_CONNECTED) {
        Serial.println("No Wifi!");
        return;
    }

    Serial.println("Connected to Wifi, Connecting to server.");
    // try to connect to Websockets server
    //bool connected = client.connect(websockets_server_host, websockets_server_port, "/");
    bool connected = client.connect("http://192.168.100.6:5000/");
    if(connected) {
        Serial.println("Connected!");
        client.send("connection_response_esp32");
    } else {
        Serial.println("Not Connected!");
    }
    
    // run callback when messages are received
    client.onMessage([&](WebsocketsMessage message){
        Serial.print("Got Message: ");
        Serial.println(message.data());
    });
}

void loop() {
  float pulsoCardiaco = leerPulsoCardiaco();
  //Serial.println(pulsoCardiaco);
    // let the websockets client check for incoming messages
    if(client.available()) {
        client.poll();
    }
    delay(30);
}
