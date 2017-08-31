import React from 'react';
import PropTypes from 'prop-types';

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
            <div className="checkbox">
                <label htmlFor={`checkbox${this.props.filetype}${this.props.format}`}>{this.props.label}</label>
                <input
                    type="checkbox"
                    id={`checkbox${this.props.filetype}${this.props.format}`}
                    name={this.props.format}
                    checked={this.state[this.props.format]}
                    onChange={this.handleInputChange}
                />
            </div>
        );
    }
}

Format.propTypes = {
    label: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
    filetype: PropTypes.string.isRequired,
    onChange: PropTypes.func.isRequired,
};
