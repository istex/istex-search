import React from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip, OverlayTrigger, Button, Modal, FormGroup, FormControl, InputGroup } from 'react-bootstrap';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { NotificationManager } from 'react-notifications';
import commaNumber from 'comma-number';
import 'react-notifications/lib/notifications.css';

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

    static getHistory() {
        return JSON.parse(window.localStorage.getItem('dlISTEX'));
    }

    static handleCopy() {
        NotificationManager.info('Le lien a été copié dans le presse-papier', '', 2000);
    }
    constructor(props) {
        super(props);
        this.localStorage = storageHistory.getHistory();
        this.state = {
            showConfirm: false,
            showLink: false,
            numberLink: 0,
        };
    }

    loadHistory() {
        this.localStorage = storageHistory.getHistory();
    }

    refreshHistory() {
        this.setState({
            update: true,
        });
    }

    cleanHistory() {
        window.localStorage.clear();
        this.refreshHistory();
    }

    updateStorage(element) {
        window.localStorage.setItem('dlISTEX', JSON.stringify(element));
        this.refreshHistory();
    }

    render() {
        const editTooltip = (
            <Tooltip data-html="true" id="editTooltip">
                Editer cette requête
            </Tooltip>);
        const dlTooltip = (
            <Tooltip data-html="true" id="dlTooltip">
                Télécharger cette requête
            </Tooltip>);

        const shareTooltip = (
            <Tooltip data-html="true" id="shareTooltip">
                Partager cette requête
            </Tooltip>);

        const removeTooltip = (
            <Tooltip data-html="true" id="removeTooltip">
                Supprimer cette requête
            </Tooltip>);

        this.loadHistory();
        this.columnNames = this.props.columnNames.split(',');
        this.columnTab = [];
        for (let j = 0; j < this.columnNames.length; j += 1) {
            const onOneLign = this.columnNames[j].replace(' ', '\xa0');
            this.columnTab[j] = (<th key={this.columnNames[j]}>{onOneLign}</th>);
        }

        this.historyTab = [];
        this.correctformatLine = [];
        if (window.localStorage && this.localStorage) {
            for (let i = this.localStorage.length - 1; i >= 0; i -= 1) {
                const formatLine = this.localStorage[i].formats;
                this.correctformatLine[i] = [];
                for (let x = 0; x < formatLine.length; x += 1) {
                    this.correctformatLine[i][x] = (<div key={formatLine[x]}>{formatLine[x]}</div>);
                }
                this.historyTab[this.localStorage.length - i] = (
                    <tr key={`table ${this.localStorage.length - i}`}>
                        <td>{this.localStorage.length - i}</td>
                        <td>{new Date(this.localStorage[i].date).toUTCString()}</td>
                        <td>{storageHistory.cutQuery(this.localStorage[i].q)}</td>
                        <td>{this.correctformatLine[i]}</td>
                        <td style={{ textAlign: 'right', paddingRight: '10px' }}>
                            {commaNumber.bindWith('\xa0', '')(this.localStorage[i].size)}
                        </td>
                        <td>{this.localStorage[i].rankBy}</td>
                        <td style={{ paddingLeft: '25px' }} className="transparent-td">
                            <OverlayTrigger
                                placement="top"
                                overlay={editTooltip}
                                onClick={() => {
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
                        <td className="transparent-td">
                            <OverlayTrigger
                                placement="top"
                                overlay={shareTooltip}
                                onClick={() => {
                                    this.setState({
                                        showLink: true,
                                        numberLink: i,
                                    });
                                }}
                            >
                                <span
                                    className="glyphicon glyphicon-link"
                                    role="button"
                                />
                            </OverlayTrigger>

                        </td>
                        <td className="transparent-td">
                            <OverlayTrigger
                                placement="top"
                                overlay={removeTooltip}
                                onClick={() => {
                                    const updatedStorage = storageHistory.getHistory();
                                    if (i === 0 && updatedStorage.length === 1) {
                                        this.cleanHistory();
                                    } else {
                                        updatedStorage.splice(i, 1);
                                        this.updateStorage(updatedStorage);
                                    }
                                }}
                            >
                                <span
                                    role="button" className="glyphicon glyphicon-remove"
                                />
                            </OverlayTrigger>
                        </td>
                    </tr>);
            }
        }

        return (
            <div className="history">
                <Table responsive condensed hover striped>
                    <thead>
                        <tr>
                            {this.columnTab}
                        </tr>
                    </thead>
                    <tbody>
                        {this.historyTab}
                    </tbody>
                </Table>
                <Button
                    bsStyle="danger"
                    disabled={!storageHistory.getHistory()
                            || storageHistory.getHistory().length === 0}
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
                        Etes-vous sûr de vouloir supprimer l&apos;historique de vos téléchargements ?
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
                                this.cleanHistory();
                                this.setState({
                                    showConfirm: false,
                                });
                            }}
                        >
                            Confirmer
                        </Button>
                    </Modal.Footer>
                </Modal>
                <Modal show={this.state.showLink} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>Partager</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <FormGroup>
                            <InputGroup>
                                <FormControl bsSize="small" type="text" readOnly value={this.localStorage ? `https://dl.istex.fr/${this.localStorage[this.state.numberLink].url}` : ''} />
                                <InputGroup.Button>
                                    <CopyToClipboard
                                        text={this.localStorage ? `https://dl.istex.fr/${this.localStorage[this.state.numberLink].url}` : ''}
                                        onCopy={storageHistory.handleCopy}
                                    >
                                        <Button
                                            id="copyButton"
                                            onClick={() => {
                                                this.setState({
                                                    showLink: false,
                                                });
                                            }}
                                        >
                                            Copier
                                        </Button>
                                    </CopyToClipboard>
                                </InputGroup.Button>
                            </InputGroup>
                        </FormGroup>
                    </Modal.Body>

                    <Modal.Footer>
                        <Button
                            onClick={() => {
                                this.setState({
                                    showLink: false,
                                });
                            }}
                        >
                            Annuler
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
