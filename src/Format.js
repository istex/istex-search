import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, OverlayTrigger, Tooltip, Button, Popover } from 'react-bootstrap';

import Labelize from './i18n/fr';

const ucfirst = input => input.charAt(0).toUpperCase().concat(input.slice(1));
const text = (name, def) => (Labelize[name] ? Labelize[name] : def);


export default class Format extends React.Component {

    constructor(props) {
        super(props);
        const fullName = 'extract'.concat(ucfirst(this.props.filetype)).concat(ucfirst(this.props.format));
        /*    if (window.localStorage && JSON.parse(localStorage.getItem('dlISTEXstateForm'))) {
            this.state = {

                name: fullName,
                [props.format]: JSON.parse(localStorage.getItem('dlISTEXstateForm'))[fullName],
            };
        } else { */
        this.state = {
            name: fullName,
            [props.format]: props.value,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;
        this.setState({
            [name]: value,
        }, () => this.props.verifyOtherFormats(this.props.filetype));

        this.props.onChange({
            filetype: this.props.filetype,
            format: this.props.format,
            value,
        });
        this.props.updateParent(this.props.filetype, value);
    }


    check() {
        if (this.props.disabled === false) {
            this.setState({
                [this.props.format]: true,
            });
            this.props.onChange({
                filetype: this.props.filetype,
                format: this.props.format,
                value: true,
            });
        }
    }

    uncheck() {
        if (this.props.disabled === false) {
            this.setState({
                [this.props.format]: false,
            });
            this.props.onChange({
                filetype: this.props.filetype,
                format: this.props.format,
                value: false,
            });
        }
    }


    render() {
        let tooltipText = '';
        const closingButton = (
            <Button
                bsClass="buttonClose"
                onClick={() => { document.body.click(); }}
            >
                &#x2716;
            </Button>);
        if (this.props.withPopover) {
            switch (this.props.label.toLowerCase()) {
            case 'pdf': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---pdf--portable-document-format-format-de-document-portable"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        PDF : Portable Document Format
                    </a> 
                    <br />
                    Fichier original fourni par l&apos;éditeur
                </p>
            );
                break;
            case 'tei': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---tei--text-encoding-initiative-initiative-pour-lencodage-du-texte"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TEI : Text Encoding Initiative
                    </a> 
                    <br />
                    Fichier XML produit par ISTEX selon les guidelines P5 du format TEI, soit à partir des XML originaux
                    fournis par l’éditeur, soit à partir du PDF via une transformation PDF to Text
                </p>
            );
                break;
            case 'txt': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---txt--text"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TXT : Text
                    </a> 
                    <br />
                    Fichier en texte brut produit par ISTEX à partir d’une transformation du PDF original à l’aide du logiciel PDF to Text ou via une chaîne de réocérisation permettant d’améliorer la qualité du texte
                </p>
            );
                break;
            case 'json': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---json--javascript-object-notation"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        JSON : JavaScript Object Notation
                    </a> 
                    <br />
                    Fichier produit par ISTEX rassemblant toutes les métadonnées et les enrichissements
                </p>
            );
                break;
            case 'zip': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---zip"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        ZIP
                    </a> 
                    <br />
                    Répertoire compressé contenant, pour chaque document du corpus, les fichiers fournis
                    par l’éditeur (PDF, XML structuré, images, couvertures, annexes), ainsi que le JSON produit par ISTEX
                </p>
            );
                break;
            case 'tiff': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---tiff--tagged-image-file-format-format-de-fichier-dimage-%C3%A9tiquet%C3%A9"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        TIFF : Tagged Image File Format
                    </a> 
                    <br />
                    Fichier original fourni par l’éditeur sous format image (uniquement pour les éditeurs EBBO et ECCO)
                </p>
            );
                break;
            case 'xml': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---xml--extensible-markup-language-langage-de-balisage-extensible"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        XML : Extensible Markup Language
                    </a> 
                    <br />
                    Fichier original fourni par l&apos;éditeur selon une DTD propre
                </p>
            );
                break;
            case 'mods': tooltipText = (
                <p>
                    <a
                        href="https://doc.istex.fr/tdm/annexes/liste-des-formats.html#o---mods--metadata-object-description-schema-sch%C3%A9ma-de-description-objet-de-m%C3%A9tadonn%C3%A9es"
                        target="_blank"
                        rel="noopener noreferrer"
                    >
                        MODS : Metadata Object Description Schema
                    </a>
                    <br />
                    Fichier XML standardisé produit par ISTEX à partir d’une transformation des XML originaux 
                </p>
            );
                break;
            case 'nb': tooltipText = (
                <p>
                    <a href="https://inist-category.data.istex.fr" target="_blank" rel="noopener noreferrer">Catégories scientifiques Inist</a> issues des classifications des bases Pascal et Francis. Elles ont été attribuées aux documents Istex par apprentissage automatique via l’approche statistique
                    «<a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-DV0BN0B8-J" target="_blank" rel="noopener noreferrer">&nbsp;Bayésien&nbsp;naïf&nbsp;</a>»
                    (Naive Bayesian ou nb)
                </p>
            );
                break;
            case 'multicat': tooltipText = (
                <p>
                    Catégories scientifiques <a href="https://sciencemetrix-category.data.istex.fr" target="_blank" rel="noopener noreferrer"> Science-Metrix</a>,&nbsp;
                    <a href="https://scopus-category.data.istex.fr/" target="_blank" rel="noopener noreferrer">Scopus</a> et <a href="https://wos-category.data.istex.fr" target="_blank" rel="noopener noreferrer"> Web of Science</a> rattachées aux documents Istex.
                    Issues des classifications homonymes, elles ont été attribuées aux documents par appariement grâce à l’outil multicat
                </p>
            );
                break;
            case 'refbibs': tooltipText = (
                <p>
                    Références bibliographiques des documents, structurées à l’aide de l’outil <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-2WXX0NK2-9" target="_blank" rel="noopener noreferrer">Grobid</a>
                </p>
            );
                break;
            case 'teeft': tooltipText = (
                <p>
                    Termes d’indexation, extraits des documents en texte intégral grâce à l’outil&nbsp;
                    <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-R25KK4KZ-Q" target="_blank" rel="noopener noreferrer">teeft</a>
                </p>
            );
                break;
            case 'unitex': tooltipText = (
                <p>
                    <a href="https://named-entity.data.istex.fr" target="_blank" rel="noopener noreferrer">Entités nommées</a>, extraites des documents Istex à l&apos;aide du logiciel <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-KGDTPS40-S" target="_blank" rel="noopener noreferrer">Unitex-CasSys</a>
                </p>
            );
                break;
            default: break;
            }
        } else {
            tooltipText = text(this.state.name, this.state.name);
        }

        const tooltip = (
            <Popover
                data-html="true"
                id="tooltip{this.props.filetype}{this.props.format}"
                title={<span> {this.props.format.toUpperCase()} {closingButton} </span>}
            >
                {tooltipText}
            </Popover>
        );
        return (
            <div>
                <Checkbox
                    bsClass="determinate"
                    id={`checkbox${this.props.filetype}${this.props.format}`}
                    name={this.props.format}
                    checked={this.state[this.props.format]}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                >
                    <span />           

                </Checkbox>
                <OverlayTrigger
                    trigger="click"
                    rootClose
                    placement="right"
                    overlay={tooltip}
                >   
                    <span className="labelFormat">{this.props.label} <i role="button" className="UsagePerso fa fa-info-circle" aria-hidden="true" /></span>                  
                </OverlayTrigger></div>
        );
    }
}

Format.propTypes = {
    label: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    filetype: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    value: PropTypes.bool,
    disabled: PropTypes.bool,
    updateParent: PropTypes.func.isRequired,
    verifyOtherFormats: PropTypes.func.isRequired,
    withPopover: PropTypes.bool,
};

Format.defaultProps = {
    disabled: false,
    value: false,
    withPopover: false,
};
