import React from 'react';
import PropTypes from 'prop-types';
import { describe, it, expect } from 'vitest';

import { customRender as render } from '../test/utils';
import HistoryProvider, { useHistoryContext } from '@/contexts/HistoryContext';
import { getDefaultState } from '@/store/istexApiSlice';

describe('Tests for the HistoryContext', () => {
  test('get', history => {
    history.add({ foo: 'bar' });
    expect(history.get(0)).toEqual({ foo: 'bar' });
    history.remove(0);
  });

  test('getAll', history => {
    history.add({ foo: 'bar' });
    history.add({ hello: 'world' });
    expect(history.getAll()).toEqual([{ hello: 'world' }, { foo: 'bar' }]);
    history.remove(1);
    history.remove(0);
  });

  test('add', history => {
    expect(history.getAll()).toEqual([]);
    history.add({ foo: 'bar' });
    expect(history.getAll()).toEqual([{ foo: 'bar' }]);
    history.remove(0);
  });

  test('remove', history => {
    history.add({ foo: 'bar' });
    expect(history.getAll()).toEqual([{ foo: 'bar' }]);
    history.remove(0);
    expect(history.getAll()).toEqual([]);
  });

  test('modify', history => {
    history.add({ foo: 'bar' });
    expect(history.getAll()).toEqual([{ foo: 'bar' }]);
    history.modify(0, { foo: 'biz' });
    expect(history.getAll()).toEqual([{ foo: 'biz' }]);
    history.remove(0);
  });

  const defaultLastRequest = getDefaultState();
  delete defaultLastRequest.qId;

  test('populateLastRequest', history => {
    expect(history.getLastRequest()).toEqual(defaultLastRequest);
    history.populateLastRequest('numberOfDocuments', 3);
    expect(history.getLastRequest()).toEqual({ ...defaultLastRequest, numberOfDocuments: 3 });
    history.populateLastRequest('numberOfDocuments', defaultLastRequest.numberOfDocuments);
  });
});

// Dummy component that executes `callback` within a HistoryContext, `callback` is supposed to hold the testing code.
function HistoryConsumer ({ callback }) {
  const DummyComponent = ({ callback }) => {
    callback(useHistoryContext());
    return null;
  };

  return <HistoryProvider><DummyComponent callback={callback} /></HistoryProvider>;
}

HistoryConsumer.propTypes = { callback: PropTypes.func.isRequired };

/**
 * Wrapper around to `it` function provided by vitest to render a HistoryConsumer and pass it `callback` as a prop.
 * @param {string} testName The name of the test.
 * @param {function} callback The callback with the different assertions.
 */
function test (testName, callback) {
  it(testName, () => {
    render(<HistoryConsumer callback={callback} />);
  });
}
