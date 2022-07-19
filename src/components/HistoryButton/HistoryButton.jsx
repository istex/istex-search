import React, { useEffect, useRef, useState } from 'react';
import { ClockIcon } from '@heroicons/react/solid';

import './HistoryButton.css';
import HistoryRequest from '../HistoryRequest/HistoryRequest';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';

export default function HistoryButton () {
  const modalWindow = useRef();
  const [requests, setRequests] = useState(historyManager.getAll());

  const setModalVisibility = visible => {
    const display = visible ? 'block' : 'none';
    modalWindow.current.style.display = display;
  };

  const historyUpdatedHandler = () => {
    // Yes, the array has to be cloned every time to trigger a re-render (cf. https://stackoverflow.com/a/67354136)
    setRequests([...historyManager.getAll()]);
  };

  const closeHistoryModal = () => {
    setModalVisibility(false);
  };

  useEffect(() => {
    eventEmitter.addListener(events.historyUpdated, historyUpdatedHandler);
    eventEmitter.addListener(events.closeHistoryModal, closeHistoryModal);
  }, []);

  return (
    <div className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white'>
      <div className=''>
        <ClockIcon className='h-12 w-12' />
      </div>
      <button className='istex-footer__text' onClick={() => setModalVisibility(true)}>Historique</button>
      <div ref={modalWindow} className='modal'>
        <div className='modal-content'>
          <button onClick={() => setModalVisibility(false)} className='close'>&times;</button>
          <div className='history-table'>
            <header className='history-header'>
              <div className='history-header-item index'>#</div>
              <div className='history-header-item date'>Date</div>
              <div className='history-header-item request'>Request</div>
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
