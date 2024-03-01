import { Line } from 'react-chartjs-2';
import { useState, useEffect } from 'react';

const MostrarGraf = () => {
    const [chartData, setChartData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Mi dataset',
                data: [],
                fill: false,
                backgroundColor: 'rgb(75, 192, 192)',
                borderColor: 'rgba(75, 192, 192, 0.2)',
            },
        ],
    });
    const [isRunning, setIsRunning] = useState(false);

    useEffect(() => {
        let interval;
        if (isRunning) {
            const puntos_sec = 1;
            interval = setInterval(() => {
                const newData = {
                    labels: [...chartData.labels.slice(-puntos_sec + 1), new Date().toLocaleTimeString()],
                    datasets: [
                        {
                            ...chartData.datasets[0],
                            data: [...chartData.datasets[0].data.slice(-puntos_sec + 1), Math.random() * 100],
                        },
                    ],
                };
                setChartData(newData);
            }, 30);
        }

        return () => clearInterval(interval);
    }, [isRunning, chartData]);

    const handleToggle = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
    };

    return (
        <div>
            <button onClick={handleToggle}>{isRunning ? 'Detener' : 'Iniciar'} Gráfico</button>
            {isRunning && (
                <Line id="myChart" data={chartData} options={{
                    animation: false,
                    scales: {
                      x: {
                        display: false, // Oculta las etiquetas del eje X
                        grid: {
                          display: false // Oculta las líneas de la cuadrícula del eje X
                        }
                      },
                      y: {
                        beginAtZero: true // Comienza el eje Y desde cero
                      }
                    },
                    elements: {
                      line: {
                        tension: 0 // Deshabilita la suavización de la línea
                      }
                    }
                  }} />
            )}
        </div>
    );
};

export default MostrarGraf;