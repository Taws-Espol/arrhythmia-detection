import { Line } from "react-chartjs-2";
import { useState, useEffect, useCallback } from "react";
import { socket } from "../socket";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const ARRHYTHMIA_TYPES = {
  N: "Latidos no ectópicos (latido normal)",
  S: "Latidos ectópicos supraventriculares",
  V: "Latidos ectópicos ventriculares",
  F: "Latidos de fusión",
  Q: "Latidos desconocidos",
};

const MostrarGraf = () => {
  const [chartData, setChartData] = useState({
    labels: Array.from({ length: 300 }, (_, i) => i),
    datasets: [
      {
        label: "Pulso Cardiaco",
        data: [],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgb(75, 50, 50)",
        borderWidth: 5,
      },
    ],
  });
  const [isRunning, setIsRunning] = useState(false);

  const [arrhythmiaType, setArrhythmiaType] = useState("");
  // Limite de puntos en el gráfico

  const handleData = useCallback(
    (data) => {
      if (isRunning) {
        setChartData((prevChartData) => {
          const newData = { ...prevChartData };
          const { datasets } = newData;
          datasets[0].data = JSON.parse(data);
          return newData;
        });
      }
    },
    [isRunning, setChartData]
  );

  useEffect(() => {
    const handleArrhythmiaPrediction = (jsonString) => {
      const data = JSON.parse(jsonString);
      if (data.prediction !== "NO_STATUS") {
        setArrhythmiaType(ARRHYTHMIA_TYPES[data.prediction]);
      }
    };
    socket.on("heartbeat_prediction", handleArrhythmiaPrediction);

    return () => {
      socket.off("heartbeat_prediction", handleArrhythmiaPrediction);
    };
  }, []);

  useEffect(() => {
    if (isRunning) {
      socket.on("heartbeat_output", handleData);
    }
    return () => {
      socket.off("heartbeat_output", handleData);
    };
  }, [isRunning, handleData]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      socket.emit("start_transmission");
    } else {
      socket.emit("stop_transmission");
    }
  };

  return (
    <div>
      <div style={{ width: "100%", overflowX: "auto" }}>
        <Line
          data={chartData}
          options={{
            scales: {
              y: {
                beginAtZero: true,
              },
            },
            elements: {
              point: {
                radius: 0, // Oculta los puntos
              },
            },
            responsive: true,
            maintainAspectRatio: false, // Importante para mantener la altura fija cuando se desplaza
          }}
          id="myChart"
          style={{ minWidth: "1000px", minHeight: "300px" }}
        />
      </div>

      <button
        onClick={handleToggle}
        className="botonIniciar"
        style={{
          padding: "10px 20px",
          margin: "15px",
          fontSize: "1rem",
          borderRadius: "5px",
          border: "none",
          cursor: "pointer",
          backgroundColor: "#2980b9",
          color: "white",
        }}
      >
        {isRunning ? "Detener" : "Iniciar"} Gráfico
      </button>
      {arrhythmiaType && (
        <div
          className="glassmorphism"
          style={{
            color: "#2c3e50",
            padding: "10px",
            borderRadius: "5px",
            margin: "20px",
          }}
        >
          <p>Tipo de Latido: {arrhythmiaType}</p>
        </div>
      )}
    </div>
  );
};

export default MostrarGraf;
