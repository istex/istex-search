import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch, useSelector } from 'react-redux';
import md5 from 'crypto-js/md5';
import { setQueryString } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  buildQueryStringFromCorpusFile,
  isEmptyArkQueryString,
  sendResultPreviewApiRequest
} from '../../lib/istexApi';
import eventEmitter from '../../lib/eventEmitter';
import { queryModes, istexApiConfig } from '../../config';

let timeoutId;

export default function QueryInput ({ currentQueryMode }) {
  const dispatch = useDispatch();
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const inputElement = useRef();

  const queryInputChangedHandler = value => {
    // Only necessary when the handler is triggered from an event from another component
    if (currentQueryMode === queryModes[0]) {
      inputElement.current.value = value;
    }

    // If the query string is an ark query with an empty list of ark identifiers,
    // reset the query string to its default value (empty string)
    if (isEmptyArkQueryString(value)) value = '';

    dispatch(setQueryString(value));

    if (timeoutId) clearTimeout(timeoutId);

    eventEmitter.emit('updateQueryStringParam', value);

    if (!value) {
      eventEmitter.emit('resetResultPreview');
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (value.length > istexApiConfig.queryStringMaxLength) {
      // Yes, the hashing has to be done on the client side, this is due to a questionable design of the /q_id
      // route of the API and might (hopefully) change in the future
      const hashedValue = md5(value).toString();
      qIdChangedHandler(hashedValue, value);
      return;
    }

    // We don't want to send an API request everytime the input changes so we make sure the user
    // stopped typing for at least one second before sending a request
    timeoutId = setTimeout(() => {
      sendResultPreviewApiRequest(value, rankingMode)
        .then(response => {
          eventEmitter.emit('resultPreviewResponseReceived', response);
        })
        // TODO: print the error in a modal or something else
        .catch(console.error);
    }, 1000);
  };

  const qIdChangedHandler = (value, originalQueryString) => {
    // If originalQueryString was not passed we need to fetch it from the API using the qId
    if (!originalQueryString) {
      // TODO: send a GET request to /q_id/<value> to get the originalQueryString, if 404 stop here
    }

    // TODO: send a POST request to /q_id/<value> with { qString: value } body to save the query string
    // in the redis base

    eventEmitter.emit('updateQIdParam', value);

    timeoutId = setTimeout(() => {
      sendResultPreviewApiRequest(originalQueryString, rankingMode)
        .then(response => {
          eventEmitter.emit('resultPreviewResponseReceived', response);
        })
        // TODO: print the error in a modal or something else
        .catch(console.error);
    }, 1000);
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
    eventEmitter.addListener('queryInputChanged', queryInputChangedHandler);
    eventEmitter.addListener('qIdChanged', qIdChangedHandler);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes[0]:
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
    case queryModes[1]:
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
    case queryModes[2]:
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
