import 'url-polyfill';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap/dist/css/bootstrap-theme.css';
import Form from './Form';
import './App.css';

export default class App extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            errorApiDown: '', // TODO: to an ajax request to know if API is down
        };
    }

    render() {
        return (
            <div className="App">

                <div className="container-fluid">

                    <div className="istex-dl-punchline text-center row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <h1>Téléchargez un corpus ISTEX</h1>
                            <p className="lead">
                                Vous êtes membre de l’Enseignement Supérieur et de la Recherche et
                                vous souhaitez extraire un corpus de documents ISTEX&nbsp;? <br />
                                3 étapes suffisent pour récupérer une archive zip sur votre disque dur.
                            </p>
                        </div>
                        <div className="col-lg-2">
                            <img
                                src="/images/beta.png"
                                className="istex-dl-beta hidden-md hidden-xs hidden-sm"
                                alt=""
                            />
                        </div>

                    </div>

                    { this.state.errorApiDown &&
                    <div className="istex-dl-error-api row">
                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <p>
                                <span
                                    role="button"
                                    className="glyphicon glyphicon-warning-sign"
                                    aria-hidden="true"
                                />&nbsp;
                                La plateforme ISTEX est en maintenance. Réessayez plus tard…
                                <blockquote>{this.state.errorApiDown}</blockquote>
                            </p>
                        </div>
                        <div className="col-lg-2" />
                    </div>
                    }

                </div>
                <Form />
            </div>
        );
    }
}
