import 'url-polyfill';
import React from 'react';
import 'bootstrap/dist/css/bootstrap.css';
// import 'bootstrap/dist/css/bootstrap-theme.css';
import Form from './Form';

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

                <Form />
            </div>
        );
    }
}
