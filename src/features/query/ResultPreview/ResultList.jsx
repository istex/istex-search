import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ResultDetail from './ResultDetail';

export default function ResultList ({
  results,
  shouldDisplayResultDetail,
  setShouldDisplayResultDetail,
}) {
  const [item, setitem] = useState({});

  const handleClick = (data) => {
    setShouldDisplayResultDetail(true);
    setitem(data);
  };

  return shouldDisplayResultDetail
    ? (
      <ResultDetail documentResult={item} />
      )
    : (
      <div className='grid grid-cols-1 gap-y-2 auto-rows-fr md:gap-x-8 md:gap-y-4 md:grid-cols-3 md:mr-4 w-full'>
        {results.map(result => (
          <div
            key={result.id}
            className='flex flex-col justify-between border-[1px] py-2 border-l-[10px] px-2 cursor-pointer cta3 hover:border-l-istcolor-white'
            onClick={() => handleClick(result)}
          >
            <div>
              <div className='font-semibold text-sm line-clamp-2'>{result.title ? result.title : 'Untitled Document'}</div>
              {result.author && (
                <div className='italic text-sm pt-2 text-istcolor-black truncate'>
                  {result.author.map(currentAuthor => currentAuthor.name).join(' ; ')}
                </div>
              )}
            </div>
            <div className='flex justify-between text-sm pt-2'>
              {result.host?.title && (
                <div className='text-istcolor-black truncate'>{result.host.title}</div>
              )}
              {result.publicationDate && (
                <div className='text-istcolor-black'>{result.publicationDate}</div>
              )}
            </div>
          </div>
        ))}
      </div>
      );
}

ResultList.propTypes = {
  results: PropTypes.array,
  shouldDisplayResultDetail: PropTypes.bool,
  setShouldDisplayResultDetail: PropTypes.func,
};
