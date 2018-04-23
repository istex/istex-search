import React from 'react';
import $ from 'jquery';
import PropTypes from 'prop-types';
import InputRange from 'react-input-range';
import NumericInput from 'react-numeric-input';
import Textarea from 'react-textarea-autosize';
import { Modal, Button, OverlayTrigger, Popover, Tooltip } from 'react-bootstrap';
import decamelize from 'decamelize';
import 'react-input-range/lib/css/index.css';
import './Form.css';
import Filetype from './Filetype';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        const url = document.location.href;
        if (url.indexOf('q=') >= 0) {
            const urlTraite = decodeURIComponent(url.toString().substring(url.lastIndexOf('=') + 1));
            this.state = {
                q: urlTraite,
                size: 5000,
                limitNbDoc: 10000,
                extractMetadata: false,
                extractFulltext: false,
                extractEnrichments: false,
                extractCovers: false,
                extractAnnexes: false,
                downloading: false,
                URL2Download: '',
                errorRequestSyntax: '',
                errorDuringDownload: '',
            };
            const eventQuery = new Event('Query');
            eventQuery.query = urlTraite;
            this.handleQueryChange(eventQuery);
        } else {
            this.state = {
                q: '',
                size: 5000,
                limitNbDoc: 10000,
                extractMetadata: false,
                extractFulltext: false,
                extractEnrichments: false,
                extractCovers: false,
                extractAnnexes: false,
                downloading: false,
                URL2Download: '',
                errorRequestSyntax: '',
                errorDuringDownload: '',
            };
        }


        this.handleQueryChange = this.handleQueryChange.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleFiletypeChange = this.handleFiletypeChange.bind(this);
        this.handleFormatChange = this.handleFormatChange.bind(this);
        this.handleCancel = this.handleCancel.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);

        this.child = [];
    }

    handleQueryChange(event, query = null) {
        const self = this;
        let queryNotNull = query;
        if (event) {
            this.setState({
                errorRequestSyntax: '',
                q: event.query || event.target.value,
            });
            queryNotNull = event.query || event.target.value;
        } else {
            this.setState({
                errorRequestSyntax: '',
            });
        }
        const ISTEX = this.buildURLFromState(queryNotNull, false);
        ISTEX.searchParams.delete('extract');
        if (this.istexDlXhr) {
            this.istexDlXhr.abort();
        }
        this.istexDlXhr = $.get(ISTEX.href)
        .done((json) => {
            const { total } = json;
            return self.setState({
                size: (total <= self.state.limitNbDoc ? total : self.state.limitNbDoc),
                total,
            });
        })
        .fail((err) => {
            if (err.status >= 500) {
                return self.setState({ errorServer: 'Error server TODO ...' });
            }
            if (err.status >= 400 && err.status < 500) {
                return self.setState({ errorRequestSyntax: err.responseJSON.error });
            }
            return null;
        },
        )
        .always(() => {
            self.istexDlXhr = null;
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

    buildURLFromState(query = null, withHits = true) {
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
            return prev
            .concat(filetype)
            .concat(formats[0] || formats.length > 1 ? '[' : '')
            .concat(!formats[0] ? formats.slice(1) : formats)
            .concat(formats[0] || formats.length > 1 ? '];' : ';');
        }
        , '')
        .slice(0, -1);
        ISTEX.searchParams.set('q', query || this.state.q);
        ISTEX.searchParams.set('extract', extract);
        if (withHits) {
            ISTEX.searchParams.set('size', this.state.size);
        }
        ISTEX.searchParams.set('sid', 'istex-dl');
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
                Aidez-vous du <a href="http://demo.istex.fr/" rel="noopener noreferrer" target="_blank">démonstrateur ISTEX</a> ou
                de la <a href="https://api.istex.fr/documentation/search/" rel="noopener noreferrer" target="_blank">documentation ISTEX</a> pour construire votre requête.<br />
                Des exemples vous sont également proposés sur la droite.<br />
                Si vous avez besoin de conseils, <a href="mailto:contact@listes.istex.fr">contactez l’équipe ISTEX</a>.
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
                Cliquez sur celle de votre choix et la zone de requête sera remplie par le contenu de l’exemple.
            </Popover>
        );
        const queryExample1 = 'id:(EC2AEDC35AEE067247941C2E4FCDBC02064CD3F0 OR '
                            + 'B26BE9965A30A15CD9C2A71BA8E68F4DD8B85AB9 OR 3A8120D6DED99C2FAD8D43AF79856518895BA64A OR '
                            + '1AF40874F4E6B8EF15BDFB36AFA89A44D36BBA58 OR 01EB25144332E39473868AF8B0F14983799C26F6 OR '
                            + '17D7475DD004ED094F4F47CFC05D8EC2B8700646 OR 514805A478954ADD1317C6CA82BADF3B26490A61 OR '
                            + '6B98A9867529969E3C54E224CE4A1533BE6CBEB1)';
        const popoverRequestExample1 = (
            <Popover
                id="popover-request-example1"
                html="true"
                title="Extrait corpus “Vieillissement”"
                trigger="click"
            >
                Équation utilisant des identifiants ISTEX<br />
                <button
                    type="button" className="btn-sm"
                    onClick={() => {
                        this.setState({
                            q: queryExample1,
                        });
                        this.handleQueryChange(null, queryExample1);
                    }}
                >
                    Essayer cette requête
                </button>
            </Popover>
        );
        const queryExample2 = '((host.issn:"0922-6435" AND publicationDate:1995) OR (host.issn:"1387-6473" AND '
                            + 'publicationDate:2001) OR (host.title:"JOURNAL OF GEOPHYSICAL RESEARCH: SPACE PHYSICS" '
                            + 'AND publicationDate:1980 AND host.issue.raw:A1)) AND genre:("research-article" OR '
                            + '"article" OR "brief-communication")';
        const popoverRequestExample2 = (
            <Popover
                id="popover-request-example2"
                html="true"
                title="Extrait corpus “Astrophysique”"
                trigger="click"
            >
                Équation utilisant des données bibliographiques<br />
                <button
                    type="button" className="btn-sm"
                    onClick={() => {
                        this.setState({
                            q: queryExample2,
                        });
                        this.handleQueryChange(null, queryExample2);
                    }}
                >
                    Essayer cette requête
                </button>
            </Popover>
        );
        const queryExample3 = 'abstract:((species OR genus) AND (/fishe?s?/ chondrichth* osteichth*)) AND '
                            + 'language:eng AND qualityIndicators.pdfVersion:[1.2 TO *] AND '
                            + 'qualityIndicators.score:[3.0 TO *] AND (publicationDate:[1950 TO *] OR '
                            + 'copyrightDate:[1950 TO *]) NOT '
                            + '(fungu* bacteria* /microorganisms?/ /viruse?s?/ neuro* botan* protozoa* parasit*)';
        const popoverRequestExample3 = (
            <Popover
                id="popover-request-example3"
                html="true"
                title="Extrait corpus “Poissons”"
                trigger="click"
            >
                Équation utilisant des mots-clés, des données bibliographiques et des indicateurs de qualité<br />
                <button
                    type="button" className="btn-sm"
                    onClick={() => {
                        this.setState({
                            q: queryExample3,
                        });
                        this.handleQueryChange(null, queryExample3);
                    }}
                >
                    Essayer cette requête
                </button>
            </Popover>
        );
        const queryExample4 = 'title:(Arctic NOT (arctic AND /charr?/) OR Arctique OR Subarctic~1 OR '
                            + 'Sub?arctic OR Subarctique OR "North pole" OR "pôle Nord" OR "north?west passage" OR '
                            + '"northwest passage" OR "Passage du Nord-Ouest" OR "north?east passage" OR '
                            + '"northeast passage" OR "passage du Nord-Est" OR "Northern sea route" OR '
                            + '"route maritime du Nord" OR Alaska  OR Greenland OR Groënland OR Groenland OR '
                            + 'Grönland OR Grünland OR Grønland OR Iceland OR Islande OR Svalbard OR '
                            + '/spit[sz]berg(en)?/ OR Lapland OR Laponie OR Finnmark OR "Northwest Territories" OR '
                            + '"Territoires du Nord-Ouest" OR /nun[ai](tsia)?v[aiu][tk]/ OR "Ile Ellesmere" OR '
                            + '"Ellesmere Island" OR "Queen Elizabeth Islands" OR "îles Reine Elizabeth" OR '
                            + '(Franz AND /jose[fp]h?/ AND Land) OR "Archipel François-Joseph" OR '
                            + '"Terre François-Joseph" OR "Jan Mayen" OR "Kola Peninsula" OR "Péninsule de Kola" OR '
                            + '"Novaya Zemlya" OR "Nouvelle Zemble" OR "Severnaya Zemlya" OR Chukotka OR Tchoukotka OR '
                            + '"New Siberian Islands" OR "îles de Nouvelle-Sibérie" OR "Nouvelle-Sibérie" OR '
                            + '/[yi]ako?uti?[ae]?/ OR Sakha OR "Oural Polaire" OR "Polar Urals" OR Baffin OR '
                            + 'Barents OR Chukchi OR "Mer des Tchouktches" OR "Mer Blanche" OR "White Sea" OR '
                            + '"Mer de Beaufort" OR "Beaufort Sea" OR "Mer de Kara" OR "Kara Sea" OR '
                            + '"Mer de Laptev" OR "Laptev Sea" OR "Mer de Norvège" OR "Norwegian Sea" OR '
                            + '"Mer de Sibérie Est" OR "Mer de Sibérie Orientale" OR "East Siberian Sea" OR '
                            + '"Beaufort seas"~2  OR "East Siberian seas"~2 OR "Kara seas"~2  OR "Laptev seas"~2 OR '
                            + '"Norwegian seas"~2 OR "White seas"~2 OR "Détroit de Davis" OR "Davis Strait" OR '
                            + '"Détroit du Danemark" OR "Danemark Strait" OR "Détroit de Fram" OR "Fram Strait" OR '
                            + '(/beh?ring/ AND strait) OR (Détroit AND de AND /beh?ring/) OR /ale?o?ut[ei]?i?[tq]?/ OR '
                            + '/sugpia[tq]/ OR Tchouktches OR Inuit OR Inuk OR Inuvialuit OR /i[nñ]upia?[tqk]/ OR '
                            + '/naukan(ski)?/ OR /nenee?[nt]s(es)?/ OR Samoyeds OR /sag?[dl]l[ei]u?rmiut/ OR Sámi OR '
                            + 'Saami OR Lapps OR Laplanders OR Lapons OR /sireniki?/ OR /es[kq]u?im[oa]u?[sx]?/ OR '
                            + '/yupii?[tk]/ OR "Yup\'ik") AND publicationDate:[* TO 1918}';
        const popoverRequestExample4 = (
            <Popover
                id="popover-request-example4"
                html="true"
                title="Extrait corpus “Polaris”"
                trigger="click"
            >

                Équation utilisant des mots-clés, ainsi que tous les types d’opérateurs
                et de modes de recherches proposés dans ISTEX<br />

                <button
                    type="button" className="btn-sm"
                    onClick={() => {
                        this.setState({
                            q: queryExample4,
                        });
                        this.handleQueryChange(null, queryExample4);
                    }}
                >
                Essayer cette requête
                </button>
            </Popover>
        );
        const resetTooltip = (
            <Tooltip data-html="true" id="resetTooltip">
                Réinitialisez votre requête (les formulaires de cette page seront vidés)
            </Tooltip>
        );
        const previewTooltip = (
            <Tooltip data-html="true" id="previewTooltip">
                Cliquez pour pré-visualiser les documents correspondant à votre requête
            </Tooltip>
        );
        const popoverRequestLimitWarning = (
            <Popover
                id="popover-request-limit-warning"
                html="true"
                title="Attention"
                trigger="click"
            >
                Reformulez votre requête ou vous ne pourrez télécharger que les {this.state.size} premiers documents,
                classés par ordre de pertinence, (sur les {this.state.total} résultats potentiels)
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
                L’<a href="mailto:contact@listes.istex.fr">équipe ISTEX</a> travaille à augmenter cette limite.
            </Popover>
        );
        const enrichmentsDisabledTooltip = (
            <Tooltip data-html="true" id="enrichmentsDisabledTooltip">
                Les différents enrichissements proposés dans ISTEX seront prochainement téléchargeables
            </Tooltip>
        );

        const coversTooltip = (
            <Tooltip data-html="true" id="coversTooltip">
                Documents textuels, images, etc.
            </Tooltip>
        );

        const appendicesTooltip = (
            <Tooltip data-html="true" id="appendicesTooltip">
                Documents textuels, images, vidéos, etc.
            </Tooltip>
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
                                <OverlayTrigger
                                    placement="right"
                                    overlay={resetTooltip}
                                    onClick={() => this.setState({ q: '' })}
                                >
                                    <span
                                        role="button" className="glyphicon glyphicon-erase"
                                    />
                                </OverlayTrigger>

                            </h2>
                            <p>Formulez ci-dessous l’équation qui décrit le corpus souhaité :</p>
                            <div className="form-group">
                                <Textarea
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
                                    L’équation saisie correspond à
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

                            <OverlayTrigger
                                trigger="focus"
                                placement="left"
                                overlay={popoverRequestExample1}
                            >
                                <button type="button" className="btn-exemple btn-sm">Vieillissement</button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                                trigger="focus"
                                placement="left"
                                overlay={popoverRequestExample2}
                            >
                                <button type="button" className="btn-exemple btn-sm">Astrophysique</button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                                trigger="focus"
                                placement="left"
                                overlay={popoverRequestExample3}
                            >
                                <button type="button" className="btn-exemple btn-sm">Poissons</button>
                            </OverlayTrigger>
                            &nbsp;
                            <OverlayTrigger
                                trigger="focus"
                                placement="left"
                                overlay={popoverRequestExample4}
                            >
                                <button type="button" className="btn-exemple btn-sm">Polaris</button>
                            </OverlayTrigger>
                            &nbsp;

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


                    <div className="istex-dl-format row" >

                        <div className="col-lg-2" />
                        <div className="col-lg-8">
                            <h2>
                                Formats et types de fichiers
                            </h2>
                            <p>Créez votre sélection en cochant ou décochant les cases ci-dessous :</p>

                            <Filetype
                                ref={(instance) => { this.child[0] = instance; }}
                                label="Métadonnées"
                                filetype="metadata"
                                formats="xml,mods,json"
                                labels="XML|MODS|JSON"
                                value={this.state.extractMetadata}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />

                            <Filetype
                                ref={(instance) => { this.child[1] = instance; }}
                                label="Texte intégral"
                                filetype="fulltext"
                                formats="pdf,tei,txt,ocr,zip,tiff"
                                labels="PDF|TEI|TXT|OCR|ZIP|TIFF"
                                value={this.state.extractFulltext}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                            />
                            <Filetype
                                ref={(instance) => { this.child[2] = instance; }}
                                label="Annexes"
                                filetype="annexes"
                                formats=""
                                labels=""
                                value={this.state.extractAnnexes}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                                tooltip={appendicesTooltip}
                            />
                            <Filetype
                                ref={(instance) => { this.child[3] = instance; }}
                                label="Couvertures"
                                filetype="covers"
                                formats=""
                                labels=""
                                value={this.state.extractCovers}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                                tooltip={coversTooltip}
                            />

                            <Filetype
                                ref={(instance) => { this.child[4] = instance; }}
                                label="Enrichissements"
                                filetype="enrichments"
                                formats="tei"
                                labels="TEI"
                                value={this.state.extractEnrichments}
                                onChange={this.handleFiletypeChange}
                                onFormatChange={this.handleFormatChange}
                                disabled
                                tooltip={enrichmentsDisabledTooltip}
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
                                    <span
                                        role="button"
                                        className="glyphicon glyphicon-warning-sign"
                                        aria-hidden="true"
                                    />
                                    &nbsp;
                                    Votre téléchargement s’est interrompu :
                                    <blockquote>
                                        « …message technique de l’API… »
                                    </blockquote>
                                    Veuillez réessayer plus tard ou
                                    <a href="mailto:contact@listes.istex.fr">contactez l’équipe ISTEX</a>
                                </p>
                            </div>
                            <div className="col-lg-2" />
                        </div>
                    }

                </form>

                <Modal show={this.state.downloading} onHide={this.close}>
                    <Modal.Header>
                        <Modal.Title>Téléchargement en cours</Modal.Title>
                    </Modal.Header>

                    <Modal.Body>
                        <div className="text-center">
                            La génération de votre corpus est en cours.<br />
                        Veuillez patienter. L’archive sera bientôt téléchargée...
                        <br />
                            <img src="/images/loader.gif" alt="" />
                        </div>

                        <br />
                        Info utilisateurs : Si votre corpus dépasse 4 Go, vous ne pourrez
                        ouvrir l’archive zip sous Windows. Veuillez utiliser par exemple
                        &nbsp;<a href="http://www.7-zip.org/" target="_blank" rel="noopener noreferrer">7zip</a> qui sait
                        gérer les grandes tailles.
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
