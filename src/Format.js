import React from 'react';
import PropTypes from 'prop-types';

export default class Format extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            checked: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({
            [name]: value,
        });
    }

    render() {
        return (
            <div className="checkbox">
                <label htmlFor="checkbox">{this.props.label}</label>
                <input
                    type="checkbox"
                    id="checkbox"
                    name={this.props.format}
                    checked={this.state.checked}
                    onChange={this.handleInputChange}
                />
            </div>
        );
    }
}

Format.propTypes = {
    label: PropTypes.string.isRequired,
    format: PropTypes.string.isRequired,
};
