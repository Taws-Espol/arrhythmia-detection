import json
from app.socketio import socketio
from app.services import ArrhythmiaService
from app.services import ArrhythmiaTransmission
from app.services import ConnectionManager
from app.services import TransmissionManager

connection_manager = ConnectionManager()

transmission_manager = TransmissionManager()

arrhythmia_service = ArrhythmiaService()

arrhythmia_transmission = ArrhythmiaTransmission()


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("connection_response_esp32")
def handle_connection_response_esp32():
    print("Connection with ESP32 established")
    connection_manager.handle_connection_response_esp32()


@socketio.on("connection_response_client")
def handle_connection_response_client(_):
    print("Connection with Client established")
    connection_manager.handle_connection_response_client()


@socketio.on("heartbeat_input")
def handle_heartbeat_input(heartbeat_number):
    if transmission_manager.is_transmitting():
        heartbeat_array = arrhythmia_transmission.build_array(heartbeat_number)
        socketio.emit("heartbeat_output", heartbeat_array)
        heartbeat_prediction = arrhythmia_service.predict_arrhythmia(heartbeat_number)
        socketio.emit("heartbeat_prediction", heartbeat_prediction)


@socketio.on("start_transmission")
def handle_start():
    transmission_manager.start_transmission()
    arrhythmia_transmission.clear_transmission()
    print("Transmission Enabled")


@socketio.on("stop_transmission")
def handle_stop():
    transmission_manager.stop_transmission()
    arrhythmia_transmission.clear_transmission()
    print("Transmission Disabled")


@socketio.on("event_name")
def handle_prueba(data):
    print("prueba", data)
