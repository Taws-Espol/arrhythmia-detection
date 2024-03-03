import json
from app.services.arrhythmia_service import ArrhythmiaService
from app.socketio import socketio
from app.services import ConnectionManager
from app.services import TransmissionManager

connection_manager = ConnectionManager()

transmission_manager = TransmissionManager()

arrhythmia_service = ArrhythmiaService()


@socketio.on("connect")
def handle_connect():
    print("Client connected")


@socketio.on("connection_response_esp32")
def handle_connection_response_esp32(_):
    print("Connection with ESP32 established")
    connection_manager.handle_connection_response_esp32()


@socketio.on("connection_response_client")
def handle_connection_response_client(_):
    print("Connection with Client established")
    connection_manager.handle_connection_response_client()


@socketio.on("heartbeat_input")
def handle_heartbeat_input(heartbeat_number: float):
    if transmission_manager.is_transmitting():
        socketio.emit("heartbeat_output", heartbeat_number)
        json_string = arrhythmia_service.predict_arrhythmia(heartbeat_number)
        socketio.emit("heartbeat_prediction", json_string)


@socketio.on("start_transmission")
def handle_start(_):
    transmission_manager.start_transmission()
    print("Transmission Enabled")


@socketio.on("stop_transmission")
def handle_stop(_):
    transmission_manager.stop_transmission()
    print("Transmission Disabled")
