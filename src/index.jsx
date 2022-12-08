import React from 'react';
import ReactDOM from 'react-dom';
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
  faCircleCheck,
  faMagnifyingGlass,
  faTrashCan,
  faAngleLeft,
  faCheck,
  faFileArrowUp,
} from '@fortawesome/free-solid-svg-icons';

import './index.scss';
import 'flowbite';
import 'react-toastify/dist/ReactToastify.min.css';

import App from './components/App/App';
import store from './store/store';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';

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
  faCircleCheck,
  faMagnifyingGlass,
  faTrashCan,
  faTriangleExclamation,
  faAngleLeft,
  faCheck,
  faFileArrowUp,
);

ReactDOM.render(
  <BrowserRouter>
    <Provider store={store}>
      <React.StrictMode>
        <App />
      </React.StrictMode>
    </Provider>
  </BrowserRouter>,
  document.getElementById('root'),
);
