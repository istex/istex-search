import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import Form from './Form';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';

class App extends Component {
  render() {
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
}

export default App;
