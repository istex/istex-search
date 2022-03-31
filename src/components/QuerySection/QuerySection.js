import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setNumberOfDocuments, setRankingMode } from '../../store/istexApiSlice';
import QueryInput from '../QueryInput';
import ResultPreview from '../ResultPreview';
import eventEmitter from '../../lib/eventEmitter';
import { istexApiConfig, queryModes } from '../../config';

const fakeResults = [
  {
    id: 'B279BEE490EAF1799E37CD8BFEB7DB6E29F89903',
    author: [
      {
        name: 'Charles',
      },
      {
        name: 'Attant',
      },
    ],
    host: {
      title: 'Very interesting journal',
    },
    title: 'Very interesting article',
    publicationDate: '2015',
  },
  {
    id: '05C73F0EB3270639D898FE14C295B1075B99AB8C',
    author: [
      {
        name: 'Claude',
      },
      {
        name: 'JJ',
      },
    ],
    host: {
      title: 'Super interesting journal',
    },
    title: 'Super interesting article',
    publicationDate: '2018',
  },
  {
    id: '75AD1025C38CBDDEEA8509BA2CDAF88560DF243A',
    author: [
      {
        name: 'Stéphanie',
      },
      {
        name: 'Enza',
      },
    ],
    host: {
      title: 'Mega interesting journal',
    },
    title: 'Mega interesting article',
    publicationDate: '2020',
  },
  {
    id: '1476B2316AF104E48FD5C6B7A3AD5EC9DBB11BC9',
    author: [
      {
        name: 'Charles',
      },
      {
        name: 'Attant',
      },
    ],
    host: {
      title: 'Very interesting journal',
    },
    title: 'Very interesting article',
    publicationDate: '2015',
  },
  {
    id: '968386F6DF5D9B1083E43A61B5D1F64112728970',
    author: [
      {
        name: 'Claude',
      },
      {
        name: 'JJ',
      },
    ],
    host: {
      title: 'Super interesting journal',
    },
    title: 'Super interesting article',
    publicationDate: '2018',
  },
  {
    id: '2A39B54AA26D223BC0A03F4C41A02BA0611BF4A6',
    author: [
      {
        name: 'Stéphanie',
      },
      {
        name: 'Enza',
      },
    ],
    host: {
      title: 'Mega interesting journal',
    },
    title: 'Mega interesting article',
    publicationDate: '2020',
  },
];

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
      {fakeResults.length > 0 && (
        <div>
          <ResultPreview results={fakeResults} />
        </div>
      )}
    </>
  );
}
