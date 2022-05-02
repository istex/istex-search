import React from 'react';
import PropTypes from 'prop-types';

export default function ResultPreview ({ results }) {
  return (
    <>
      <h4>Result preview</h4>
      <div style={{ display: 'flex', flexWrap: 'wrap' }}>
        {results.map(result => (
          <div key={result.id} style={{ border: 'solid black 1px', padding: '0.5rem' }}>
            <strong>{result.title ? result.title : 'Untitled Document'}</strong>
            {result.author && (
              <div>
                {result.author.map(currentAuthor => currentAuthor.name).join(' ; ')}
              </div>
            )}
            {result.host?.title && (
              <div>{result.host.title}</div>
            )}
            {result.publicationDate && (
              <div>{result.publicationDate}</div>
            )}
          </div>
        ))}
      </div>
    </>
  );
}

ResultPreview.propTypes = {
  results: PropTypes.array,
};
