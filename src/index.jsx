import React from 'react';
import ReactDOM from 'react-dom';
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
  faCircleCheck,
  faMagnifyingGlass,
  faTrashCan,
  faAngleLeft,
  faCheck,
  faFileArrowUp,
} from '@fortawesome/free-solid-svg-icons';

import App from './components/App/App';
import store from './store/store';
import EventEmitterProvider from '@/contexts/EventEmitterContext';

import 'flowbite';
import 'react-toastify/dist/ReactToastify.min.css';
import './index.scss';

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
  <React.StrictMode>
    <BrowserRouter>
      <Provider store={store}>
        <EventEmitterProvider>
          <App />
        </EventEmitterProvider>
      </Provider>
    </BrowserRouter>
  </React.StrictMode>,
  document.getElementById('root'),
);
