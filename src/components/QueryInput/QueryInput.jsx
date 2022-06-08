import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import { setQueryString, setQId } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  buildQueryStringFromCorpusFile,
  getQueryStringFromQId,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { queryModes, istexApiConfig } from '../../config';

export default function QueryInput ({ currentQueryMode }) {
  const dispatch = useDispatch();
  const [queryInputValue, setQueryInputValue] = useState('');

  const queryStringChangedHandler = newQueryStringValue => {
    dispatch(setQueryString(newQueryStringValue));
    setQueryInputValue(newQueryStringValue);

    eventEmitter.emit(events.updateQueryStringParam, newQueryStringValue);
    eventEmitter.emit(events.setQueryStringInLastRequestOfHistory, newQueryStringValue);

    if (!newQueryStringValue) {
      eventEmitter.emit(events.resetResultPreview);
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (newQueryStringValue.length > istexApiConfig.queryStringMaxLength) {
      // Yes, the hashing has to be done on the client side, this is due to a questionable design of the /q_id
      // route of the API and might (hopefully) change in the future
      const hashedValue = md5(newQueryStringValue).toString();
      qIdChangedHandler(hashedValue, newQueryStringValue);
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

  const arkListHandler = arkList => {
    // If the ark list is empty, just pass it to queryStringChangedHandler and let this function handle the case
    if (!arkList) {
      queryStringChangedHandler(arkList);
      return;
    }

    const arks = arkList.split('\n');
    const queryString = buildQueryStringFromArks(arks);
    queryStringChangedHandler(queryString);
  };

  const corpusFileHandler = file => {
    if (!file) return;

    const reader = new window.FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = event => {
      const queryString = buildQueryStringFromCorpusFile(event.target.result);
      queryStringChangedHandler(queryString);
    };

    // TODO: print the error in a modal or something else
    reader.onerror = console.error;
  };

  useEffect(() => {
    eventEmitter.addListener(events.queryStringChanged, queryStringChangedHandler);
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
          value={queryInputValue}
          onChange={event => queryStringChangedHandler(event.target.value)}
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
          value={queryInputValue}
          onChange={event => arkListHandler(event.target.value)}
        />
      );
      break;
    case queryModes.modes[2]:
      queryInputUi = (
        <input
          type='file'
          name='queryInput'
          accept='.corpus'
          value={queryInputValue}
          onChange={event => corpusFileHandler(event.target.files[0])}
        />
      );
  }

  return (
    <>
      <label htmlFor='queryInput'>{currentQueryMode}: </label>
      {queryInputUi}
    </>
  );
}

QueryInput.propTypes = {
  currentQueryMode: PropTypes.string,
};
