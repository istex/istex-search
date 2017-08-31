import 'url-polyfill';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import './istexdl.css';
import Form from './Form/';
import './App.css';

function App() {
    return (
        <div className="App">

            <div className="container-fluid">

                <div className="istex-dl-punchline text-center row">

                    <div className="col-lg-2" />
                    <div className="col-lg-8">
                        <h1>Téléchargez un corpus ISTEX</h1>
                        <p className="lead">
                          Vous souhaitez extraire votre corpus de documents ISTEX ?<br />
                          3 étapes suffisent pour récupérer une archive ZIP sur votre disque dur.
                        </p>
                    </div>
                    <div className="col-lg-2">
                        <img src="/images/beta.png" className="istex-dl-beta hidden-md hidden-xs hidden-sm" alt="" />
                    </div>

                </div>

                <div className="istex-dl-error-api row">
                    <div className="col-lg-2" />
                    <div className="col-lg-8">
                        <p>Erreur api indispo</p>
                    </div>
                    <div className="col-lg-2" />
                </div>

            </div>
            <Form />
        </div>
    );
}

export default App;
