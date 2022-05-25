import { describe, expect, it } from 'vitest';
import historyManager from './HistoryManager';
import { getDefaultState } from '../store/istexApiSlice';

describe('Tests for the HistoryManager class', () => {
  it('getAll', () => {
    historyManager.add({ foo: 'bar' });
    historyManager.add({ hello: 'world' });
    expect(historyManager.getAll()).toEqual([{ hello: 'world' }, { foo: 'bar' }]);
    historyManager.remove(1);
    historyManager.remove(0);
  });

  it('get', () => {
    historyManager.add({ foo: 'bar' });
    expect(historyManager.get(0)).toEqual({ foo: 'bar' });
    historyManager.remove(0);
  });

  it('add', () => {
    expect(historyManager.getAll()).toEqual([]);
    historyManager.add({ foo: 'bar' });
    expect(historyManager.getAll()).toEqual([{ foo: 'bar' }]);
    historyManager.remove(0);
  });

  it('remove', () => {
    historyManager.add({ foo: 'bar' });
    expect(historyManager.getAll()).toEqual([{ foo: 'bar' }]);
    historyManager.remove(0);
    expect(historyManager.getAll()).toEqual([]);
  });

  it('modify', () => {
    historyManager.add({ foo: 'bar' });
    expect(historyManager.getAll()).toEqual([{ foo: 'bar' }]);
    historyManager.modify(0, { foo: 'biz' });
    expect(historyManager.getAll()).toEqual([{ foo: 'biz' }]);
    historyManager.remove(0);
  });

  const defaultLastRequest = getDefaultState();
  delete defaultLastRequest.qId;

  it('populateLastRequest', () => {
    expect(historyManager.getLastRequest()).toEqual(defaultLastRequest);
    historyManager.populateLastRequest('numberOfDocuments', 3);
    expect(historyManager.getLastRequest()).toEqual({ ...defaultLastRequest, numberOfDocuments: 3 });
    historyManager.populateLastRequest('numberOfDocuments', defaultLastRequest.numberOfDocuments);
  });
});
