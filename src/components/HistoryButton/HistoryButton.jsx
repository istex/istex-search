import React, { useEffect, useRef, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import './HistoryButton.css';
import HistoryRequest from '../HistoryRequest/HistoryRequest';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';
import { Table } from 'flowbite-react';
import ModalListHistory from './ModalListHistory';

export default function HistoryButton () {
  const modalWindow = useRef();
  const [requests, setRequests] = useState(historyManager.getAll());
  const [openHistoryModal, setOpenHistoryModal] = useState(false);
  const [openDownloadModal, setOpenDownloadModal] = useState(false);
  const [openShareModal, setOpenShareModal] = useState(false);

  const setModalVisibility = (visible) => {
    setOpenHistoryModal(visible);
    // console.log('display', display);
    // const display = visible ? 'block' : 'none';
    // modalWindow.current.style.display = display;
  };

  const historyUpdatedHandler = () => {
    // Yes, the array has to be cloned every time to trigger a re-render (cf. https://stackoverflow.com/a/67354136)
    setRequests([...historyManager.getAll()]);
  };

  useEffect(() => {
    eventEmitter.addListener(events.historyUpdated, historyUpdatedHandler);
  }, []);

  return (
    <div
      className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white istex-footer__icon'
      onClick={() => setModalVisibility(true)}
    >
      <div className=''>
        <FontAwesomeIcon icon='clock-rotate-left' size='3x' />
      </div>
      <button className='istex-footer__text pt-1'>Historique</button>
      <ModalListHistory
        show={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        requests={requests}
      />
    </div>
  );
}
