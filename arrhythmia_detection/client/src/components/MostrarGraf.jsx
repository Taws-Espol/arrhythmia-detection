import { Line } from 'react-chartjs-2';
import { useState, useEffect, useCallback } from 'react';
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
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });
    const [isRunning, setIsRunning] = useState(false);

    const addData = useCallback(() => {
        setChartData(prevChartData => {
            const newData = { ...prevChartData };
            const puntos_sec = 1;
            newData.labels = [...newData.labels.slice(-puntos_sec + 1), new Date().toLocaleTimeString()];
            newData.datasets[0].data = [...newData.datasets[0].data.slice(-puntos_sec + 1), Math.random() * 100];
            return newData;
        });
    }, []);

    useEffect(() => {
        let interval;
        if (isRunning) {
            interval = setInterval(addData, 1000); // Ajustado a 1000 ms (1 segundo) para mejor claridad
        } else {
            clearInterval(interval);
        }

        return () => clearInterval(interval);
    }, [isRunning, addData]);

    const handleToggle = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
    };

    return (
        <div>
            <button onClick={handleToggle}>{isRunning ? 'Detener' : 'Iniciar'} Gráfico</button>
            <Line
                data={chartData}
                options={{
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }}
                id="myChart"
            />
        </div>
    );
};

export default MostrarGraf;
