import json


class ArrhythmiaTransmission:
    def __init__(self):
        self.heartbeat_data = [0] * 300  # Initialize with 300 zeros

    def build_array(self, number):
        # Remove the oldest number and append the new one
        heartbeat_number = float(number)
        self.heartbeat_data.pop(0)
        self.heartbeat_data.append(heartbeat_number)

        json_string = json.dumps(self.heartbeat_data)
        return json_string

    def clear_transmission(self):
        self.heartbeat_data = [0] * 300
