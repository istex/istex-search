import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Form from './Form';
import './App.css';
import logo from './logo.svg';

function App() {
    return (
        <div className="App">
            <div className="App-header">
                <img src={logo} className="App-logo" alt="logo" />
                <h2>ISTEX Download</h2>
            </div>
            <Form />
        </div>
    );
}

export default App;
