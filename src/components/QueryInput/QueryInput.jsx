import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import { setQueryString, setQId } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  isArkQueryString,
  getArksFromArkQueryString,
  buildQueryStringFromCorpusFile,
  getQueryStringFromQId,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { queryModes, istexApiConfig } from '../../config';

export default function QueryInput () {
  const dispatch = useDispatch();
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes.getDefault());
  const [queryStringInputValue, setQueryStringInputValue] = useState('');
  const [arkInputValue, setArkInputValue] = useState('');

  const changeQueryStringHandler = newQueryString => {
    if (!newQueryString) {
      setArkInputValue('');
    }

    if (isArkQueryString(newQueryString)) {
      const arkList = getArksFromArkQueryString(newQueryString).join('\n');
      setArkInputValue(arkList);
      setCurrentQueryMode(queryModes.modes.find(queryMode => queryMode === 'ark'));
    } else {
      setCurrentQueryMode(queryModes.getDefault());
      setQueryStringInputValue(newQueryString);
    }

    updateQueryString(newQueryString);
  };

  const updateQueryString = newQueryString => {
    dispatch(setQueryString(newQueryString));

    eventEmitter.emit(events.updateQueryStringParam, newQueryString);
    eventEmitter.emit(events.setQueryStringInLastRequestOfHistory, newQueryString);

    if (!newQueryString) {
      eventEmitter.emit(events.resetResultPreview);
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (newQueryString.length > istexApiConfig.queryStringMaxLength) {
      // Yes, the hashing has to be done on the client side, this is due to a questionable design of the /q_id
      // route of the API and might (hopefully) change in the future
      const hashedValue = md5(newQueryString).toString();
      qIdChangedHandler(hashedValue, newQueryString);
    }
  };

  const qIdChangedHandler = async (newQId, originalQueryString) => {
    dispatch(setQId(newQId));

    eventEmitter.emit(events.updateQIdParam, newQId);

    // newQId can be an empty string when the qId is reset, if that's the case, we don't want to send a request
    // to get the corresponding queryString so we just stop here
    if (!newQId) return;

    // If originalQueryString was not passed we need to fetch it from the API using the qId
    if (!originalQueryString) {
      try {
        const response = await getQueryStringFromQId(newQId);
        originalQueryString = response.data.req;
        dispatch(setQueryString(originalQueryString));
      } catch (err) {
        // TODO: print the error in a modal or something else
        console.error(err);
      }
    }
  };

  const queryModeChangedHandler = newQueryMode => {
    setCurrentQueryMode(newQueryMode);
  };

  const queryInputHandler = newQueryStringInput => {
    eventEmitter.emit(events.numberOfDocumentsChanged, 0);

    setQueryStringInputValue(newQueryStringInput);
    updateQueryString(newQueryStringInput);
  };

  const arkListHandler = arkList => {
    eventEmitter.emit(events.numberOfDocumentsChanged, 0);

    setArkInputValue(arkList);

    // If the ark list is empty, just pass it to updateQueryString and let this function handle the case
    if (!arkList) {
      updateQueryString(arkList);
      return;
    }

    const arks = arkList.split('\n');
    const queryString = buildQueryStringFromArks(arks);
    updateQueryString(queryString);
  };

  const corpusFileHandler = file => {
    eventEmitter.emit(events.numberOfDocumentsChanged, 0);

    if (!file) return;

    const reader = new window.FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = event => {
      const queryString = buildQueryStringFromCorpusFile(event.target.result);
      updateQueryString(queryString);
    };

    // TODO: print the error in a modal or something else
    reader.onerror = console.error;
  };

  useEffect(() => {
    eventEmitter.addListener(events.queryModeChanged, queryModeChangedHandler);
    eventEmitter.addListener(events.changeQueryString, changeQueryStringHandler);
    eventEmitter.addListener(events.qIdChanged, qIdChangedHandler);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes.modes[0]:
      queryInputUi = (
        <input
          type='text'
          name='queryInput'
          placeholder='brain AND language:fre'
          value={queryStringInputValue}
          onChange={event => queryInputHandler(event.target.value)}
        />
      );
      break;
    case queryModes.modes[1]:
      queryInputUi = (
        <textarea
          rows='2'
          cols='30'
          name='queryInput'
          placeholder='ark:/67375/0T8-JMF4G14B-2
          ark:/67375/0T8-RNCBH0VZ-8'
          value={arkInputValue}
          onChange={event => arkListHandler(event.target.value)}
        />
      );
      break;
    case queryModes.modes[2]:
      // The value attribute is harcoded to '' so that React stop crying about this input being uncontrolled.
      // Meanwhile the docs say that file input can't be controlled for security reasons... (https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag)
      queryInputUi = (
        <input
          type='file'
          name='queryInput'
          accept='.corpus'
          value=''
          onChange={event => corpusFileHandler(event.target.files[0])}
        />
      );
  }

  return (
    <>
      <div>
        <span>Query mode: </span>
        {queryModes.modes.map(queryMode => (
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
        <label htmlFor='queryInput'>{currentQueryMode}: </label>
        {queryInputUi}
      </div>
    </>
  );
}
