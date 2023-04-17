import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { useSelector } from 'react-redux';
import { Tooltip } from 'flowbite-react';

import ModalShareButton from './ModalShareButton';

import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function ShareButton () {
  const queryString = useSelector(state => state.istexApi.queryString);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

  const [openModal, setOpenModal] = useState(false);
  const [urlToClipboard, setUrlToClipboard] = useState('');
  const { eventEmitter, events } = useEventEmitterContext();

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

    return () => {
      eventEmitter.removeListener(events.displayShareModal, handleShareButton);
    };
  }, []);

  const handleSaveToClipboard = () => {
    setOpenModal(false);
    navigator.clipboard.writeText(urlToClipboard)
      .then(() => eventEmitter.emit(events.displayNotification, {
        text: 'le lien a été copié dans le presse-papier',
        type: 'warn',
      }))
      .catch(() => eventEmitter.emit(events.displayNotification, {
        text: 'Une erreur est survenue, veuillez réessayer ultérieurement !',
        type: 'error',
      }));
  };

  return (
    <>
      <Tooltip
        content={(
          <div className='max-w-[9rem] text-center'>
            Activez cette fonctionnalité en complétant le formulaire et partagez votre corpus avant de le télécharger
          </div>
          )}
      >
        <div
          className={`flex flex-col justify-center items-center ${isFormIncomplete ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'} hover:bg-istcolor-white hover:rounded-md p-2.5 h-[4.75rem] text-istcolor-black`}
          onClick={handleShareButton}
        >
          <div>
            <FontAwesomeIcon icon='link' className='text-3xl md:text-4xl' />
          </div>
          <span
            className='text-center align-top'
            disabled={isFormIncomplete}
          >
            Partager
          </span>
        </div>
      </Tooltip>
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
