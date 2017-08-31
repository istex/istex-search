import 'url-polyfill';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Form from './Form/';
import './App.css';
import logo from './logo.svg';

function App() {
    return (
        <div className="App">
            <h2>Télécharger un corpus <img src={logo} alt="ISTEX" /></h2>
            <Form />
        </div>
    );
}

export default App;
