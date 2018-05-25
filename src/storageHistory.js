import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip, OverlayTrigger, Button, Modal } from 'react-bootstrap';

export default class storageHistory extends React.Component {

    static cutQuery(query) {
        let res = query;
        if (query.length <= 100) {
            return res;
        }
        res = res.substring(0, 100);
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
        this.state = {
            showConfirm: false,
        };
    }

    render() {
        const editTooltip = (
            <Tooltip data-html="true" id="dlTooltip">
                Editer cette requête
            </Tooltip>);
        const dlTooltip = (
            <Tooltip data-html="true" id="dlTooltip">
                Télécharger cette requête
            </Tooltip>);
        this.localStorage = JSON.parse(window.localStorage.getItem('dlISTEX'));
        this.columnNames = this.props.columnNames.split(',');
        this.columnTab = [];
        for (let j = 0; j < this.columnNames.length; j += 1) {
            const onOneLign = this.columnNames[j].replace(' ', '\xa0');
            this.columnTab[j] = (<th key={this.columnNames[j]}>{onOneLign}</th>);
        }

        this.hyistoryTab = [];
        this.correctformatLine = [];
        if (window.localStorage && this.localStorage) {
            for (let i = 0; i < this.localStorage.length; i += 1) {
                const formatLine = this.localStorage[i].formats;
                this.correctformatLine[i] = [];
                for (let x = 0; x < formatLine.length; x += 1) {
                    this.correctformatLine[i][x] = (<div key={formatLine[x]}>{formatLine[x]}</div>);
                }
                this.hyistoryTab[i] = (
                    <tr key={`table ${i}`}>
                        <td>{i + 1}</td>
                        <td>{new Date(this.localStorage[i].date).toUTCString()}</td>
                        <td>{this.correctformatLine[i]}</td>
                        <td>{this.localStorage[i].size}</td>
                        <td>{storageHistory.cutQuery(this.localStorage[i].q)}</td>
                        <td className="transparent-td">
                            <OverlayTrigger
                                placement="top"
                                overlay={editTooltip}
                                onClick={() => {
                                        // this.interpretURL(this.localStorage[i].url);
                                    window.location = this.localStorage[i].url;
                                }}
                            >
                                <span
                                    role="button" className="glyphicon glyphicon-edit"
                                />
                            </OverlayTrigger>
                        </td>
                        <td className="transparent-td">
                            <OverlayTrigger
                                placement="top"
                                overlay={dlTooltip}
                                onClick={() => {
                                    window.location = `${this.localStorage[i].url}&download=true`;
                                }}
                            >
                                <span
                                    role="button" className="glyphicon glyphicon-download-alt"
                                />
                            </OverlayTrigger>
                        </td>
                    </tr>);
            }
        }

        return (
            <div className="history">
                <Table responsive condensed hover>
                    <thead>
                        <tr>
                            {this.columnTab}
                        </tr>
                    </thead>
                    <tbody>
                        {this.hyistoryTab}
                    </tbody>
                </Table>
                <Button
                    bsStyle="danger"
                    onClick={() => {
                        this.setState({
                            showConfirm: true,
                        });
                    }}
                >
                Supprimer l&apos;historique
            </Button>
                <Modal bsSize="small" show={this.state.showConfirm} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>Confirmation</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        Etes-vous sûr de vouloir supprimer l&apos;historique de vos téléchargements
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                this.setState({
                                    showConfirm: false,
                                });
                            }}
                        >
                            Annuler
                        </Button>
                        <Button
                            bsStyle="primary"
                            onClick={() => {
                                window.localStorage.clear();
                                this.setState({
                                    showConfirm: false,
                                    update: true,
                                });
                            }}
                        >
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

storageHistory.propTypes = {
    columnNames: PropTypes.string.isRequired,
};
