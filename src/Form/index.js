import React from 'react';
import InputRange from 'react-input-range';
import 'react-input-range/lib/css/index.css';
import './style.css';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            size: 1,
            extractMetadata: false,
            extractFulltext: false,
            extractEnrichments: false,
            extractCover: false,
            extractAnnexes: false,
        };

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleInputChange(event) {
        const target = event.target;
        const name = target.name;

        const value = target.type && target.type === 'checkbox' ? target.checked : target.value;

        this.setState({
            [name]: value,
        });
    }

    handleSubmit(event) {
        const toAPI = new URL('https://api.istex.fr/document/');
        let extract = '';

        if (this.state.extractMetadata) {
            extract = extract.concat('metadata;');
        }
        if (this.state.extractFulltext) {
            extract = extract.concat('fulltext;');
        }

        toAPI.searchParams.set('q', this.state.q);
        toAPI.searchParams.set('extract', extract);
        toAPI.searchParams.set('size', this.state.size);

        window.location = toAPI.href;
        event.preventDefault();
        return false;
    }

    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <div className="form-group">
                    <label htmlFor="q" className="col-sm-1 control-label">Requête</label>
                    <div className="col-sm-11">
                        <textarea
                            className="form-control"
                            name="q"
                            id="q"
                            rows="3"
                            autoFocus="true"
                            value={this.state.q}
                            onChange={this.handleInputChange}
                        />
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <div className="checkbox">
                            <label htmlFor="extractMetadata" className="col-sm-1">Métadonnées</label>
                            <input
                                className="col-sm-1"
                                type="checkbox"
                                id="extractMetadata"
                                name="extractMetadata"
                                checked={this.state.extractMetadata}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <div className="checkbox">
                            <label htmlFor="extractFulltext" className="col-sm-1">Fulltext</label>
                            <input
                                className="col-sm-1"
                                type="checkbox"
                                id="extractFulltext"
                                name="extractFulltext"
                                checked={this.state.extractFulltext}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">

                        <div className="checkbox">
                            <label htmlFor="extractEnrichments" className="col-sm-1">Enrichments</label>
                            <input
                                className="col-sm-1"
                                type="checkbox"
                                id="extractEnrichments"
                                name="extractEnrichments"
                                checked={this.state.extractEnrichments}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <div className="checkbox">
                            <label htmlFor="extractCover" className="col-sm-1">Cover</label>
                            <input
                                className="col-sm-1"
                                type="checkbox"
                                id="extractCover"
                                name="extractCover"
                                checked={this.state.extractCover}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>

                <div className="form-group">
                    <div className="col-sm-10">
                        <div className="checkbox">
                            <label htmlFor="extractAnnexes" className="col-sm-1">Annexes</label>
                            <input
                                className="col-sm-1"
                                type="checkbox"
                                id="extractAnnexes"
                                name="extractAnnexes"
                                checked={this.state.extractAnnexes}
                                onChange={this.handleInputChange}
                            />
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-10">
                        <div className="checkbox">
                            <label htmlFor="size" className="col-sm-1">Size</label>
                            <div className="col-sm-1">
                                <InputRange
                                    id="size"
                                    maxValue={200}
                                    minValue={0}
                                    value={this.state.size}
                                    onChange={size => this.setState({ size })}
                                />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="form-group">
                    <div className="col-sm-offset-1 col-sm-11">
                        <button type="submit" className="btn btn-primary">Télécharger</button>
                    </div>
                </div>
            </form>
        );
    }
}
