import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';

import { resetForm } from '../ResetButton/ResetButton';
import { buildFullApiUrl, isFormatSelected, sendDownloadApiRequest, sendSaveQIdApiRequest } from '../../lib/istexApi';
import historyManager from '../../lib/HistoryManager';
import { formats, formatSizes } from '../../config';
import { Tooltip } from 'flowbite-react';

export default function DownloadButton () {
  const queryString = useSelector(state => state.istexApi.queryString);
  const qId = useSelector(state => state.istexApi.qId);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);
  const usage = useSelector(state => state.istexApi.usage);

  const [archiveSizeInGigabytes, setArchiveSizeInGigabytes] = useState(0);

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

    historyManager.add({
      ...options,
      date: Date.now(),
    });

    // Reset the whole form once the download is complete
    resetForm();
  };

  const isFormIncomplete = queryString === '' ||
    !selectedFormats ||
    !rankingMode ||
    !numberOfDocuments ||
    compressionLevel == null || // We can't just do !compressionLevel because 0 is a valid value
    !archiveType;

  const estimateArchiveSize = () => {
    let size = 0;

    for (const formatCategory in formats) {
      let format;

      // Cases of covers and annexes which are not in a category
      if (formats[formatCategory].value !== undefined) {
        format = formats[formatCategory].value;

        if (!isFormatSelected(selectedFormats, format)) continue;

        const formatSize = formatSizes.baseSizes[formatCategory];
        const multiplier = formatSizes[archiveType].multipliers[compressionLevel][formatCategory];

        size += formatSize * multiplier * numberOfDocuments;

        continue;
      }

      for (const formatName in formats[formatCategory].formats) {
        format = formats[formatCategory].formats[formatName].value;

        if (!isFormatSelected(selectedFormats, format)) continue;

        const formatSize = formatSizes.baseSizes[formatCategory][formatName];
        const multiplier = formatSizes[archiveType].multipliers[compressionLevel][formatCategory][formatName];

        size += formatSize * multiplier * numberOfDocuments;
      }
    }

    return size;
  };

  const updateArchiveSizeText = () => {
    const size = estimateArchiveSize();
    const oneGigabyte = 1 * 1024 * 1024 * 1024;
    const sizeRoundedToLowerGigabyte = Math.floor(size / oneGigabyte);

    setArchiveSizeInGigabytes(sizeRoundedToLowerGigabyte);
  };

  useEffect(updateArchiveSizeText, [selectedFormats, compressionLevel, numberOfDocuments]);

  // eslint-disable-next-line react/prop-types
  const DownloadButtonWrapper = ({ disabled, onClick }) => {
    return (
      <button
        className={`border-none text-white font-bold py-[16px] px-[30px] leading-[18px] ${disabled ? 'cursor-not-allowed bg-istcolor-grey-medium' : 'cursor-pointer bg-istcolor-blue button cta1'}`}
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
                <p className='text-sm'>
                  Pour activer le téléchargement<br />,
                  complétez le formulaire en remplissant<br />
                  la fenêtre de requêtage par au moins <br />
                  <span className='font-bold'>1 caractère</span>, en sélectionnant au moins<br />
                  <span className='font-bold'>1 document</span> et en cochant au moins<br />
                  <span className='font-bold'>1 format</span> de fichier.
                </p>
              }
              animation={false}
              style='light'
              placement='right'
            >
              <DownloadButtonWrapper disabled={isFormIncomplete} onClick={onDownload} />
            </Tooltip>
            )
          : (
            <DownloadButtonWrapper disabled={isFormIncomplete} onClick={onDownload} />
            )}
      </div>
      {archiveSizeInGigabytes >= 1 && (
        <span>{archiveSizeInGigabytes >= 5 ? 'Danger' : archiveSizeInGigabytes >= 1 ? 'Warning' : ''}: &gt;{archiveSizeInGigabytes} GB</span>
      )}
    </div>
  );
}
