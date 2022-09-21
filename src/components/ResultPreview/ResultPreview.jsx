import React from 'react';
import PropTypes from 'prop-types';

import Pagination from './Pagination';
import ResultList from './ResultList';
import ResultLoader from './ResultLoader';

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
  firstPageURI,
  currentRankingMode,
}) {
  return (
    <>
      <h4 className='font-semibold border-[#303030] border-b-[1px] mb-4'>Parcourir les résultats</h4>
      {isLoading
        ? (
          <ResultLoader />
          )
        : (
          <ResultList
            results={results}
          />
          )}
      <Pagination
        totalAmountOfDocuments={totalAmountOfDocuments}
        defaultPage={defaultPage}
        nextPageURI={nextPageURI}
        prevPageURI={prevPageURI}
        setCurrentPageURI={setCurrentPageURI}
        lastPageURI={lastPageURI}
        limit={limit}
        firstPageURI={firstPageURI}
        currentRankingMode={currentRankingMode}
      />
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
  firstPageURI: PropTypes.string,
  currentRankingMode: PropTypes.string,
};
