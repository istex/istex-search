import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';

export default function Pagination ({
  totalAmountOfDocuments,
  defaultPage = 1,
  nextPageURI,
  prevPageURI,
  setCurrentPageURI,
  lastPageURI,
  limit,
  firstPageURI,
  currentRankingMode,
}) {
  const totalPage = Math.floor(totalAmountOfDocuments / limit);
  const [currentPage, setCurrentPage] = useState('');
  const [page, setPage] = useState('');

  const handlePageResult = (event) => {
    event.persist();

    setPage(event.target.value);
  };

  const retreiveFromInsideUrl = (url) => {
    const index = url.indexOf('from');
    const from = url.substring(index + 5);

    return from;
  };

  const handleCurrentPageSubmit = (event) => {
    event.preventDefault();

    // reset the form
    setPage('');

    const newPage = +event.target[0].value;

    // check negative page
    if (newPage <= 0) {
      return;
    }

    const from = +retreiveFromInsideUrl(lastPageURI);
    const newFrom = (newPage - 1) * limit;
    const newUrl = lastPageURI.replace(from, `${newFrom}`);

    // check if it is the last page
    if (newFrom > from) {
      return;
    }

    setCurrentPage(newPage);
    setCurrentPageURI(newUrl);
  };

  const handleNewRequest = (url) => {
    const from = +retreiveFromInsideUrl(url);

    if (from === 0) {
      setCurrentPage(1);
    } else {
      setCurrentPage(Math.floor((from / limit) + 1));
    }

    setCurrentPageURI(url);
  };

  useEffect(() => {
    setCurrentPage('');
  }, [totalAmountOfDocuments, currentRankingMode]);

  return (
    <div className='flex flex-col md:flex-row justify-between items-center mt-5'>
      <div className='flex items-center'>
        <div>
          Page <span className='font-bold'>{currentPage || defaultPage}</span> sur <span className='font-bold'>{totalPage}</span>
        </div>
        <div className='pl-2 text-sm inline-block align-middle'>
          <Tooltip
            trigger='click'
            content={
              <p className='text-sm text-white'>
                La pagination ne permet pas de dépasser<br />
                le <span className='font-bold'>10000ème résultat</span>. Par conséquent, il est<br />
                impossible d'accéder aux pages supérieures<br />
                à <span className='font-bold'>1111</span>.
              </p>
            }
          >
            <button>
              <FontAwesomeIcon icon='triangle-exclamation' className='text-istcolor-red' />
            </button>
          </Tooltip>
        </div>
        <form
          onSubmit={handleCurrentPageSubmit}
          className='ml-2 content-center m-0'
        >
          <input
            type='number'
            placeholder='Aller à la page...'
            name='page'
            onChange={handlePageResult}
            value={page}
            className='border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          />
          <button
            type='submit'
            className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
          >
            Valider
          </button>
        </form>
      </div>
      <div className='flex mt-3 md:mt-0'>
        <button
          type='button'
          className='p-2 mr-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
          onClick={() => handleNewRequest(firstPageURI)}
        >
          Première page
        </button>
        {!prevPageURI
          ? null
          : (
            <button
              type='button'
              className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
              onClick={() => handleNewRequest(prevPageURI)}
            >
              <FontAwesomeIcon icon='angles-left' />
            </button>)}
        {!nextPageURI
          ? null
          : (
            <button
              type='button'
              className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
              onClick={() => handleNewRequest(nextPageURI)}
            >
              <FontAwesomeIcon icon='angles-right' />
            </button>)}
        <button
          type='button'
          className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
          onClick={() => handleNewRequest(lastPageURI)}
        >
          Dernière page
        </button>
      </div>
    </div>
  );
}

Pagination.propTypes = {
  defaultPage: PropTypes.number,
  totalAmountOfDocuments: PropTypes.number,
  prevPageURI: PropTypes.string,
  nextPageURI: PropTypes.string,
  lastPageURI: PropTypes.string,
  setCurrentPageURI: PropTypes.func,
  limit: PropTypes.number,
  firstPageURI: PropTypes.string,
  currentRankingMode: PropTypes.string,
};
