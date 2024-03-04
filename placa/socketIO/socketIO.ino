//parece q si
#include <Arduino.h>

#include <WiFi.h>
#include <WiFiMulti.h>

#include <SocketIoClient.h>

#define USE_SERIAL Serial

WiFiMulti WiFiMulti;
SocketIoClient webSocket;

// CONST VARIABLES
const char *ssid = "NETLIFE-MUNIZAGA";
const char *pass = "Jemjj202728";
const char *HOST = "192.168.100.6:5000";

void event(const char *payload, size_t length){
    USE_SERIAL.printf("got message: %s\n", payload);
    webSocket.emit("connection_response_esp32");
}

void setup(){
    USE_SERIAL.begin(115200);

    USE_SERIAL.setDebugOutput(true);

    USE_SERIAL.println();
    USE_SERIAL.println();
    USE_SERIAL.println();

    for (uint8_t t = 4; t > 0; t--){
        USE_SERIAL.printf("[SETUP] BOOT WAIT %d...\n", t);
        USE_SERIAL.flush();
        delay(1000);
    }   


    // Connect to WIFI
    WiFiMulti.addAP(ssid, pass);

    while (WiFiMulti.run() != WL_CONNECTED){
        USE_SERIAL.print("No WiFi");
        delay(100);
    }
    USE_SERIAL.println("Si WIFI");
    // Receive events from server
    webSocket.on("connection_request", event);

    webSocket.begin("192.168.100.6", 5000, "/socket.io/?EIO=4&transport=websocket");
}


void loop(){
    webSocket.loop();
    webSocket.emit("heartbeat_input","0.5");
    delay(1000);

}