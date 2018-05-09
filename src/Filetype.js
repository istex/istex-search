import React from 'react';
import PropTypes from 'prop-types';
import { Popover, Checkbox, FormGroup, OverlayTrigger } from 'react-bootstrap';
import Format from './Format';

import './Filetype.css';

export default class Filetype extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            [props.filetype]: false,
            indeterminate: false,
        };
        this.handleInputChange = this.handleInputChange.bind(this);
        this.updateCurrent = this.updateCurrent.bind(this);
        this.verifyChildren = this.verifyChildren.bind(this);
        this.child = [];
        if (this.props.formats) {
            this.formats = props.formats.split(',')
            .map((format, n) => <Format
                ref={(instance) => { this.child[n] = instance; }}
                key={`format${format}`}
                label={props.labels.split('|')[n]}
                format={format}
                filetype={props.filetype}
                onChange={props.onFormatChange}
                disabled={props.disabled}
                updateParent={this.updateCurrent}
                verifyOtherFormats={this.verifyChildren}

            />);
        }

        this.overlayedLabel = (
            <span>{props.label}</span>
        );

        this.popoverText = '';
        switch (this.props.filetype) {
        case 'metadata': this.popoverText = 'Insérer texte pour les Métadonnées';
            break;
        case 'fulltext': this.popoverText = 'Insérer texte pour les textes intégraux';
            break;
        case 'annexes': this.popoverText = 'Documents textuels, images, vidéos, etc.';
            break;
        case 'covers': this.popoverText = 'Documents textuels, images, etc.';
            break;
        case 'enrichments': this.popoverText = 'Insérer texte pour les Enrichissements';
            break;
        default: this.popoverText = 'Type de Fichier Non reconnu';
        }
    }

    componentDidMount() {
        if (this.child.length !== 0) {
            this.verifyChildren(this.props.filetype);
        } else if (window.localStorage && JSON.parse(localStorage.getItem('dlISTEXstateForm'))) {
            const name = 'extract'
            .concat(this.props.filetype.charAt(0).toUpperCase())
            .concat(this.props.filetype.slice(1));
            if (JSON.parse(localStorage.getItem('dlISTEXstateForm'))[name]) {
                this.checkCurrent(this.props.filetype);
            }
        }
    }

    checkChildren() {
        this.child.forEach((c) => {
            c.check(this);
        });
    }

    uncheckChildren() {
        this.child.forEach((c) => {
            c.uncheck();
        });
    }

    updateCurrent(type) {
        this.setState({
            indeterminate: true,
        });
        if (JSON.parse(localStorage.getItem('dlISTEXstateForm'))) {
            this.setState({
                [type]: JSON.parse(localStorage.getItem('dlISTEXstateForm'))[type],
            });
        } else {
            this.setState({
                [type]: false,
            });
        }
    }

    checkCurrent(type) {
        this.setState({
            indeterminate: false,
            [type]: true,
        });

        this.props.onChange({
            filetype: this.props.filetype,
            value: true,
            format: this.state,
        });
    }

    uncheckCurrent(type) {
        this.setState({
            [type]: false,
            [this.props.filetype]: false,
            indeterminate: false,
        });

        this.props.onChange({
            filetype: this.props.filetype,
            value: false,
            format: this.state,
        });

        this.uncheckChildren();
    }

    verifyChildren(type) {
        if (this.child.length !== 0) {
            let noChildChecked = true;
            let i = 0;
            while (i < this.child.length && noChildChecked) {
                if (this.child[i].state[this.child[i].props.format]) {
                    noChildChecked = false;
                }
                i += 1;
            }
            if (noChildChecked) {
                this.uncheckCurrent(type);
            } else {
                i = 0;
                let allChildChecked = true;
                while (i < this.child.length && allChildChecked) {
                    if (!this.child[i].state[this.child[i].props.format]) {
                        allChildChecked = false;
                    }
                    i += 1;
                }
                if (allChildChecked) {
                    this.checkCurrent(type);
                } else {
                    this.updateCurrent(type);
                }
            }
        }
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        if (this.state.indeterminate) {
            this.setState({
                [name]: true,
                indeterminate: false,
            });
        } else if (this.state[name]) {
            this.setState({
                [name]: false,
                indeterminate: false,
            });
        } else {
            this.setState({
                [name]: true,
                indeterminate: false,
            });
        }
        this.props.onChange({
            filetype: this.props.filetype,
            value,
            format: this.state,
        });
        if (value) {
            this.checkChildren();
        } else {
            this.uncheckChildren();
        }
    }

    render() {
        let CssClass = null;
        if (this.state.indeterminate) {
            CssClass = 'indeterminate';
        } else {
            CssClass = 'determinate';
        }

        return (
            <FormGroup >
                <Checkbox
                    className={CssClass}
                    name={this.props.filetype}
                    checked={this.state[this.props.filetype]}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                >
                    <span />
                    {this.overlayedLabel}
                </Checkbox>
                <OverlayTrigger
                    rootClose
                    trigger="click"
                    placement="right"
                    overlay={
                        <Popover
                            id={`popover-${this.props.filetype}`}
                            title={`Descripiton ${this.props.label}`}
                        >
                            {this.popoverText}
                        </Popover>}
                >
                    <span role="button" id="glyphiconFiletype" className="glyphicon glyphicon-question-sign" />
                </OverlayTrigger>
                <FormGroup bsClass="indent">
                    {this.formats}
                </FormGroup>
            </FormGroup>
        );
    }
    }

Filetype.propTypes = {
    label: PropTypes.string.isRequired,
    filetype: PropTypes.string.isRequired,
    formats: PropTypes.string.isRequired,
    labels: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    onFormatChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
};

Filetype.defaultProps = {
    value: false,
    disabled: false,
};
