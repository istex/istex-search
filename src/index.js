import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import VersionComponent from './Version';

ReactDOM.render(<App />, document.getElementById('root'));
ReactDOM.render(<VersionComponent />, document.getElementById('version'));
