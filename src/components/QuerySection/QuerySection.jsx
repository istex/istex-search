import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberOfDocuments, setRankingMode } from '../../store/istexApiSlice';
import QueryInput from '../QueryInput';
import ResultPreview from '../ResultPreview';
import { sendResultPreviewApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { debounce } from '../../lib/utils';
import { istexApiConfig, queryModes } from '../../config';

const sendDelayedResultPreviewApiRequest = debounce(async (newQueryString, newRankingMode) => {
  const response = await sendResultPreviewApiRequest(newQueryString, newRankingMode);
  eventEmitter.emit(events.resultPreviewResponseReceived, response);
});

export default function QuerySection () {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes[0]);
  const [currentRankingMode, setCurrentRankingMode] = useState(istexApiConfig.rankingModes[0]);
  const [resultPreviewResults, setResultPreviewResults] = useState([]);
  const [totalAmountOfDocuments, setTotalAmountOfDocuments] = useState(0);

  const queryModeChangedHandler = newQueryMode => {
    setCurrentQueryMode(newQueryMode);
  };

  const numberOfDocumentsChangedHandler = newNumberOfDocuments => {
    if (!isNaN(newNumberOfDocuments)) {
      // Prevent the number of documents to be greater than istexApiConfig.maxAmountOfDocuments
      newNumberOfDocuments = Math.min(newNumberOfDocuments, istexApiConfig.maxAmountOfDocuments);

      dispatch(setNumberOfDocuments(newNumberOfDocuments));

      eventEmitter.emit(events.updateNumberOfDocumentsParam, newNumberOfDocuments);
    }
  };

  const rankingModeChangedHandler = newRankingMode => {
    setCurrentRankingMode(newRankingMode);
    dispatch(setRankingMode(newRankingMode));

    eventEmitter.emit(events.updateRankingModeParam, newRankingMode);
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

  // If queryString or rankingMode change, update the results preview
  useEffect(() => {
    if (!queryString) return;

    sendDelayedResultPreviewApiRequest(queryString, rankingMode);
  }, [queryString, rankingMode]);

  useEffect(() => {
    eventEmitter.addListener(events.queryModeChanged, queryModeChangedHandler);
    eventEmitter.addListener(events.numberOfDocumentsChanged, numberOfDocumentsChangedHandler);
    eventEmitter.addListener(events.rankingModeChanged, rankingModeChangedHandler);
    eventEmitter.addListener(events.resultPreviewResponseReceived, resultPreviewResponseReceivedHandler);
    eventEmitter.addListener(events.resetResultPreview, resetResultPreviewHandler);
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
        <label htmlFor='numberOfDocumentsInput'>Number of documents: </label>
        <input
          type='number'
          value={numberOfDocuments}
          min='0'
          max={istexApiConfig.maxAmountOfDocuments}
          name='numberOfDocumentsInput'
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
