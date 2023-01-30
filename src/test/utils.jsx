import React from 'react';
import PropTypes from 'prop-types';
import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import { library } from '@fortawesome/fontawesome-svg-core';
import {
  faEraser,
  faRepeat,
  faLink,
  faClockRotateLeft,
  faCircleInfo,
  faExclamationCircle,
  faTriangleExclamation,
  faAngleDoubleLeft,
  faAngleDoubleRight,
  faPenToSquare,
  faDownload,
  faXmark,
} from '@fortawesome/free-solid-svg-icons';

import myStore from '@/store/store';
import EventEmitterProvider from '@/contexts/EventEmitterContext';

// Custom render function that will wrap the component to test in a Redux Provider and a Router
// to allow it to access the store.
export function customRender (ui, {
  store = myStore,
  ...renderOptions
} = {}) {
  library.add(
    faEraser,
    faRepeat,
    faLink,
    faClockRotateLeft,
    faCircleInfo,
    faExclamationCircle,
    faTriangleExclamation,
    faAngleDoubleLeft,
    faAngleDoubleRight,
    faPenToSquare,
    faDownload,
    faXmark,
  );

  // Wrapper component
  function Wrapper ({ children }) {
    return (
      <BrowserRouter>
        <Provider store={store}>
          <EventEmitterProvider>
            {children}
          </EventEmitterProvider>
        </Provider>
      </BrowserRouter>
    );
  }

  // Props validation to make sure the children of the component to test are in an object
  Wrapper.propTypes = {
    children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
  };

  // Call the render function from React, pass it the wrapper and propagate the render options
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

/**
 * Catch the potential error thrown by `func` and return it.
 * @param {function} func The function that is supposed to throw an error.
 * @returns An instance of `Error` if `func` throws, `null` otherwise.
 */
export function getError (func) {
  try {
    func();
  } catch (err) {
    return err;
  }

  return null;
}

export * from '@testing-library/react';
