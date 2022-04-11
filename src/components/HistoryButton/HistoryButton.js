import React, { useEffect, useRef, useState } from 'react';
import './HistoryButton.css';
import HistoryRequest from '../HistoryRequest';
import eventEmitter from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function HistoryButton () {
  const modalWindow = useRef();
  const [requests, setRequests] = useState(localStorage.getAll());

  const setModalVisibility = visible => {
    const display = visible ? 'block' : 'none';
    modalWindow.current.style.display = display;
  };

  const localStorageUpdatedHandler = () => {
    // Yes, the array has to be cloned every time to trigger a re-render (cf. https://stackoverflow.com/a/67354136)
    setRequests([...localStorage.getAll()]);
  };

  const modalCloseRequestHandler = () => {
    setModalVisibility(false);
  };

  useEffect(() => {
    eventEmitter.addListener('localStorageUpdated', localStorageUpdatedHandler);
    eventEmitter.addListener('modalCloseRequest', modalCloseRequestHandler);
  }, []);

  return (
    <div>
      <button onClick={() => setModalVisibility(true)}>History</button>
      <div ref={modalWindow} className='modal'>
        <div className='modal-content'>
          <button onClick={() => setModalVisibility(false)} className='close'>&times;</button>
          <div className='history-table'>
            <header className='history-header'>
              <div className='history-header-item index'>#</div>
              <div className='history-header-item date'>Date</div>
              <div className='history-header-item request'>Request / q_id</div>
              <div className='history-header-item formats'>Formats</div>
              <div className='history-header-item nb-docs'>Nb. docs</div>
              <div className='history-header-item rank'>Rank mode</div>
              <div className='history-header-item actions'>Actions</div>
            </header>
            {requests.map((request, index) => (
              <HistoryRequest key={request.date} requestInfo={{ ...request, index }} />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
