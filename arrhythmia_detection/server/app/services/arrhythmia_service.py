import json
from app.models import ArrhythmiaModel


class ArrhythmiaService:
    def __init__(self):
        self.arrhythmia_model = ArrhythmiaModel()
        self.heartbeat_data = []

    def predict_arrhythmia(self, number):
        # Perform any necessary processing on heartbeat_data
        self.heartbeat_data.append(number)
        if len(self.heartbeat_data) == 186:
            prediction, class_likelihood = self.arrhythmia_model.predict_arrhythmia(
                self.heartbeat_data
            )
            self.heartbeat_data.clear()
            class_likelihood = float(class_likelihood)
            prediction_dict = {
                "prediction": prediction,
                "class_likelihood": class_likelihood,
            }
            # Serialize the dictionary to a JSON string
            json_string = json.dumps(prediction_dict)
            return json_string
        return "no_prediction"
