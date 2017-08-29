import React from 'react';

export default class Form extends React.Component {
    render() {
        return (
            <form action="https://api.istex.fr/document/" method="get" className="form-horizontal">
              <div className="form-group">
                  <label htmlFor="q" className="col-sm-1 control-label">Requête</label>
                  <div className="col-sm-11">
                      <textarea name="q" id="q" rows="3" autoFocus="true" className="form-control" placeholder="brain surgery"></textarea>
                  </div>
              </div>
              <div className="checkbox">
                  <label className="col-sm-offset-1">
                      <input type="checkbox" name="extract" id="extractMetadata" value="metadata" />
                      Métadonnées
                  </label>
              </div>
              <div className="checkbox">
                  <label className="col-sm-offset-1">
                      <input type="checkbox" name="extract" id="extractFulltext" value="fulltext" />
                      Fulltext
                  </label>
              </div>
              <div className="checkbox">
                  <label className="col-sm-offset-1">
                      <input type="checkbox" name="extract" id="extractEnrichments" value="enrichments" />
                      Enrichments
                  </label>
              </div>
              <div className="checkbox">
                  <label className="col-sm-offset-1">
                      <input type="checkbox" name="extract" id="extractCover" value="cover" />
                      Cover
                  </label>
              </div>
              <div className="checkbox">
                  <label className="col-sm-offset-1">
                      <input type="checkbox" name="extract" id="extractAnnexes" value="annexes" />
                      Annexes
                  </label>
              </div>
              <div className="form-group">
                  <div className="col-sm-offset-1 col-sm-11">
                      <button type="submit" className="btn btn-primary">Télécharger</button>
                  </div>
              </div>
              <input type="hidden" name="size" value="100" />
          </form>
        )
  }
}

