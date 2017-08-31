import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'react-bootstrap';
import './Format.css';


export default class Format extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
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
        });

        this.props.onChange({
            filetype: this.props.filetype,
            format: this.props.format,
            value,
        });
    }

    render() {
        return (
            <Checkbox
                inline
                id={`checkbox${this.props.filetype}${this.props.format}`}
                name={this.props.format}
                checked={this.state[this.props.format]}
                onChange={this.handleInputChange}
            >
                {this.props.label}
            </Checkbox>
        );
    }
}

Format.propTypes = {
    label: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    filetype: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
