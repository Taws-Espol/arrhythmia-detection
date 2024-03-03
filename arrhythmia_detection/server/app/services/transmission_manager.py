class TransmissionManager:
    def __init__(self):
        self.transmission = False

    def start_transmission(self):
        self.transmission = True

    def stop_transmission(self):
        self.transmission = False

    def is_transmitting(self):
        return self.transmission
