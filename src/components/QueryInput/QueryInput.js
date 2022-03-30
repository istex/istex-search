import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { useDispatch } from 'react-redux';
import { setQueryString } from '../../store/istexApiSlice';
import { buildQueryStringFromArks, buildQueryStringFromCorpusFile, isEmptyArkQueryString } from '../../lib/istexApi';
import eventEmitter from '../../lib/eventEmitter';
import { queryModes } from '../../config';

export default function QueryInput ({ currentQueryMode }) {
  const dispatch = useDispatch();
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

    eventEmitter.emit('updateQueryStringParam', value);
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
    reader.onerror = event => console.error(event);
  };

  useEffect(() => {
    eventEmitter.addListener('queryInputChanged', queryInputChangedHandler);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes[0]:
      queryInputUi = (
        <input
          ref={inputElement}
          type='text'
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
          accept='.corpus'
          onChange={event => corpusFileHandler(event.target.files[0])}
        />
      );
  }

  return (
    <>
      <span>{currentQueryMode}: </span>
      {queryInputUi}
    </>
  );
}

QueryInput.propTypes = {
  currentQueryMode: PropTypes.string,
};
