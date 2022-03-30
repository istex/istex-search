import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberOfDocuments, setRankingMode } from '../../store/istexApiSlice';
import QueryInput from '../QueryInput';
import eventEmitter from '../../lib/eventEmitter';
import { istexApiConfig, queryModes } from '../../config';

export default function QuerySection () {
  const dispatch = useDispatch();
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes[0]);
  const [currentRankingMode, setCurrentRankingMode] = useState(istexApiConfig.rankingModes[0]);

  const queryModeChangedHandler = value => {
    setCurrentQueryMode(value);
  };

  const numberOfDocumentsChangedHandler = value => {
    if (!isNaN(value)) {
      dispatch(setNumberOfDocuments(value));

      eventEmitter.emit('updateNumberOfDocumentsParam', value);
    }
  };

  const rankingModeChangedHandler = value => {
    setCurrentRankingMode(value);
    dispatch(setRankingMode(value));

    eventEmitter.emit('updateRankingModeParam', value);
  };

  useEffect(() => {
    eventEmitter.addListener('queryModeChanged', queryModeChangedHandler);
    eventEmitter.addListener('numberOfDocumentsChanged', numberOfDocumentsChangedHandler);
    eventEmitter.addListener('rankingModeChanged', rankingModeChangedHandler);
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
      <div>
        <span>Number of documents: </span>
        <input
          type='number'
          value={numberOfDocuments}
          min='0'
          onChange={event => {
            const value = parseInt(event.target.value);
            numberOfDocumentsChangedHandler(value);
          }}
        />
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
    </>
  );
}
