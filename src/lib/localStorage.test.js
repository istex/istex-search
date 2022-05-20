import { describe, expect, it } from 'vitest';
import localStorage from './localStorage';

describe('Tests for the LocalStorage class', () => {
  it('getAll', () => {
    localStorage.add({ foo: 'bar' });
    localStorage.add({ hello: 'world' });
    expect(localStorage.getAll()).toEqual([{ hello: 'world' }, { foo: 'bar' }]);
    localStorage.remove(1);
    localStorage.remove(0);
  });

  it('get', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.get(0)).toEqual({ foo: 'bar' });
    localStorage.remove(0);
  });

  it('add', () => {
    expect(localStorage.getAll()).toEqual([]);
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).toEqual([{ foo: 'bar' }]);
    localStorage.remove(0);
  });

  it('remove', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).toEqual([{ foo: 'bar' }]);
    localStorage.remove(0);
    expect(localStorage.getAll()).toEqual([]);
  });

  it('modify', () => {
    localStorage.add({ foo: 'bar' });
    expect(localStorage.getAll()).toEqual([{ foo: 'bar' }]);
    localStorage.modify(0, { foo: 'biz' });
    expect(localStorage.getAll()).toEqual([{ foo: 'biz' }]);
    localStorage.remove(0);
  });

  const defaultLastRequest = localStorage._getDefaultLastRequest();

  it('populateLastRequest', () => {
    expect(localStorage.getLastRequest()).toEqual(defaultLastRequest);
    localStorage.populateLastRequest('numberOfDocuments', 3);
    expect(localStorage.getLastRequest()).toEqual({ ...defaultLastRequest, numberOfDocuments: 3 });
    localStorage.populateLastRequest('numberOfDocuments', defaultLastRequest.numberOfDocuments);
  });

  it('_update', () => {
    localStorage._storage.elements.push({ foo: 'bar' });
    localStorage._storage.lastRequest.numberOfDocuments = 3;
    expect(JSON.parse(window.localStorage.getItem('istex-dl'))).toEqual({
      elements: [],
      lastRequest: defaultLastRequest,
    });
    localStorage._update();
    expect(JSON.parse(window.localStorage.getItem('istex-dl'))).toEqual({
      elements: [{ foo: 'bar' }],
      lastRequest: {
        ...defaultLastRequest,
        numberOfDocuments: 3,
      },
    });
  });
});
