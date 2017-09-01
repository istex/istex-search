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
            [props.format]: false,
            name: 'extract'.concat(ucfirst(this.props.filetype)).concat(ucfirst(this.props.format)),
        };

        this.handleInputChange = this.handleInputChange.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });

        this.props.onChange({
            filetype: this.props.filetype,
            format: this.props.format,
            value,
        });
    }

    render() {
        const tooltip = (
            <Tooltip data-html="true">{text(this.state.name, this.state.name)}</Tooltip>
        );

        return (
            <OverlayTrigger placement="top" overlay={tooltip}>
                <Checkbox
                    inline
                    id={`checkbox${this.props.filetype}${this.props.format}`}
                    name={this.props.format}
                    checked={this.state[this.props.format]}
                    onChange={this.handleInputChange}
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
};
