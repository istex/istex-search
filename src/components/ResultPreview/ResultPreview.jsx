import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Pagination from './Pagination';
import ResultList from './ResultList';
import ResultLoader from './ResultLoader';
import ResultTitle from './ResultTitle';

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
  queryString,
}) {
  const [shouldDisplayResultDetail, setShouldDisplayResultDetail] = useState(false);

  return (
    <>
      <ResultTitle
        shouldDisplayResultDetail={shouldDisplayResultDetail}
        setShouldDisplayResultDetail={setShouldDisplayResultDetail}
      />
      {isLoading
        ? (
          <ResultLoader />
          )
        : (
          <ResultList
            results={results}
            shouldDisplayResultDetail={shouldDisplayResultDetail}
            setShouldDisplayResultDetail={setShouldDisplayResultDetail}
          />
          )}
      <Pagination
        shouldDisplayResultDetail={shouldDisplayResultDetail}
        totalAmountOfDocuments={totalAmountOfDocuments}
        defaultPage={defaultPage}
        nextPageURI={nextPageURI}
        prevPageURI={prevPageURI}
        setCurrentPageURI={setCurrentPageURI}
        lastPageURI={lastPageURI}
        limit={limit}
        firstPageURI={firstPageURI}
        currentRankingMode={currentRankingMode}
        setShouldDisplayResultDetail={setShouldDisplayResultDetail}
        queryString={queryString}
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
  queryString: PropTypes.string,
};
