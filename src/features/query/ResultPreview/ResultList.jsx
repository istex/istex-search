import React, { useState } from 'react';
import PropTypes from 'prop-types';

import ResultDetail from './ResultDetail';

export default function ResultList ({
  results,
  shouldDisplayResultDetail,
  setShouldDisplayResultDetail,
}) {
  const [item, setItem] = useState({});

  const handleClick = (data) => {
    setShouldDisplayResultDetail(true);
    setItem(data);
  };

  return shouldDisplayResultDetail
    ? (
      <ResultDetail documentResult={item} />
      )
    : (
      <div className='grid grid-cols-1 gap-y-2 md:gap-x-8 md:gap-y-4 md:grid-cols-3 w-full'>
        {results.map(result => (
          <div
            key={result.id}
            className='flex cursor-pointer border-[1px] border-istcolor-blue cta3 group'
            onClick={() => handleClick(result)}
          >
            <div className='flex-none w-2 bg-istcolor-blue group-hover:bg-istcolor-white' />
            {/* p-2 applies a padding of 0.5rem and we want the width to be 100% minus the padding (horrible hack...) */}
            <div className='p-2 flex flex-col justify-between w-[calc(100%-0.5rem)] text-sm'>
              <div className='font-semibold line-clamp-2'>{result.title ? result.title : 'Untitled Document'}</div>
              {result.author && (
                <div className='italic pt-2 text-istcolor-black group-hover:text-istcolor-white truncate'>
                  {result.author.map(currentAuthor => currentAuthor.name).join(' ; ')}
                </div>
              )}

              <div className='flex justify-between text-sm pt-2 text-istcolor-black group-hover:text-istcolor-white'>
                {result.host?.title && <div className='truncate'>{result.host.title}</div>}
                {result.publicationDate && <div>{result.publicationDate}</div>}
              </div>
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
