import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import ModalShareButton from './ModalShareButton';
import eventEmitter, { events } from '../../lib/eventEmitter';

export default function ShareButton () {
  const queryString = useSelector(state => state.istexApi.queryString);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

  const [openModal, setOpenModal] = useState(false);
  const [urlToClipboard, setUrlToClipboard] = useState('');

  const isFormIncomplete = queryString === '' ||
    !selectedFormats ||
    !rankingMode ||
    !numberOfDocuments ||
    compressionLevel == null || // We can't just do !compressionLevel because 0 is a valid value
    !archiveType;

  const handleShareButton = (option) => {
    const optionType = typeof option === 'string';
    if (isFormIncomplete && !optionType) {
      return;
    }

    setOpenModal(true);
    setUrlToClipboard(optionType ? option : window.location.href);
  };

  useEffect(() => {
    eventEmitter.addListener(events.displayShareModal, handleShareButton);
  }, []);

  const handleSaveToClipboard = () => {
    setOpenModal(false);
    navigator.clipboard.writeText(urlToClipboard)
      .then(() => eventEmitter.emit(events.displayNotification, { text: 'le lien a été copié dans le presse-papier' }))
      .catch(() => eventEmitter.emit(events.displayNotification, {
        text: 'Une erreur est survenue, veuillez réessayer ultérieurement !',
        type: 'error',
      }));
  };

  return (
    <>
      <div
        className={`flex flex-col justify-between istex-footer__link items-center mx-5 ${isFormIncomplete ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} hover:text-white istex-footer__icon`}
        onClick={handleShareButton}
      >
        <div className='pb-2'>
          <FontAwesomeIcon icon='link' size='3x' />
        </div>
        <button
          className='istex-footer__text pt-1'
          disabled={isFormIncomplete}
        >
          Partager
        </button>
      </div>
      {openModal && (
        <ModalShareButton
          initOpening={openModal}
          urlToClipboard={urlToClipboard}
          setOpenModal={setOpenModal}
          handleSaveToClipboard={handleSaveToClipboard}
        />
      )}
    </>
  );
}
