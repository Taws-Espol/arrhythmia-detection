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
    connection_manager.handle_connection_response_esp32()


@socketio.on("connection_response_client")
def handle_connection_response_client(_):
    connection_manager.handle_connection_response_esp32()


@socketio.on("heartbeat_input")
def handle_new_data(json_data):
    if transmission_manager.is_transmitting():
        prediction, class_likelihood = arrhythmia_service.predict_arrhythmia(json_data)
        class_likelihood = float(class_likelihood)
        prediction_dict = {
            "prediction": prediction,
            "class_likelihood": class_likelihood,
            "json_data": json_data,
        }
        # Serialize the dictionary to a JSON string
        json_string = json.dumps(prediction_dict)
        socketio.emit("heartbeat_output", json_string)


@socketio.on("start_transmission")
def handle_start(_):
    transmission_manager.start_transmission()
    print("Transmission Enabled")


@socketio.on("stop_transmission")
def handle_stop(_):
    transmission_manager.stop_transmission()
    print("Transmission Disabled")
