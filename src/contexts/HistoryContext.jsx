import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';

import { getDefaultState } from '@/store/istexApiSlice';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

const LOCAL_STORAGE_HISTORY_KEY = 'history';
const LOCAL_STORAGE_LAST_REQUEST_KEY = 'lastRequest';
const LOCAL_STORAGE_LIMIT = 30;

export const HistoryContext = createContext();

export default function HistoryProvider ({ children }) {
  const { eventEmitter, events } = useEventEmitterContext();

  let history = null;
  let lastRequest = null;

  const get = index => {
    if (!isIndexValid(index)) return null;

    return history[index];
  };

  const getAll = () => {
    return history;
  };

  const add = item => {
    history.unshift(item);

    if (history.length > LOCAL_STORAGE_LIMIT) {
      history.pop();
    }

    update();
  };

  const remove = index => {
    if (!isIndexValid(index)) return;

    history.splice(index, 1);
    update();
  };

  const removeAll = () => {
    history.splice(0, history.length);
    update();
  };

  const modify = (index, newItem) => {
    if (!isIndexValid(index)) return;

    history[index] = newItem;
    update();
  };

  const getLastRequest = () => {
    return lastRequest;
  };

  const populateLastRequest = (fieldName, fieldValue) => {
    if (typeof fieldName !== 'string' || lastRequest[fieldName] === undefined) return;

    lastRequest[fieldName] = fieldValue;
    update();
  };

  const update = () => {
    window.localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    window.localStorage.setItem(LOCAL_STORAGE_LAST_REQUEST_KEY, JSON.stringify(lastRequest));

    eventEmitter.emit(events.historyUpdated);
  };

  const isIndexValid = index => {
    return index >= 0 || index < history.length;
  };

  const isEmpty = () => {
    return history.length === 0;
  };

  const getDefaultLastRequest = () => {
    const defaultState = getDefaultState();

    // qId is not saved in the last request because, when the form is being filled, the request
    // to save this qId in the Redis base has yet to be sent. Fetching it later to get the corresponding
    // queryString will just throw a 404 error.
    // Saving a very long queryString in the local storage is acceptable because only one lastRequest can be saved at a time.
    delete defaultState.qId;

    return defaultState;
  };

  const init = () => {
    lastRequest = getDefaultLastRequest();

    if (!window.localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || !window.localStorage.getItem(LOCAL_STORAGE_LAST_REQUEST_KEY)) {
      update();
    } else {
      history = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY));
      lastRequest = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LAST_REQUEST_KEY));
    }
  };

  init();

  const contextValue = {
    get,
    getAll,
    add,
    remove,
    removeAll,
    modify,
    getLastRequest,
    populateLastRequest,
    isEmpty,
  };

  return (
    <HistoryContext.Provider value={contextValue}>
      {children}
    </HistoryContext.Provider>
  );
}

export function useHistoryContext () {
  const context = useContext(HistoryContext);

  if (!context) {
    throw new Error('useHistoryContext must be within a HistoryProvider');
  }

  return context;
}

HistoryProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
