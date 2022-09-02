import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ResultPreview ({
  isLoading,
  defaultPage = 1,
  results,
  totalAmountOfDocuments,
  nextPageURI,
  setCurrentPageURI,
  prevPageURI,
  limit = 9,
  lastPageURI,
}) {
  const totalPage = Math.ceil(totalAmountOfDocuments / limit);
  const [page, setPage] = useState('');
  const [currentPage, setCurrentPage] = useState('');

  const handlePageResult = (event) => {
    event.persist();

    setPage(event.target.value);
  };

  const retreiveFromInsideUrl = (url) => {
    const index = url.indexOf('from');
    const from = url.substring(index + 5);

    return from;
  };

  const handleNewRequest = (url) => {
    const from = +retreiveFromInsideUrl(url);

    if (from === 0) {
      currentPage(1);
    } else {
      setCurrentPage((from / limit) + 1);
    }

    setCurrentPageURI(url);
  };

  const handleCurrentPageSubmit = (event) => {
    event.preventDefault();
    const from = retreiveFromInsideUrl(lastPageURI);
    const newUrl = lastPageURI.replace(from, page);

    setCurrentPage(page);
    setCurrentPageURI(newUrl);
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
          <div>
            Page <span className='font-bold'>{currentPage || defaultPage}</span> sur <span className='font-bold'>{totalPage}</span>
          </div>
          <form
            onSubmit={handleCurrentPageSubmit}
            className='ml-2 content-center m-0'
          >
            <input
              type='text'
              placeholder='Aller à la page...'
              name='page'
              onChange={handlePageResult}
              value={page}
            />
          </form>
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
  prevPageURI: PropTypes.string,
  nextPageURI: PropTypes.string,
  lastPageURI: PropTypes.string,
  setCurrentPageURI: PropTypes.func,
  limit: PropTypes.number,
};
