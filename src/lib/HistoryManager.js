import eventEmitter, { events } from './eventEmitter';
import { getDefaultState } from '../store/istexApiSlice';

const LOCAL_STORAGE_HISTORY_KEY = 'history';
const LOCAL_STORAGE_LAST_REQUEST_KEY = 'lastRequest';
const LOCAL_STORAGE_LIMIT = 30;

class HistoryManager {
  #history;
  #lastRequest;

  constructor () {
    this.#history = [];
    this.#lastRequest = HistoryManager.#getDefaultLastRequest();

    if (!window.localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY) || !window.localStorage.getItem(LOCAL_STORAGE_LAST_REQUEST_KEY)) {
      this.#update();
    } else {
      this.#history = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY));
      this.#lastRequest = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_LAST_REQUEST_KEY));
    }
  }

  getAll () {
    return this.#history;
  }

  get (index) {
    if (!this.#isIndexValid(index)) return null;

    return this.#history[index];
  }

  add (item) {
    this.#history.unshift(item);

    if (this.#history.length > LOCAL_STORAGE_LIMIT) {
      this.#history.pop();
    }

    this.#update();
  }

  remove (index) {
    if (!this.#isIndexValid(index)) return;

    this.#history.splice(index, 1);
    this.#update();
  }

  removeAll () {
    this.#history.splice(0, this.#history.length);
    this.#update();
  }

  modify (index, newItem) {
    if (!this.#isIndexValid(index)) return;

    this.#history[index] = newItem;
    this.#update();
  }

  getLastRequest () {
    return this.#lastRequest;
  }

  populateLastRequest (fieldName, fieldValue) {
    if (typeof fieldName !== 'string' || this.#lastRequest[fieldName] === undefined) return;

    this.#lastRequest[fieldName] = fieldValue;
    this.#update();
  }

  #update () {
    window.localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(this.#history));
    window.localStorage.setItem(LOCAL_STORAGE_LAST_REQUEST_KEY, JSON.stringify(this.#lastRequest));

    eventEmitter.emit(events.historyUpdated);
  }

  #isIndexValid (index) {
    return index >= 0 || index < this.#history.length;
  }

  isEmpty () {
    return this.#history.length === 0;
  }

  static #getDefaultLastRequest () {
    const defaultState = getDefaultState();

    // qId is not saved in the last request because, when the form is being filled, the request
    // to save this qId in the Redis base has yet to be sent. Fetching it later to get the corresponding
    // queryString will just throw a 404 error.
    // Saving a very long queryString in the local storage is acceptable because only one lastRequest can be saved at a time.
    delete defaultState.qId;

    return defaultState;
  }
}

export default new HistoryManager();
