import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, OverlayTrigger, Tooltip, Popover } from 'react-bootstrap';

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
        let popOver = '';
        if (this.props.withPopover) {
            let popoverText = null;
            switch (this.props.label) {
            case 'nb': popoverText = (
                <p>
                    Catégories scientifiques Inist des bases Pascal et Francis,
                    attribuées aux documents Istex par apprentissage automatique via l’approche
                    statistique « Bayésien naïf » (Naive Bayesian ou nb).
                </p>
                );
                break;
            case 'multicat': popoverText = (
                <p>
                    Catégories scientifiques Science Metrix,
                    Scopus et Web of Science, attribuées aux documents Istex par appariement via
                    l’outil multicat.
                </p>
                );
                break;
            case 'teeft': popoverText = (
                <p>
                    Termes d’indexation, extraits des documents en texte intégral grâce à l’outil teeft.
                </p>
                );
                break;
            case 'refBibs': popoverText = (
                <p>
                    Références bibliographiques des documents, structurées à l’aide de l’outil Grobid.
                </p>
                );
                break;
            case 'unitex': popoverText = (
                <p>
                    Entités nommées Istex, extraites des documents à l&apos;aide du logiciel Unitex-CasSys.
                </p>
                );
                break;
            default: break;
            }

            popOver = (
                <Popover
                    id="popover-request-help"
                    title={<span>{this.props.label}</span>}
                >
                    {popoverText}
                </Popover>
            );
        }
        const tooltip = (
            <Tooltip data-html="true" id="tooltip{this.props.filetype}{this.props.format}">
                {text(this.state.name, this.state.name)}
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
                    overlay={this.props.withPopover ? popOver : tooltip}
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
