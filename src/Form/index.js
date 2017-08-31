import React from 'react';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import { Modal, Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import decamelize from 'decamelize';
import 'react-input-range/lib/css/index.css';
import './style.css';
import Filetype from '../Filetype';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            size: 1,
            limitNbDoc: 10000,
            extractMetadata: true,
            extractFulltext: false,
            extractEnrichments: false,
            extractCovers: false,
            extractAnnexes: false,
            downloading: false,
            URL2Download: '',
        };

        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFiletypeChange = this.handleFiletypeChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSave = this.handleSave.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleQueryChange(event) {
        const target = event.target;
        this.setState({
            q: target.value,
        });
        const ISTEX = this.buildURLFromState();

        ISTEX.searchParams.delete('extract');

        fetch(ISTEX.href)
            .then((response) => {
                if (response.status >= 400) {
                    throw new Error('Bad response from server');
                }
                return response.json().then((json) => {
                    const { total } = json;
                    this.setState({
                        total,
                    });
                });
            })
            .catch((error) => {
                console.error('Don\'t forget to display the error', error);
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
        event.preventDefault();
    }

    handleCancel(event) {
        this.setState({
            downloading: false,
            URL2Download: '',
        });
        event.preventDefault();
    }

    handleSave(event) {
        this.setState({
            downloading: false,
            URL2Download: '',
        });
        window.location = this.state.URL2Download;
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
        const previewTooltip = (
            <Tooltip data-html="true">Cliquez pour pré-visualiser les documents correspondant à votre requête</Tooltip>
        );
        const popoverRequestLimitWarning = (
            <Popover
                id="popover-basic"
                placement="right"
                html="true"
                title="Attention"
                trigger="click"
            >
                Vous souhaitez télécharger {this.state.total} résultats.
                Les {this.state.limitNbDoc} premiers seront téléchargés par ordre de pertinence.
            </Popover>
        );

        return (
            <div className={`container-fluid ${this.props.className}`}>

                <form className="form-horizontal" onSubmit={this.handleSubmit}>

                    <div className="istex-dl-request row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <h2>
                                Requête

                                <button type="button" className="istex-dl-help btn btn-default btn-sm">
                                    <span className="glyphicon glyphicon-question-sign" aria-hidden="true" />
                                </button>

                                <span role="button" className="glyphicon glyphicon-erase btn-sm" aria-hidden="true" />

                            </h2>

                            <div className="form-group">
                                <label htmlFor="q" className="col-sm-1 control-label">Requête</label>
                                <div className="col-sm-11">
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
                            </div>

                            {this.state.total > 0 &&
                            <p>
                                Aperçu des résultats de la requête :
                                &nbsp;
                                <OverlayTrigger placement="bottom" overlay={previewTooltip}>
                                    <a href="">
                                        {this.state.total ? String(this.state.total).concat(' documents') : ''}
                                    </a>
                                </OverlayTrigger>
                                &nbsp;
                                {this.state.total > this.state.limitNbDoc &&
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
                        </div>

                        <div className="istex-dl-examples col-lg-2">
                            <h3>Exemples de corpus à télécharger</h3>

                            <button type="button" className="istex-dl-help btn btn-default btn-sm">
                                <span className="glyphicon glyphicon-question-sign" aria-hidden="true" />
                            </button>
                        </div>
                    </div>

                    <div className="istex-dl-error-request row">
                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <p>Erreur de syntaxe dans votre requête</p>
                        </div>
                        <div className="col-lg-2" />
                    </div>



                    <div className="istex-dl-format row">

                        <div className="col-lg-2" />
                        <div className="col-lg-8">

                            <Filetype
                                label="Métadonnées"
                                filetype="metadata"
                                formats="xml,mods"
                                labels="XML|MODS"
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Texte intégral"
                                filetype="fulltext"
                                formats="pdf,tei,txt,ocr,zip,tiff"
                                labels="PDF|TEI|TXT|OCR|ZIP|TIFF"
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Annexes"
                                filetype="annexes"
                                formats="pdf,jpeg,qt,ppt,xls,avi,xml,gif,wmv"
                                labels="PDF|JPEG|QT|PPT|XLS|AVI|XML|GIF|WMV"
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Couvertures"
                                filetype="covers"
                                formats="pdf,gif,jpg"
                                labels="PDF|GIF|JPEG"
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                label="Enrichissements"
                                filetype="enrichments"
                                formats="tei"
                                labels="TEI"
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                        </div>
                        <div className="col-lg-2" />
                    </div>

                    <div className="istex-dl-request row">
                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <div className="form-group">
                                <div className="col-sm-10">
                                    <div className="checkbox">
                                        <label htmlFor="size" className="col-sm-1">Size</label>
                                        <div className="col-sm-1">
                                            <InputRange
                                                id="size"
                                                maxValue={this.state.limitNbDoc}
                                                minValue={0}
                                                value={this.state.size}
                                                onChange={size => this.setState({ size })}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="form-group">
                                    <div className="col-sm-offset-1 col-sm-11">
                                        <button type="submit" className="btn btn-primary">Télécharger</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
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
                            <Button onClick={this.handleCancel}>Annuler</Button>
                            <Button onClick={this.handleSave}>Enregistrer</Button>
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
