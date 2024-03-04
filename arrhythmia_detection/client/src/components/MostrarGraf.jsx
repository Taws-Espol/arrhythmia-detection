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
  import {socket} from '../socket';

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
                borderColor: 'rgb(75, 192, 192, 0.2)',
            },
        ],
    });
    const [isRunning, setIsRunning] = useState(false);

    const addData = useCallback((data) => {
        setChartData(prevChartData => {
            const newData = { ...prevChartData };
            const puntos_sec = 1;
            newData.labels = [...newData.labels.slice(-puntos_sec + 1), new Date().toLocaleTimeString()];
            newData.datasets[0].data = [...newData.datasets[0].data.slice(-puntos_sec + 1),data*100];
            return newData;
        });
    }, []);

    // useEffect(() => {
    //     let interval;
    //     socket.on("heartbeat_output", ((data)=>{
    //         if (isRunning) {
    //             interval = setInterval(addData(Number(data)), 1000); // Ajustado a 1000 ms (1 segundo) para mejor claridad
    //         }
    //         else {
    //             clearInterval(interval);
    //         }
    //     }))

    //     return () => {
    //         clearInterval(interval);
    //         socket.off('heartbeat_output');
    //     }
            
    // }, [isRunning, addData]);

    useEffect(() => {
        socket.on("heartbeat_output", (data) => {
            console.log(data[0])
            addData(Number(data[0]));
        });
    
        return () => {
            socket.off('heartbeat_output');
        }
    }, [addData]);


    const handleToggle = () => {
        setIsRunning((prevIsRunning) => !prevIsRunning);
        if(isRunning){
            socket.emit('stop_transmission');
        } else {
            socket.emit('start_transmission');
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
                    }
                }}
                id="myChart"
            />
            <button onClick={handleToggle} className="botonIniciar">{isRunning ? 'Detener' : 'Iniciar'} Gráfico</button>
        </div>
    );
};

export default MostrarGraf;
