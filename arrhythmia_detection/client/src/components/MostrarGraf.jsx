import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';
import { socket } from '../socket';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const MostrarGraf = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: 'Pulso Cardiaco',
        data: [],
        backgroundColor: 'rgb(75, 192, 192)',
        borderColor: 'rgb(75, 50, 50)',
        borderWidth: 5,
      },
    ],
  });
  const [isRunning, setIsRunning] = useState(false);

  const handleData = (data) => {
    if (isRunning) {
      setChartData((prevChartData) => {
        const newData = { ...prevChartData };
        newData.labels.push(new Date().toLocaleTimeString());
        newData.datasets[0].data.push(Number(data));
        return newData;
      });
    }
  };

  useEffect(() => {
    if (isRunning) {
      socket.on("heartbeat_output", handleData);
    }
    return () => {
      socket.off("heartbeat_output", handleData);
    };
  }, [isRunning]);

  const handleToggle = () => {
    setIsRunning(!isRunning);
    if (!isRunning) {
      socket.emit('start_transmission');
    } else {
      socket.emit('stop_transmission');
    }
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true
            }
          },
          responsive: true
        }}
        id="myChart"
      />
      <button onClick={handleToggle} className="botonIniciar">
        {isRunning ? 'Detener' : 'Iniciar'} Gráfico
      </button>
    </div>
  );
};

export default MostrarGraf;
