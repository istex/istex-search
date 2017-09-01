import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import NumericInput from 'react-numeric-input';
import { Modal, Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import decamelize from 'decamelize';
import 'react-input-range/lib/css/index.css';
import './Form.css';
import Filetype from './Filetype';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            size: 5000,
            limitNbDoc: 10000,
            extractMetadata: true,
            extractFulltext: false,
            extractEnrichments: false,
            extractCovers: false,
            extractAnnexes: false,
            downloading: false,
            URL2Download: '',
            errorRequestSyntax: '',
            errorDuringDownload: '',
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFiletypeChange = this.handleFiletypeChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleQueryChange(event) {
        const target = event.target;
        this.setState({
            errorRequestSyntax: '',
            q: target.value,
        });
        const ISTEX = this.buildURLFromState();

        ISTEX.searchParams.delete('extract');

        fetch(ISTEX.href)
            .then((response) => {
                if (response.status >= 500) {
                    return this.setState({ errorServer: 'Error server TODO ...' });
                }
                return response.json().then((json) => {
                    if (response.status >= 400 && response.status < 500) {
                        return this.setState({ errorRequestSyntax: json._error });
                    }
                    const { total } = json;
                    return this.setState({
                        size: (total <= this.state.limitNbDoc ? total : this.state.limitNbDoc),
                        total,
                    });
                });
            })
            .catch((error) => {
                console.error('TODO gérer ce cas', error);
            });
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;

        const value = target.type && target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
        });
    }

    handleFiletypeChange(filetypeEvent) {
        const { filetype, value } = filetypeEvent;
        const name = 'extract'.concat(filetype.charAt(0).toUpperCase()).concat(filetype.slice(1));
        this.setState({
            [name]: value,
        });
    }

    handleFormatChange(formatEvent) {
        const filetype = formatEvent.filetype;
        const format = formatEvent.format;
        const name = 'extract'
            .concat(filetype.charAt(0).toUpperCase()).concat(filetype.slice(1))
            .concat(format.charAt(0).toUpperCase()).concat(format.slice(1));
        this.setState({
            [name]: formatEvent.value,
        });
    }

    handleSubmit(event) {
        const { href } = this.buildURLFromState();
        this.setState({
            downloading: true,
            URL2Download: href,
        });
        window.setTimeout(() => {
            window.location = href;
        }, 1000);
        event.preventDefault();
    }

    handleCancel(event) {
        this.setState({
            downloading: false,
            q: '',
            URL2Download: '',
        });
        event.preventDefault();
    }

    buildURLFromState() {
        const ISTEX = new URL('https://api.istex.fr/document/');

        const filetypeFormats = Object.keys(this.state)
            .filter(key => key.startsWith('extract'))
            .filter(key => this.state[key])
            .map(key => decamelize(key, '-'))
            .map(key => key.split('-').slice(1))
            .map(([filetype, format]) => ({ filetype, format }))
            .reduce((prev, { filetype, format }) => {
                if (!prev[filetype]) {
                    prev[filetype] = [format];
                } else {
                    prev[filetype].push(format);
                }
                return prev;
            }, {});


        const extract = Object.keys(filetypeFormats)
            .reduce((prev, filetype) => {
                const formats = filetypeFormats[filetype];
                if (formats[0]) {
                    return prev
                        .concat(filetype)
                        .concat('[')
                        .concat(formats.join(','))
                        .concat('];');
                }
                return prev.concat(filetype).concat(';');
            }
                , '')
            .slice(0, -1);

        ISTEX.searchParams.set('q', this.state.q);
        ISTEX.searchParams.set('extract', extract);
        ISTEX.searchParams.set('size', this.state.size);

        return ISTEX;
    }

    render() {
        const popoverRequestHelp = (
            <Popover
                id="popover-request-help"
                html="true"
                title="Aide à la construction de requêtes"
                trigger="click"
            >
                Aidez-vous du <a href="http://demo.istex.fr/" rel="noopener noreferrer" target="_blank">démonstrateur Istex</a> ou
                de la <a href="https://api.istex.fr/documentation/search/" rel="noopener noreferrer" target="_blank">documentation Istex</a> pour construire votre requête.<br />
                Des exemples vous sont également proposés sur la droite.<br />
                Si vous avez besoin de conseils, <a href="mailto:contact@listes.istex.fr">contactez l’équipe Istex</a>.
            </Popover>
        );
        const popoverRequestExamples = (
            <Popover
                id="popover-request-examples"
                html="true"
                title="Exemples de requêtes"
                trigger="click"
            >
                Voici quelques exemples de requêtes dont vous pouvez vous inspirer.
                Cliquez sur celle de votre choix et la zone de requête sera remplies par le contenu de l’exemple.
            </Popover>
        );
        const resetTooltip = (
            <Tooltip data-html="true">Réinitialisez votre requête (les formulaires de cette page seront vidés)</Tooltip>
        );
        const previewTooltip = (
            <Tooltip data-html="true">Cliquez pour pré-visualiser les documents correspondant à votre requête</Tooltip>
        );
        const popoverRequestLimitWarning = (
            <Popover
                id="popover-request-limit-warning"
                html="true"
                title="Attention"
                trigger="click"
            >
                Reformulez votre requête ou vous ne pourrez télécharger que les {this.state.size} premiers documents
                classés par ordre de pertinence (sur les {this.state.total} résultats potentiels).
            </Popover>
        );

        const popoverRequestLimitHelp = (
            <Popover
                id="popover-request-limit-help"
                html="true"
                title="Limite temporaire"
                trigger="click"
            >
                Aujourd’hui, il n’est pas possible de télécharger plus de {this.state.limitNbDoc} documents.
                L’<a href="mailto:contact@listes.istex.fr">équipe Istex</a> travaille à augmenter cette limite.
            </Popover>
        );
        const enrichmentsDisabledTooltip = (
            <Tooltip data-html="true">Les différents enrichissements proposés dans Istex seront prochainement téléchargeables</Tooltip>
        );
        return (
            <div className={`container-fluid ${this.props.className}`}>

                <form onSubmit={this.handleSubmit}>

                    <div className="istex-dl-request row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <h2>
                                Requête
                                &nbsp;
                                <OverlayTrigger trigger="click" placement="top" overlay={popoverRequestHelp}>
                                    <span role="button" className="glyphicon glyphicon-question-sign" />
                                </OverlayTrigger>
                                &nbsp;
                                <OverlayTrigger placement="right" overlay={resetTooltip}>
                                    <span
                                        role="button" className="glyphicon glyphicon-erase"
                                        onClick={() => this.setState({ q: '' })}
                                    />
                                </OverlayTrigger>

                            </h2>
                            <p>Formulez ci-dessous l’équation qui décrit le corpus souhaité.</p>
                            <div className="form-group">
                                <textarea
                                    className="form-control"
                                    placeholder="brain AND language:fre"
                                    name="q"
                                    id="q"
                                    rows="3"
                                    autoFocus="true"
                                    value={this.state.q}
                                    onChange={this.handleQueryChange}
                                />
                            </div>

                            {this.state.total > 0 && this.state.q !== '' &&
                            <p>
                                L’équation saisie retourne
                                &nbsp;
                                <OverlayTrigger placement="bottom" overlay={previewTooltip}>
                                    <a>
                                        {this.state.total ? String(this.state.total).concat(' documents') : ''}
                                    </a>
                                </OverlayTrigger>
                                &nbsp;
                                {this.state.total > this.state.size &&
                                <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={popoverRequestLimitWarning}
                                >
                                    <span
                                        role="button"
                                        className="glyphicon glyphicon-warning-sign"
                                        style={{ color: 'red' }}
                                    />
                                </OverlayTrigger>
                                }
                            </p>
                            }

                            <div className="form-group">
                                Limite du nombre de documents souhaités
                                &nbsp;
                                <OverlayTrigger
                                    trigger="click"
                                    placement="right"
                                    overlay={popoverRequestLimitHelp}
                                >
                                    <span role="button" className="glyphicon glyphicon-question-sign" />
                                </OverlayTrigger>
                                &nbsp;
                                :
                                &nbsp;&nbsp;
                                <div style={{ width: '100px', display: 'inline-block' }}>
                                    <NumericInput
                                        className="form-control"
                                        min={0} max={this.state.limitNbDoc} value={this.state.size}
                                        onChange={size => this.setState({ size })}
                                    />
                                </div>
                                &nbsp;&nbsp;&nbsp;
                                <div style={{ width: '200px', display: 'inline-block' }}>
                                    <InputRange
                                        id="nb-doc-to-download"
                                        maxValue={this.state.limitNbDoc}
                                        minValue={0}
                                        value={this.state.size}
                                        onChange={size => this.setState({ size })}
                                    />
                                </div>
                            </div>

                        </div>

                        <div className="istex-dl-examples col-lg-2">
                            <h4>
                                Exemples de corpus à télécharger &nbsp;
                                <OverlayTrigger trigger="click" placement="left" overlay={popoverRequestExamples}>
                                    <span role="button" className="glyphicon glyphicon-question-sign" />
                                </OverlayTrigger>
                            </h4>

                            <button type="button" className="btn-exemple btn-sm">Poisson</button>&nbsp;
                            <button type="button" className="btn-exemple btn-sm">Vieillissement</button>&nbsp;
                            <button type="button" className="btn-exemple btn-sm">Polaris</button>

                        </div>
                    </div>

                    {this.state.errorRequestSyntax &&
                    <div className="istex-dl-error-request row">
                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <p>
                                Erreur de syntaxe dans votre requête &nbsp;
                                <OverlayTrigger trigger="click" placement="top" overlay={popoverRequestHelp}>
                                    <span role="button" className="glyphicon glyphicon-question-sign" />
                                </OverlayTrigger>
                                <br />
                                <blockquote>{this.state.errorRequestSyntax}</blockquote>
                            </p>
                        </div>
                        <div className="col-lg-2" />
                    </div>
                    }


                    <div className="istex-dl-format row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <h2>
                                Formats et types de fichiers
                            </h2>
                            <p>Créez votre sélection en cochant ou décochant les cases ci-dessous.</p>

                            <Filetype
                                label="Métadonnées"
                                filetype="metadata"
                                formats="xml,mods"
                                labels="XML|MODS"
                                value={this.state.extractMetadata}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Texte intégral"
                                filetype="fulltext"
                                formats="pdf,tei,txt,ocr,zip,tiff"
                                labels="PDF|TEI|TXT|OCR|ZIP|TIFF"
                                value={this.state.extractFulltext}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Annexes"
                                filetype="annexes"
                                formats="pdf,jpeg,qt,ppt,xls,avi,xml,gif,wmv"
                                labels="PDF|JPEG|QT|PPT|XLS|AVI|XML|GIF|WMV"
                                value={this.state.extractAnnexes}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Couvertures"
                                filetype="covers"
                                formats="pdf,gif,jpg"
                                labels="PDF|GIF|JPEG"
                                value={this.state.extractCovers}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />

                            <Filetype
                                label="Enrichissements"
                                filetype="enrichments"
                                formats="tei"
                                labels="TEI"
                                value={this.state.extractEnrichments}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                        </div>
                        <div className="col-lg-2" />
                    </div>

                    <div className="istex-dl-download row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8 text-center">
                            <button type="submit" className="btn btn-theme btn-lg">
                                <span className="glyphicon glyphicon-download-alt" aria-hidden="true" />
                                Télécharger
                            </button>
                        </div>
                        <div className="col-lg-2" />

                    </div>

                    {this.state.errorDuringDownload &&
                    <div className="istex-dl-error-download row">
                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <p>
                                <span role="button" className="glyphicon glyphicon-warning-sign" aria-hidden="true" />&nbsp;
                                Votre téléchargement s’est interrompu :
                                <blockquote>« …message technique de l’API… »</blockquote>
                                Veuillez réessayer plus tard ou <a href="mailto:contact@listes.istex.fr">contactez l’équipe Istex</a>
                            </p>
                        </div>
                        <div className="col-lg-2" />
                    </div>
                    }

                </form>

                <Modal show={this.state.downloading} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>Téléchargement</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        La génération de votre corpus est en cours...
                    </Modal.Body>

                    <Modal.Footer>
                        <Modal.Footer>
                            <Button onClick={this.handleCancel}>Fermer</Button>
                        </Modal.Footer>
                    </Modal.Footer>
                </Modal>
            </div>
        );
    }
}

Form.defaultProps = {
    className: '',
};
Form.propTypes = {
    className: PropTypes.string,
};
