/*
 * WebSocketClientSocketIOack.ino
 *
 *  Created on: 20.07.2019
 *
 */

#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>
#include <WiFiClientSecure.h>

#include <ArduinoJson.h>

#include <WebSocketsClient.h>
#include <SocketIOclient.h>

WiFiMulti WiFiMulti;
SocketIOclient socketIO;

#define USE_SERIAL Serial
//proyecto
//proyect
const int numCoefs = 5;                               // Número de coeficientes del filtro FIR
float coefs[numCoefs] = { 0.1, 0.2, 0.4, 0.2, 0.1 };  // Coeficientes del filtro FIR

float buffer[numCoefs] = { 0 };  // Buffer para almacenar valores anteriores
int bufferIndex = 0;             // Índice del buffer

float escala = 1023;

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
        USE_SERIAL.println(result/escala);
        return (result/escala);
        }
}

//server
void socketIOEvent(socketIOmessageType_t type, uint8_t * payload, size_t length) {
    switch(type) {
        case sIOtype_DISCONNECT:
            USE_SERIAL.printf("[IOc] Disconnected!\n");
            break;
        case sIOtype_CONNECT:
            USE_SERIAL.printf("[IOc] Connected to url: %s\n", payload);
            emitRespuestaServer();

            // join default namespace (no auto join in Socket.IO V3)
            socketIO.send(sIOtype_CONNECT, "/");
            break;
        case sIOtype_EVENT:
        {
            char * sptr = NULL;
            int id = strtol((char *)payload, &sptr, 10);
            USE_SERIAL.printf("[IOc] get event: %s id: %d\n", payload, id);
            if(id) {
                payload = (uint8_t *)sptr;
            }
            DynamicJsonDocument doc(1024);
            DeserializationError error = deserializeJson(doc, payload, length);
            if(error) {
                USE_SERIAL.print(F("deserializeJson() failed: "));
                USE_SERIAL.println(error.c_str());
                return;
            }

            String eventName = doc[0];
            USE_SERIAL.printf("[IOc] event name: %s\n", eventName.c_str());

            // Message Includes a ID for a ACK (callback)
            if(id) {
                // creat JSON message for Socket.IO (ack)
                DynamicJsonDocument docOut(1024);
                JsonArray array = docOut.to<JsonArray>();

                // add payload (parameters) for the ack (callback function)
                JsonObject param1 = array.createNestedObject();
                param1["now"] = millis();

                // JSON to String (serializion)
                String output;
                output += id;
                serializeJson(docOut, output);

                // Send event
                socketIO.send(sIOtype_ACK, output);
            }
        }
            break;
        case sIOtype_ACK:
            USE_SERIAL.printf("[IOc] get ack: %u\n", length);
            break;
        case sIOtype_ERROR:
            USE_SERIAL.printf("[IOc] get error: %u\n", length);
            break;
        case sIOtype_BINARY_EVENT:
            USE_SERIAL.printf("[IOc] get binary: %u\n", length);
            break;
        case sIOtype_BINARY_ACK:
            USE_SERIAL.printf("[IOc] get binary ack: %u\n", length);
            break;
    }
}
void emitRespuestaServer(){
  // creat JSON message for Socket.IO (event)
  DynamicJsonDocument doc(1024);
  JsonArray array = doc.to<JsonArray>();

  // add evnet name
  // Hint: socket.on('event_name', ....
  array.add("connection_response_esp32");

  // JSON to String (serializion)
  String output;
  serializeJson(doc, output);

  // Send event
  socketIO.sendEVENT(output);

  // Print JSON for debugging
  USE_SERIAL.println(output);
}
void emitHeartbeat(float heartbeatValue) {
  // Crea un JSON con el mensaje "heartbeat_input" y el valor de punto flotante proporcionado
  DynamicJsonDocument docOut(1024);
  JsonArray array = docOut.to<JsonArray>();
  array.add("heartbeat_input");
  array.add(heartbeatValue);  // Agrega el valor de punto flotante al JSON

  // Serializa el JSON a una cadena
  String output;
  serializeJson(docOut, output);

  // Envía el evento al servidor
  socketIO.send(sIOtype_EVENT, output);
}
void setup() {
    //USE_SERIAL.begin(921600);
    USE_SERIAL.begin(115200);

    // Conexion con placa
    Serial.begin(115200);
    pinMode(A0, INPUT);
    pinMode(34, INPUT);  // Configuración para la detección de desconexión de electrodos LO +
    pinMode(35, INPUT);  // Configuración para la detección de desconexión de electrodos LO -
    digitalWrite(34, LOW);
    digitalWrite(35, LOW);

    //Serial.setDebugOutput(true);
    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

      for(uint8_t t = 4; t > 0; t--) {
          USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
          USE_SERIAL.flush();
          delay(1000);
      }

    WiFiMulti.addAP("NETLIFE-MUNIZAGA", "Jemjj202728");

    //WiFi.disconnect();
    while(WiFiMulti.run() != WL_CONNECTED) {
        delay(100);
    }

    String ip = WiFi.localIP().toString();
    USE_SERIAL.printf("[SETUP] WiFi Connected %s\n", ip.c_str());

    // server address, port and URL
    socketIO.begin("192.168.100.6", 5000, "/socket.io/?EIO=4");

    // event handler
    socketIO.onEvent(socketIOEvent);
}

unsigned long messageTimestamp = 0;
void loop() {
    socketIO.loop();
    float valor = leerPulsoCardiaco();
    emitHeartbeat(valor);
    delay(30);
    //por si acaso
    //emitHeartbeat(0.4);
}

