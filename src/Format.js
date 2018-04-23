import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox, OverlayTrigger, Tooltip } from 'react-bootstrap';

import './Format.css';
import Labelize from './i18n/fr';

const ucfirst = input => input.charAt(0).toUpperCase().concat(input.slice(1));
const text = (name, def) => (Labelize[name] ? Labelize[name] : def);


export default class Format extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            name: 'extract'.concat(ucfirst(this.props.filetype)).concat(ucfirst(this.props.format)),
            [props.format]: false,
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
        const tooltip = (
            <Tooltip data-html="true" id="tooltip{this.props.filetype}{this.props.format}">
                {text(this.state.name, this.state.name)}
            </Tooltip>
    );

        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <Checkbox
                    inline
                    id={`checkbox${this.props.filetype}${this.props.format}`}
                    name={this.props.format}
                    checked={this.state[this.props.format]}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                >
                    {this.props.label}
                </Checkbox>
            </OverlayTrigger>
        );
    }
  }

Format.propTypes = {
    label: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    filetype: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
    disabled: PropTypes.bool,
    updateParent: PropTypes.func.isRequired,
    verifyOtherFormats: PropTypes.func.isRequired,
};

Format.defaultProps = {
    disabled: false,
};
