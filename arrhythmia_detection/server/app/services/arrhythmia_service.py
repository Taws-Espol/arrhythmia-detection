from app.models import ArrhythmiaModel


class ArrhythmiaService:
    def __init__(self):
        self.arrhythmia_model = ArrhythmiaModel()

    def predict_arrhythmia(self, json_data):
        # Perform any necessary processing on heartbeat_data
        prediction = self.arrhythmia_model.predict_arrhythmia(json_data)
        return prediction
