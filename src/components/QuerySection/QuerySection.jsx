import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberOfDocuments, setRankingMode } from '../../store/istexApiSlice';
import QueryInput from '../QueryInput/QueryInput';
import ResultPreview from '../ResultPreview/ResultPreview';
import { sendResultPreviewApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { asyncDebounce } from '../../lib/utils';
import { istexApiConfig } from '../../config';
import TitleSection from '../TitleSection/TitleSection';

const sendDelayedResultPreviewApiRequest = asyncDebounce(async (newQueryString, newRankingMode) => {
  const response = await sendResultPreviewApiRequest(newQueryString, newRankingMode);
  eventEmitter.emit(events.resultPreviewResponseReceived, response);
});

export default function QuerySection() {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const [currentRankingMode, setCurrentRankingMode] = useState(istexApiConfig.rankingModes.getDefault());
  const [resultPreviewResults, setResultPreviewResults] = useState([]);
  const [totalAmountOfDocuments, setTotalAmountOfDocuments] = useState(0);

  const numberOfDocumentsHandler = newNumberOfDocuments => {
    if (!isNaN(newNumberOfDocuments)) {
      // Prevent the number of documents to be greater than istexApiConfig.maxAmountOfDocuments
      newNumberOfDocuments = Math.min(newNumberOfDocuments, istexApiConfig.maxAmountOfDocuments);

      dispatch(setNumberOfDocuments(newNumberOfDocuments));

      eventEmitter.emit(events.setNumberOfDocumentsUrlParam, newNumberOfDocuments);
      eventEmitter.emit(events.setNumberOfDocumentsInLastRequestOfHistory, newNumberOfDocuments);
    }
  };

  const rankingModeHandler = newRankingMode => {
    setCurrentRankingMode(newRankingMode);
    dispatch(setRankingMode(newRankingMode));

    eventEmitter.emit(events.setRankingModeUrlParam, newRankingMode);
    eventEmitter.emit(events.setRankingModeInLastRequestOfHistory, newRankingMode);
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
  useEffect(async () => {
    if (!queryString) {
      sendDelayedResultPreviewApiRequest.cancel();
      return;
    }

    await sendDelayedResultPreviewApiRequest(queryString, rankingMode);
  }, [queryString, rankingMode]);

  useEffect(() => {
    eventEmitter.addListener(events.setNumberOfDocuments, numberOfDocumentsHandler);
    eventEmitter.addListener(events.setRankingMode, rankingModeHandler);
    eventEmitter.addListener(events.resultPreviewResponseReceived, resultPreviewResponseReceivedHandler);
    eventEmitter.addListener(events.resetResultPreview, resetResultPreviewHandler);
  }, []);

  return (
    <>
      <TitleSection
        title='Query'
        num='1'
        infoTextTitle=''
        infoTextContent=''
      />
      <QueryInput />
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
          max={Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments)}
          name='numberOfDocumentsInput'
          onChange={event => {
            const value = parseInt(event.target.value);
            numberOfDocumentsHandler(value);
          }}
        />
        {!!totalAmountOfDocuments && (
          <>
            <span> / {Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments)}</span>
            <button onClick={() => numberOfDocumentsHandler(totalAmountOfDocuments)}>All</button>
          </>
        )}
      </div>
      <div>
        <span>Results ranking mode: </span>
        {istexApiConfig.rankingModes.modes.map(rankingMode => (
          <span key={rankingMode}>
            <input
              type='radio'
              checked={currentRankingMode === rankingMode}
              value={rankingMode}
              name='rankingMode'
              onChange={event => {
                const { value } = event.target;
                rankingModeHandler(value);
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
