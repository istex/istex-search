import React from 'react';
import PropTypes from 'prop-types';
import { FormGroup, OverlayTrigger } from 'react-bootstrap';
import { Checkbox } from 'antd';
import Format from './Format';

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

        if (props.tooltip) {
            this.overlayedLabel = (
                <OverlayTrigger placement="top" overlay={this.props.tooltip}>
                    <span>{props.label}</span>
                </OverlayTrigger>
        );
        } else {
            this.overlayedLabel = props.label;
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

    updateCurrent(type, childNewValue) {
        this.setState({
            indeterminate: { childNewValue },
        });
        if (!childNewValue) {
            this.setState({
                [type]: false,
            });
        }

        this.props.onChange({
            filetype: this.props.filetype,
            value: false,
            format: this.state,
        });
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
            indeterminate: false,
        });

        this.props.onChange({
            filetype: this.props.filetype,
            value: false,
            format: this.state,
        });
    }

    verifyChildren(type) {
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
        return (
            <FormGroup >
                <Checkbox
                    bsStyle="default"
                    name={this.props.filetype}
                    checked={this.state[this.props.filetype]}
                    onChange={this.handleInputChange}
                    disabled={this.props.disabled}
                    indeterminate={this.state.indeterminate}
                >
                    {this.overlayedLabel}
                </Checkbox>
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
    tooltip: PropTypes.element,
};

Filetype.defaultProps = {
    value: false,
    disabled: false,
    tooltip: null,
};
