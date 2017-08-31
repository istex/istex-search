import React from 'react';
import InputRange from 'react-input-range';
import { URL } from 'url';
import 'react-input-range/lib/css/index.css';
import './style.css';
import Filetype from '../Filetype';

export default class Form extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            q: '',
            size: 2000,
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
    }

    render() {
        return (
            <form className="form-horizontal" onSubmit={this.handleSubmit}>
                <Filetype
                    label="Métadonnées"
                    filetype="metadata"
                    formats="mods,tei"
                    labels="MODS|Text Encoding Initiative"
                />
                <div className="form-group">
                    <label htmlFor="size" className="col-sm-offset-1">Size</label>
                    <InputRange
                        maxValue={200}
                        minValue={0}
                        value={this.state.size}
                        onChange={size => this.setState({ size })}
                    />
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
