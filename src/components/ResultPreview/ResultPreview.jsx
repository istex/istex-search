import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ResultPreview ({ isLoading, defaultPage = 1, results, totalAmountOfDocuments, lastPageURI, nextPageURI, setCurrentPageURI, prevPageURI }) {
  const totalPage = Math.floor(totalAmountOfDocuments / 9);
  const [page, setPage] = useState(defaultPage);

  const handlePageResult = (event) => {
    event.persist();
    setPage(event.target.value);
  };

  const handleNewRequest = (url) => {
    setCurrentPageURI(url);
  };

  if (isLoading) {
    return (
      <div className=''>
        {/** Change this after with real loader */}
        <p>Chargement....</p>
      </div>
    );
  }

  return (
    <>
      <h4 className='font-semibold border-[#303030] border-b-[1px] mb-4'>Parcourir les résultats</h4>
      <div className='grid gap-x-8 gap-y-4 grid-cols-3 mr-4'>
        {results.map(result => (
          <div
            key={result.id}
            className='border-[1px] py-2 border-l-[10px] text-[#458ca5] border-[#458ca5] hover:border-black px-2 cursor-pointer hover:bg-istcolor-green-light hover:text-black'
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
      <div className='flex justify-between items-center mt-5'>
        <div className='flex items-center'>
          <span>Page {page || defaultPage} sur {totalPage}</span>
          <input
            type='text'
            placeholder='Aller à la page...'
            name='page'
            onChange={handlePageResult}
            className='ml-2'
          />
        </div>
        <div className='flex'>
          {!prevPageURI
            ? null
            : (
              <button
                type='button'
                className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
                onClick={() => handleNewRequest(prevPageURI)}
              >
                <FontAwesomeIcon icon='angles-left' /> Page précédente
              </button>)}
          {!nextPageURI
            ? null
            : (
              <button
                type='button'
                className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
                onClick={() => handleNewRequest(nextPageURI)}
              >
                Page suivante <FontAwesomeIcon icon='angles-right' />
              </button>)}
        </div>
      </div>
    </>
  );
}

ResultPreview.propTypes = {
  results: PropTypes.array,
  isLoading: PropTypes.bool,
  defaultPage: PropTypes.number,
  totalAmountOfDocuments: PropTypes.number,
  lastPageURI: PropTypes.string,
  prevPageURI: PropTypes.string,
  nextPageURI: PropTypes.string,
  setCurrentPageURI: PropTypes.func,
};
