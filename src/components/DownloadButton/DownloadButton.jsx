import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { Tooltip } from 'flowbite-react';

import ModalDownloadRewiews from './ModalDownloadRewiews';
import { buildFullApiUrl, sendDownloadApiRequest, sendSaveQIdApiRequest } from '../../lib/istexApi';
import useResetForm from '@/hooks/useResetForm';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import { useHistoryContext } from '@/contexts/HistoryContext';

export default function DownloadButton () {
  const queryString = useSelector(state => state.istexApi.queryString);
  const qId = useSelector(state => state.istexApi.qId);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);
  const usage = useSelector(state => state.istexApi.usage);

  const [openModal, setOpenModal] = useState(false);
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const handleDownload = (event) => {
    setOpenModal(true);

    if (event) {
      onDownload();
    }
  };

  const onDownload = async () => {
    const options = {
      selectedFormats,
      rankingMode,
      numberOfDocuments,
      compressionLevel,
      archiveType,
      usage,
    };

    if (qId) {
      try {
        await sendSaveQIdApiRequest(qId, queryString);
      } catch (err) {
        // 409 errors are expected because, in some scenarios, the q_id will already be saved in the redis base
        if (err.response.status !== 409) {
          // TODO: print the error in a modal or something else
          console.error(err);
          return;
        }
      }

      options.qId = qId;
    } else {
      options.queryString = queryString;
    }

    const url = buildFullApiUrl(options).toString();

    // This function is synchronous
    sendDownloadApiRequest(url);

    history.add({
      ...options,
      date: Date.now(),
    });

    // Reset the whole form once the download is complete
    resetForm();
  };

  useEffect(() => {
    eventEmitter.addListener(events.displayDownloadModal, handleDownload);
  }, []);

  const isFormIncomplete = queryString === '' ||
    !selectedFormats ||
    !rankingMode ||
    !numberOfDocuments ||
    compressionLevel == null || // We can't just do !compressionLevel because 0 is a valid value
    !archiveType;

  // eslint-disable-next-line react/prop-types
  const DownloadButtonWrapper = ({ disabled, onClick }) => {
    return (
      <button
        className={`border-none text-white font-montserrat font-medium py-[16px] px-[30px] leading-[18px] ${disabled ? 'cursor-not-allowed bg-istcolor-grey-medium' : 'cursor-pointer bg-istcolor-blue button cta1'}`}
        onClick={onClick}
        disabled={disabled}
      >
        Télécharger
      </button>
    );
  };

  return (
    <div className='mt-6'>
      <div className='text-center flex justify-center'>
        {isFormIncomplete
          ? (
            <Tooltip
              content={
                <p className='text-sm text-white'>
                  Pour activer le téléchargement,<br />
                  complétez le formulaire en remplissant<br />
                  la fenêtre de requêtage par au moins <br />
                  <span className='font-bold'>1 caractère</span>, en sélectionnant au moins<br />
                  <span className='font-bold'>1 document</span> et en cochant au moins<br />
                  <span className='font-bold'>1 format</span> de fichier.
                </p>
              }
              animation={false}
              style='light'
            >
              <DownloadButtonWrapper disabled={isFormIncomplete} onClick={handleDownload} />
            </Tooltip>
            )
          : (
            <DownloadButtonWrapper disabled={isFormIncomplete} onClick={handleDownload} />
            )}
      </div>
      {openModal && (
        <ModalDownloadRewiews
          initOpening={openModal}
          setOpenModal={setOpenModal}
        />
      )}
    </div>
  );
}
