class ConnectionManager:
    def __init__(self):
        self.esp32_connected = False
        self.client_connected = False

    def handle_connection_response_esp32(self):
        self.esp32_connected = True

    def handle_connection_response_client(self):
        self.client_connected = True

    def remake_connection(self):
        self.esp32_connected = False
        self.client_connected = False

    def is_connected(self):
        return self.esp32_connected and self.client_connected
