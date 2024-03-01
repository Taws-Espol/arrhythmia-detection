import json
import numpy as np
from keras.models import load_model


class ArrhythmiaModel:
    def __init__(self):
        model_filepath = "./app/models/model.keras"
        self.model = load_model(model_filepath)

    def predict_arrhythmia(self, json_data):

        loaded_data = json_data if isinstance(json_data, dict) else json.loads(json_data)
        heartbeat_data = np.array(loaded_data["heartbeat_data"])
        dataArr = np.expand_dims(heartbeat_data, axis=0)
        class_labels = ["N", "S", "V", "F", "Q"]

        results = self.model.predict(dataArr)
        single_result = results[0]  # 0 ya que únicamente tiene ese valor
        most_likely_class_index = int(np.argmax(single_result))
        class_likelyhood = single_result[most_likely_class_index]
        class_label = class_labels[most_likely_class_index]
        print(f"{class_label}  and  {class_likelyhood}")
        return class_label, class_likelyhood
