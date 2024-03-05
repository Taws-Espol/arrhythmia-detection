import React from 'react';
import './App.css';
import MostrarGraf from './components/MostrarGraf';
import logoArr from './assets/logoArr (2).svg';


function App() {
  return (
<div className="Detector" style={{ fontFamily: 'Arial, sans-serif', color: '#2c3e50' }}>
  <header className="App-header" style={{ padding: '10px 0', boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' }}>
    <div style={{ display: 'flex', justifyContent: 'space-between', margin: '0 auto', padding: '0 20px' }}>
      <img src='/imgs/Espol_Logo_2023.png' alt="logoespol" style={{ width: '300px', height: '75px' }} />
      <img src={logoArr} alt="logo" style={{ maxHeight: '80px' }} />
      <img src="/imgs/taws.png" alt="logoTaws" style={{ width: '60px', height: '75px', paddingLeft: '250px' }} />
    </div>
  </header>
  <section className="App-content" style={{ padding: '20px', backgroundColor: '#fff' }}>
    <p>Integrantes: Juan Munizaga, Annabella Sánchez, Juan Francisco Fernandez, Alex Otero</p>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h2>Gráfica en tiempo real</h2>
      <MostrarGraf />
    </div>
  </section>
</div>


  );
}

export default App;
