import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import './HistoryButton.css';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';
import ModalListHistory from './ModalListHistory';

export default function HistoryButton ({ className, sizeIcon, fontSizeText }) {
  const [requests, setRequests] = useState(historyManager.getAll());
  const [openHistoryModal, setOpenHistoryModal] = useState(false);

  const setModalVisibility = (visible) => {
    setOpenHistoryModal(visible);
  };

  const historyUpdatedHandler = () => {
    // Yes, the array has to be cloned every time to trigger a re-render (cf. https://stackoverflow.com/a/67354136)
    setRequests([...historyManager.getAll()]);
  };

  useEffect(() => {
    eventEmitter.addListener(events.historyUpdated, historyUpdatedHandler);
  }, []);

  return (
    <>
      <div
        className={className}
        onClick={() => setModalVisibility(true)}
      >
        <div>
          <FontAwesomeIcon icon='clock-rotate-left' className={sizeIcon} />
        </div>
        <button className={fontSizeText}>Historique</button>
      </div>
      <ModalListHistory
        show={openHistoryModal}
        onClose={() => setOpenHistoryModal(false)}
        requests={requests}
      />
    </>
  );
}

HistoryButton.propTypes = {
  className: PropTypes.string,
  sizeIcon: PropTypes.string,
  fontSizeText: PropTypes.string,
};
