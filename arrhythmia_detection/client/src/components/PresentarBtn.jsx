import React, { useState } from 'react';

const PresentarBtn = () =>{
    const [estado, setEstado] = useState("Haz click para presentar");
    const [presentar, setPresentar] = useState(false);
   
    const present = () =>{
        setPresentar(true);
        setEstado("Presentando");
    };

    const notPresent =() =>{
        setPresentar(false);
        setEstado("Haz click para presentar");
    };

    return(
        <div>
            <p>Estado Actual: {estado}</p>
            <button onClick={present}>Iniciar</button>
            <button onClick={notPresent}>Terminar</button>
        </div>
    );
}
export default PresentarBtn;