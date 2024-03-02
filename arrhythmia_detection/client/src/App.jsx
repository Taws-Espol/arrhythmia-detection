import React from 'react';
import './App.css';
import MostrarGraf from './components/MostrarGraf';

function App() {
  return (
    <div className="Detector">
      <header className="App-header">
        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
          <img src='/imgs/Espol_Logo_2023.png' alt="logoespol" width="400" height="75" style={{ alignSelf: 'flex-start' }} />
          <img src="/imgs/taws.png" alt="logoTaws" width="100" height="124" style={{ alignSelf: 'flex-end' }} />
        </div>
      </header>
      <section className="App-content">
        <h2>DETECTOR DE ARRITMIAS CARDIACAS CON REDES NEURONALES</h2>
        <p>Integrantes: Juan Munizaga, Annabella Sánchez, Juan Francisco Fernandez, Alex Otero</p>
        <article>
          <h2>Gráfica en tiempo real</h2>
          <MostrarGraf />
        </article>
      </section>
    </div>
  );
}

export default App;
