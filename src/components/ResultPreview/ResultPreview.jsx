import React from 'react';
import PropTypes from 'prop-types';

export default function ResultPreview ({ results }) {
  return (
    <>
      <h4 className='font-semibold border-[#303030] border-b-[1px] mb-4'>Result preview</h4>
      <div className='grid gap-x-8 gap-y-4 grid-cols-3 mr-4'>
        {results.map(result => (
          <div
            key={result.id}
            className='border-[1px] py-2 border-l-[10px] text-[#458ca5] border-[#458ca5] hover:border-black px-2 cursor-pointer hover:bg-[#c4d733] hover:text-black'
          >
            <strong className='font-semibold text-sm'>{result.title ? result.title : 'Untitled Document'}</strong>
            {result.author && (
              <div className='italic text-sm pt-2'>
                {result.author.map(currentAuthor => currentAuthor.name).join(' ; ')}
              </div>
            )}
            <div className='flex justify-between text-sm pt-2'>
              {result.host?.title && (
                <div>{result.host.title}</div>
              )}
              {result.publicationDate && (
                <div>{result.publicationDate}</div>
              )}
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

ResultPreview.propTypes = {
  results: PropTypes.array,
};
