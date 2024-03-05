<<<<<<< HEAD
import { Line } from 'react-chartjs-2';
import { useState, useEffect, useCallback } from 'react';
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

=======
import { Line } from "react-chartjs-2";
import { useState, useEffect, useCallback } from "react";
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
import { socket } from "../socket";
>>>>>>> 0e92953bc6a554b9dfd9216cb5fbb9f8970a2d90

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const POINTS_PER_SECOND = 1;

const MostrarGraf = () => {
  const [chartData, setChartData] = useState({
    labels: [],
    datasets: [
      {
        label: "Pulso Cardiaco",
        data: [],
        backgroundColor: "rgb(75, 192, 192)",
        borderColor: "rgb(75, 50, 50)",
        borderwidth: 5,
      },
    ],
  });
  const [isRunning, setIsRunning] = useState(false);

  const addData = useCallback((dataNumber) => {
    console.log("addData called with", dataNumber);
    setChartData((prevChartData) => {
      const newData = { ...prevChartData };
      const newEntry = Number(dataNumber) * 100;
      const newTime = new Date().toLocaleTimeString();
      newData.datasets[0].data = [
        ...newData.datasets[0].data.slice(-POINTS_PER_SECOND + 1),
        newEntry,
      ];
      newData.labels = [
        ...newData.labels.slice(-POINTS_PER_SECOND + 1),
        newTime,
      ];
      console.log("Old data:", newData.datasets[0].data.slice(0, -1));
      console.log("New entry:", newEntry);
      console.log("Updated data:", newData.datasets[0].data);
      return newData;
    });
  }, []);

  useEffect(() => {
    socket.on("heartbeat_output", (data) => {
      console.log(data);
      addData(Number(data));
    });

<<<<<<< HEAD
    const addData = useCallback((data) => {
        setChartData((prevChartData) => {
            const newData = { ...prevChartData };
            newData.labels.push(new Date().toLocaleTimeString());
            newData.datasets[0].data.push(Number(data)*100);
            return newData;
        });
    }, []);

    useEffect(() => {
        let interval;
      
        const handleData = (data) => {
          if (!isRunning) return;
          clearInterval(interval);
          clearInterval(data);
          interval = setInterval(() => {
            addData(data);
          }, 1000);
        };

        socket.on("heartbeat_output", handleData);
      
        return () => {
          clearInterval(interval);
          socket.off("heartbeat_output", handleData);
        };
      }, [isRunning, addData]);

    useEffect(() => {
        socket.on("heartbeat_output", (data) => {
            console.log(data)
            addData(Number(data));
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
=======
    return () => {
      socket.off("heartbeat_output");
>>>>>>> 0e92953bc6a554b9dfd9216cb5fbb9f8970a2d90
    };
  }, [addData]);

<<<<<<< HEAD
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
            <button onClick={handleToggle} className="botonIniciar">{isRunning ? 'Detener' : 'Iniciar'} Gráfico</button>
        </div>
    );
=======
  const handleToggle = () => {
    setIsRunning((prevIsRunning) => !prevIsRunning);
    if (isRunning) {
      socket.emit("stop_transmission");
    } else {
      socket.emit("start_transmission");
    }
  };

  return (
    <div>
      <Line
        data={chartData}
        options={{
          scales: {
            y: {
              beginAtZero: true,
            },
          },
        }}
        id="myChart"
      />
      <button onClick={handleToggle} className="botonIniciar">
        {isRunning ? "Detener" : "Iniciar"} Gráfico
      </button>
    </div>
  );
>>>>>>> 0e92953bc6a554b9dfd9216cb5fbb9f8970a2d90
};

export default MostrarGraf;
