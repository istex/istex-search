import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import { setQueryString, setQId } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  buildQueryStringFromCorpusFile,
  isEmptyArkQueryString,
  getQueryStringFromQId,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { queryModes, istexApiConfig } from '../../config';

export default function QueryInput ({ currentQueryMode }) {
  const dispatch = useDispatch();
  const inputElement = useRef();

  // Set the text input value to what was passed and return it just in case it was modified
  const updateQueryInputValue = newQueryInputValue => {
    // Only necessary when the handler is triggered from an event from another component
    if (currentQueryMode === queryModes.modes[0]) {
      inputElement.current.value = newQueryInputValue;
    }

    // If the query string is an ark query with an empty list of ark identifiers,
    // reset the query string to its default value (empty string)
    if (isEmptyArkQueryString(newQueryInputValue)) newQueryInputValue = '';

    dispatch(setQueryString(newQueryInputValue));

    return newQueryInputValue;
  };

  const queryInputChangedHandler = newQueryInputValue => {
    // `newQueryInputValue` may be modified, that's why updateQueryInputValue returns a value
    newQueryInputValue = updateQueryInputValue(newQueryInputValue);

    eventEmitter.emit(events.updateQueryStringParam, newQueryInputValue);
    eventEmitter.emit(events.setQueryStringInLastRequestOfHistory, newQueryInputValue);

    if (!newQueryInputValue) {
      eventEmitter.emit(events.resetResultPreview);
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (newQueryInputValue.length > istexApiConfig.queryStringMaxLength) {
      // Yes, the hashing has to be done on the client side, this is due to a questionable design of the /q_id
      // route of the API and might (hopefully) change in the future
      const hashedValue = md5(newQueryInputValue).toString();
      qIdChangedHandler(hashedValue, newQueryInputValue);
    }
  };

  const qIdChangedHandler = async (newQId, originalQueryString) => {
    // If originalQueryString was not passed we need to fetch it from the API using the qId
    if (!originalQueryString) {
      try {
        const response = await getQueryStringFromQId(newQId);
        originalQueryString = response.data.req;
        updateQueryInputValue(originalQueryString);
      } catch (err) {
        // TODO: print the error in a modal or something else
        console.error(err);

        return;
      }
    }

    dispatch(setQId(newQId));

    eventEmitter.emit(events.updateQIdParam, newQId);
  };

  const corpusFileHandler = file => {
    if (!file) return;

    const reader = new window.FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = event => {
      const queryString = buildQueryStringFromCorpusFile(event.target.result);
      queryInputChangedHandler(queryString);
    };

    // TODO: print the error in a modal or something else
    reader.onerror = console.error;
  };

  useEffect(() => {
    eventEmitter.addListener(events.queryInputChanged, queryInputChangedHandler);
    eventEmitter.addListener(events.qIdChanged, qIdChangedHandler);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes.modes[0]:
      queryInputUi = (
        <input
          ref={inputElement}
          type='text'
          name='queryInput'
          placeholder='brain AND language:fre'
          onChange={event => queryInputChangedHandler(event.target.value)}
        />
      );
      break;
    case queryModes.modes[1]:
      queryInputUi = (
        <textarea
          ref={inputElement}
          rows='2'
          cols='30'
          name='queryInput'
          placeholder='ark:/67375/0T8-JMF4G14B-2
          ark:/67375/0T8-RNCBH0VZ-8'
          onChange={event => {
            const arks = event.target.value.split('\n');
            const queryString = buildQueryStringFromArks(arks);
            queryInputChangedHandler(queryString);
          }}
        />
      );
      break;
    case queryModes.modes[2]:
      queryInputUi = (
        <input
          ref={inputElement}
          type='file'
          name='queryInput'
          accept='.corpus'
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
