import eventEmitter, { events } from './eventEmitter';
import { getDefaultState } from '../store/istexApiSlice';

const LOCAL_STORAGE_KEY = 'istex-dl';
const LOCAL_STORAGE_LIMIT = 30;

/**
 * Local storage manager.
 */
class LocalStorage {
  constructor () {
    this._storage = {
      elements: [],
      lastRequest: this._getDefaultLastRequest(),
    };

    if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
      this._update();
    } else {
      this._storage = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    }
  }

  getAll () {
    return this._storage.elements;
  }

  get (index) {
    if (!this._isIndexValid(index)) return null;

    return this._storage.elements[index];
  }

  add (item) {
    this._storage.elements.unshift(item);

    if (this._storage.elements.length > LOCAL_STORAGE_LIMIT) {
      this._storage.elements.pop();
    }

    this._update();
  }

  remove (index) {
    if (!this._isIndexValid(index)) return;

    this._storage.elements.splice(index, 1);
    this._update();
  }

  modify (index, newItem) {
    if (!this._isIndexValid(index)) return;

    this._storage.elements[index] = newItem;
    this._update();
  }

  getLastRequest () {
    return this._storage.lastRequest;
  }

  populateLastRequest (fieldName, fieldValue) {
    if (typeof fieldName !== 'string' || this._storage.lastRequest[fieldName] === undefined) return;

    this._storage.lastRequest[fieldName] = fieldValue;
    this._update();
  }

  _update () {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._storage));
    eventEmitter.emit(events.localStorageUpdated);
  }

  _isIndexValid (index) {
    return index >= 0 || index < this._storage.elements.length;
  }

  _getDefaultLastRequest () {
    const defaultState = getDefaultState();

    // qId is not saved in the last request because, when the form is being filled, the request
    // to save this qId in the Redis base has yet to be sent. Fetching it later to get the corresponding
    // queryString will just throw a 404 error.
    // Saving a very long queryString in the local storage is acceptable because only be one lastRequest can be saved at a time.
    delete defaultState.qId;

    return defaultState;
  }
}

export default new LocalStorage();
