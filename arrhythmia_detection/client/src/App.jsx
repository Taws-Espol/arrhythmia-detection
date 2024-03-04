import React from 'react';
import './App.css';
import MostrarGraf from './components/MostrarGraf';
import logoArr from './assets/logoArr (2).svg';
import {socket} from './socket';


function App() {
  return (
    <div className="Detector">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src='/imgs/Espol_Logo_2023.png' alt="logoespol" width="400" height="75" style={{ alignSelf: 'flex-start' }} />
          <img src="/imgs/taws.png" alt="logoTaws" width="100" height="124" style={{ alignSelf: 'flex-end' }} />
        </div>
        <img src={logoArr}></img>
      </header>
      <section className="App-content">
        <p style={{color:'black'}}>Integrantes: Juan Munizaga, Annabella Sánchez, Juan Francisco Fernandez, Alex Otero</p>
        <div style={{justifyContent:'space-evenly'}}>
          <div style={{alignSelf:'flex-start'}}>
            <h2 style={{color:'black'}}>Gráfica en tiempo real</h2>
            <MostrarGraf />
          </div>
          <div className='glassmorphism' style={{alignSelf:'flex-start'}}>
            <text color='black'>Tipo de Arritmia: {socket.on('heartbeat_prediction')["prediction"]}</text>
          </div>
        </div>
      </section>
    </div>
  );
}

export default App;
