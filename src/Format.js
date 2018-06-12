import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, OverlayTrigger, Tooltip } from 'react-bootstrap';

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
        if (this.props.withPopover) {
            switch (this.props.label) {
            case 'nb': tooltipText = (
                <p>
                    <a href="https://inist-category.data.istex.fr">Catégories scientifiques Inist</a> des bases Pascal et Francis,
                    attribuées aux documents Istex par apprentissage automatique via l’approche
                    statistique «<a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-DV0BN0B8-J">&nbsp;Bayésien&nbsp;naïf&nbsp;</a>» (Naive Bayesian ou nb).
                </p>
                );
                break;
            case 'multicat': tooltipText = (
                <p>
                    Catégories scientifiques <a href="https://sciencemetrix-category.data.istex.fr"> Science Metrix</a>,
                    <a href="https://scopus-category.data.istex.fr/"> Scopus</a> et <a href="https://wos-category.data.istex.fr"> Web Science</a>, attribuées aux documents Istex par appariement via
                    l’outil multicat.
                </p>
                );
                break;
            case 'teeft': tooltipText = (
                <p>
                    Termes d’indexation, extraits des documents en texte intégral grâce à l’outil
                     <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-R25KK4KZ-Q"> teeft</a>.
                </p>
                );
                break;
            case 'refBibs': tooltipText = (
                <p>
                    Références bibliographiques des documents, structurées à l’aide de l’outil <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-2WXX0NK2-9">Grobid</a>
                </p>
                );
                break;
            case 'unitex': tooltipText = (
                <p>
                    <a href="https://named-entity.data.istex.fr">Entités nommées Istex</a>, extraites des documents à l&apos;aide du logiciel <a href="https://enrichment-process.data.istex.fr/ark:/67375/R0H-KGDTPS40-S">Unitex-CasSys</a>.
                </p>
                );
                break;
            default: break;
            }
        } else {
            tooltipText = text(this.state.name, this.state.name);
        }

        const tooltip = (
            <Tooltip
                data-html="true"
                id="tooltip{this.props.filetype}{this.props.format}"
            >
                {tooltipText}
            </Tooltip>
    );
        return (
            <Checkbox
                bsClass="determinate"
                id={`checkbox${this.props.filetype}${this.props.format}`}
                name={this.props.format}
                checked={this.state[this.props.format]}
                onChange={this.handleInputChange}
                disabled={this.props.disabled}
            >
                <span />
                {<OverlayTrigger
                    placement="top"
                    delayHide={this.props.withPopover ? 1000 : 100}
                    overlay={tooltip}
                >
                    <span className="labelFormat">{this.props.label} </span>
                </OverlayTrigger>}
            </Checkbox>
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
