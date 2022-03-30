import eventEmitter from './eventEmitter';

const LOCAL_STORAGE_KEY = 'istex-dl';
const LOCAL_STORAGE_LIMIT = 30;

/**
 * Local storage manager.
 */
class LocalStorage {
  constructor () {
    this._elements = [];

    if (!window.localStorage.getItem(LOCAL_STORAGE_KEY)) {
      this._update();
    } else {
      this._elements = JSON.parse(window.localStorage.getItem(LOCAL_STORAGE_KEY));
    }
  }

  getAll () {
    return this._elements;
  }

  get (index) {
    if (index < 0 || index >= this._elements.length) return null;

    return this._elements[index];
  }

  add (item) {
    this._elements.unshift(item);

    if (this._elements.length > LOCAL_STORAGE_LIMIT) {
      this._elements.pop();
    }

    this._update();
  }

  remove (index) {
    if (index < 0 || index >= this._elements.length) return;

    this._elements.splice(index, 1);
    this._update();
  }

  modify (index, newItem) {
    if (index < 0 || index >= this._elements.length) return;

    this._elements[index] = newItem;
    this._update();
  }

  _update () {
    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(this._elements));
    eventEmitter.emit('localStorageUpdated');
  }
}

export default new LocalStorage();
