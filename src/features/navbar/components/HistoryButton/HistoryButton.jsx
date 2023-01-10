import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ModalListHistory from './ModalListHistory';

import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import { useHistoryContext } from '@/contexts/HistoryContext';

import './HistoryButton.css';

export default function HistoryButton () {
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const [requests, setRequests] = useState(history.getAll());
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const setModalVisibility = (visible) => {
    setOpenHistoryModal(visible);
  };

  const historyUpdatedHandler = () => {
    // Yes, the array has to be cloned every time to trigger a re-render (cf. https://stackoverflow.com/a/67354136)
    setRequests([...history.getAll()]);
  };

  useEffect(() => {
    eventEmitter.addListener(events.historyUpdated, historyUpdatedHandler);
  }, []);

  return (
    <>
      <div
        className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-1.5 text-istcolor-black'
        onClick={() => setModalVisibility(true)}
      >
        <div>
          <FontAwesomeIcon icon='clock-rotate-left' className='text-3xl md:text-4xl' />
        </div>
        <span className='text-center align-top'>Historique</span>
      </div>
      <ModalListHistory
        show={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        requests={requests}
      />
    </>
  );
}