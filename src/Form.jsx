import React from 'react';

export default class Form extends React.Component {
    render() {
        return (
          <form action="https://api.istex.fr/document/" method="get" className="form-horizontal">
            <div className="form-group">
              <label htmlFor="q" className="col-sm-1 control-label">Requête</label>
              <div className="col-sm-11">
                <textarea
                  name="q" id="q" rows="3" autoFocus="true" className="form-control"
                  placeholder="brain surgery"
                />
              </div>
            </div>
            <div className="checkbox">
              <label htmlFor="extractMetadata" className="col-sm-offset-1">Métadonnées</label>
              <input type="checkbox" name="extract" id="extractMetadata" value="metadata" />
            </div>
            <div className="checkbox">
              <label htmlFor="extractFulltext" className="col-sm-offset-1">Fulltext</label>
              <input type="checkbox" name="extract" id="extractFulltext" value="fulltext" />
            </div>
            <div className="checkbox">
              <label htmlFor="extractEnrichments" className="col-sm-offset-1">Enrichments</label>
              <input type="checkbox" name="extract" id="extractEnrichments" value="enrichments" />
            </div>
            <div className="checkbox">
              <label htmlFor="extractCover" className="col-sm-offset-1">Cover</label>
              <input type="checkbox" name="extract" id="extractCover" value="cover" />
            </div>
            <div className="checkbox">
              <label htmlFor="extractAnnexes" className="col-sm-offset-1">Annexes</label>
              <input type="checkbox" name="extract" id="extractAnnexes" value="annexes" />
            </div>
            <div className="form-group">
              <div className="col-sm-offset-1 col-sm-11">
                <button type="submit" className="btn btn-primary">Télécharger</button>
              </div>
            </div>
            <input type="hidden" name="size" value="100" />
          </form>
        );
    }
}

