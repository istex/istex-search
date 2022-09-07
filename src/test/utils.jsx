import React from 'react';
import { render } from '@testing-library/react';
import myStore from '../store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
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

// Custom render function that will wrap the component to test in a Redux Provider and a Router
// to allow it to access the store.
function customRender (ui, {
  preloadedState,
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
        <Provider store={store}>{children}</Provider>
      </BrowserRouter>
    );
  }

  // Props validation to make sure the children of the component to test are in an object
  Wrapper.propTypes = {
    children: PropTypes.object,
  };

  // Call the render function from React, pass it the wrapper and propagate the render options
  return render(ui, { wrapper: Wrapper, ...renderOptions });
}

export * from '@testing-library/react';

export { customRender };
