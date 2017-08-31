import React from 'react';
import PropTypes from 'prop-types';
import Format from './Format';

export default class Filetype extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            [props.filetype]: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        // this.handleFormatChange = this.handleFormatChange.bind(this);
        this.formats = props.formats.split(',')
            .map((format, n) => <Format
                key={`format${format}`}
                label={props.labels.split('|')[n]}
                format={format}
                filetype={props.filetype}
                onChange={props.onFormatChange}
            />);
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
            value,
            format: this.state,
        });
    }

    // handleFormatChange(formatEvent) {
    //     const filetype = formatEvent.filetype;
    //     const format = formatEvent.format;
    //     const name = 'extract'
    //         .concat(filetype.charAt(0).toUpperCase()).concat(filetype.slice(1))
    //         .concat(format.charAt(0).toUpperCase()).concat(format.slice(1));
    //     this.setState({
    //         [name]: formatEvent.value,
    //     });
    // }

    render() {
        return (
            <div className="checkbox">
                <label htmlFor="checkbox">{this.props.label}</label>
                <input
                    type="checkbox"
                    id="checkbox"
                    name={this.props.filetype}
                    checked={this.state[this.props.filetype]}
                    onChange={this.handleInputChange}
                />
                <div>
                    {this.formats}
                </div>
            </div>
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
};
