from flask import jsonify
from flask_restx import Namespace, Resource
from app.events import socketio
from app.events import connection_manager
from time import sleep

esp32_namespace = Namespace(
    "esp32",
    description="Ruta para establecer comunicacion con el ESP32, y activar los Web Sockets",
)


@esp32_namespace.route("/connect")
class ConnectESP32(Resource):
    @esp32_namespace.doc(
        responses={
            200: "Conexion establecida con ESP32",
            408: "Fallos en la conexion con ESP32",
        }
    )
    def get(self):
        socketio.emit("connection_request")
        connection_manager.remake_connection()
        for _ in range(5):  # Espera hasta 5 segundos
            if connection_manager.is_connected():
                return {"message": "Connection established with ESP32"}, 200
            sleep(1)

        return {"message": "Failed to connect to ESP32"}, 408
