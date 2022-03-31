import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberOfDocuments, setRankingMode } from '../../store/istexApiSlice';
import QueryInput from '../QueryInput';
import ResultPreview from '../ResultPreview';
import eventEmitter from '../../lib/eventEmitter';
import { istexApiConfig, queryModes } from '../../config';

export default function QuerySection () {
  const dispatch = useDispatch();
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes[0]);
  const [currentRankingMode, setCurrentRankingMode] = useState(istexApiConfig.rankingModes[0]);
  const [resultPreviewResults, setResultPreviewResults] = useState([]);
  const [totalAmountOfDocuments, setTotalAmountOfDocuments] = useState(0);

  const queryModeChangedHandler = value => {
    setCurrentQueryMode(value);
  };

  const numberOfDocumentsChangedHandler = value => {
    if (!isNaN(value)) {
      // Prevent the number of documents to be greater than istexApiConfig.maxAmountOfDocuments
      value = Math.min(value, istexApiConfig.maxAmountOfDocuments);

      dispatch(setNumberOfDocuments(value));

      eventEmitter.emit('updateNumberOfDocumentsParam', value);
    }
  };

  const rankingModeChangedHandler = value => {
    setCurrentRankingMode(value);
    dispatch(setRankingMode(value));

    eventEmitter.emit('updateRankingModeParam', value);
  };

  const resultPreviewResponseReceivedHandler = response => {
    const { data } = response;

    setResultPreviewResults(data.hits);
    setTotalAmountOfDocuments(data.total);
  };

  const resetResultPreviewHandler = () => {
    setResultPreviewResults([]);
    setTotalAmountOfDocuments(0);
  };

  useEffect(() => {
    eventEmitter.addListener('queryModeChanged', queryModeChangedHandler);
    eventEmitter.addListener('numberOfDocumentsChanged', numberOfDocumentsChangedHandler);
    eventEmitter.addListener('rankingModeChanged', rankingModeChangedHandler);
    eventEmitter.addListener('resultPreviewResponseReceived', resultPreviewResponseReceivedHandler);
    eventEmitter.addListener('resetResultPreview', resetResultPreviewHandler);
  }, []);

  return (
    <>
      <h2>Query</h2>
      <div>
        <span>Query mode: </span>
        {queryModes.map(queryMode => (
          <span key={queryMode}>
            <input
              type='radio'
              checked={currentQueryMode === queryMode}
              value={queryMode}
              name='queryMode'
              onChange={event => queryModeChangedHandler(event.target.value)}
            />
            <label htmlFor={queryMode}>{queryMode}</label>
          </span>
        ))}
      </div>
      <div>
        <QueryInput currentQueryMode={currentQueryMode} />
      </div>
      {!!totalAmountOfDocuments && (
        <div>
          <span>The request returned {totalAmountOfDocuments.toLocaleString()} document(s)</span>
          {totalAmountOfDocuments > istexApiConfig.maxAmountOfDocuments && (
            <span style={{ marginLeft: '1.5rem' }}>
              WARNING! (number of results greater than {istexApiConfig.maxAmountOfDocuments})
            </span>
          )}
        </div>
      )}
      <div>
        <span>Number of documents: </span>
        <input
          type='number'
          value={numberOfDocuments}
          min='0'
          max={istexApiConfig.maxAmountOfDocuments}
          onChange={event => {
            const value = parseInt(event.target.value);
            numberOfDocumentsChangedHandler(value);
          }}
        />
        {!!totalAmountOfDocuments && (
          <>
            <span> / {Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments)}</span>
            <button onClick={() => numberOfDocumentsChangedHandler(totalAmountOfDocuments)}>All</button>
          </>
        )}
      </div>
      <div>
        <span>Results ranking mode: </span>
        {istexApiConfig.rankingModes.map(rankingMode => (
          <span key={rankingMode}>
            <input
              type='radio'
              checked={currentRankingMode === rankingMode}
              value={rankingMode}
              name='rankingMode'
              onChange={event => {
                const { value } = event.target;
                rankingModeChangedHandler(value);
              }}
            />
            <label htmlFor={rankingMode}>{rankingMode}</label>
          </span>
        ))}
      </div>
      {resultPreviewResults.length > 0 && (
        <div>
          <ResultPreview results={resultPreviewResults} />
        </div>
      )}
    </>
  );
}
