import React from 'react';
import PropTypes from 'prop-types';
import { Table } from 'react-bootstrap';

export default class storageHistory extends React.Component {

    static cutQuery(query) {
        let res = query;
        if (query.length <= 200) {
            return res;
        }
        res = res.substring(0, 200);
        if (res.substring(res.Length, 1) !== ' ') {
            const LastSpace = res.lastIndexOf(' ');
            if (LastSpace !== -1) {
                res = res.substring(0, LastSpace);
            }
        }
        res += '...';
        return res;
    }

    constructor(props) {
        super(props);
        this.localStorage = JSON.parse(window.localStorage.getItem('dlISTEX'));
    }
    render() {
        this.localStorage = JSON.parse(window.localStorage.getItem('dlISTEX'));
        this.nomColonnes = this.props.nomColonnes.split(',');
        this.tableauColonnes = [];
        for (let j = 0; j < this.nomColonnes.length; j += 1) {
            this.tableauColonnes[j] = (<th key={this.nomColonnes[j]}>{this.nomColonnes[j]}</th>);
        }

        this.tableauHistorique = [];
        this.vraiformatLigne = [];
        if (window.localStorage && this.localStorage) {
            const ancien = this.localStorage;
            for (let i = 0; i < ancien.length; i += 1) {
                const formatLigne = this.localStorage[i].formats;
                this.vraiformatLigne[i] = [];
                for (let x = 0; x < formatLigne.length; x += 1) {
                    this.vraiformatLigne[i][x] = (<div key={formatLigne[x]}>{formatLigne[x]}</div>);
                }
                this.tableauHistorique[i] = (
                    <tr key={`table ${i}`}>
                        <td>{i + 1}</td>
                        <td>{new Date(this.localStorage[i].date).toUTCString()}</td>
                        <td>{this.vraiformatLigne[i]}</td>
                        <td>{this.localStorage[i].size}</td>
                        <td>{storageHistory.cutQuery(this.localStorage[i].q)}</td>
                        <td><button
                            type="button" className="btn-sm"
                            onClick={() => {
                                    // this.interpretURL(this.localStorage[i].url);
                                window.location = this.localStorage[i].url;
                            }}
                        >
                            Editer cette requête
                        </button>
                        </td>
                        <td><button
                            type="button" className="btn-sm"
                            onClick={() => {
                                window.location = `${this.localStorage[i].url}&download=true`;
                            }}
                        >
                            Télécharger cette requête
                        </button>
                        </td>
                    </tr>);
            }
        }

        return (
            <div className="history">
                <Table striped bordered condensed hover>
                    <thead>
                        <tr>
                            {this.tableauColonnes}
                        </tr>
                    </thead>
                    <tbody>
                        {this.tableauHistorique}
                    </tbody>
                </Table>
                <button
                    type="button" className="btn-sm"
                    onClick={() => {
                        window.localStorage.clear();
                        this.setState({
                            update: true,
                        });
                    }}
                >
                Supprimer l&apos;historique
            </button>
            </div>
        );
    }
}

storageHistory.propTypes = {
    nomColonnes: PropTypes.string.isRequired,
};
