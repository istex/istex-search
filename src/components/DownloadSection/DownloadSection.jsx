import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import DownloadButton from '../DownloadButton/DownloadButton';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { isFormatSelected } from '../../lib/istexApi';
import { istexApiConfig, formats, formatSizes } from '../../config';

import TitleSection from '../TitleSection/TitleSection';
import FeedbackMessage, { FeedbackMessageTypes } from '../FeedbackMessage/FeedbackMessage';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);
  const [showTooltipContent, setShowTooltipContent] = useState(true);
  const [archiveSizeInGigabytes, setArchiveSizeInGigabytes] = useState(0);

  const compressionLevelHandler = newCompressionLevel => {
    dispatch(setCompressionLevel(newCompressionLevel));

    eventEmitter.emit(events.setCompressionLevelUrlParam, newCompressionLevel);
    eventEmitter.emit(events.setCompressionLevelInLastRequestOfHistory, newCompressionLevel);
  };

  const archiveTypeHandler = newArchiveType => {
    dispatch(setArchiveType(newArchiveType));

    eventEmitter.emit(events.setArchiveTypeUrlParam, newArchiveType);
    eventEmitter.emit(events.setArchiveTypeInLastRequestOfHistory, newArchiveType);
  };

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

  useEffect(() => {
    eventEmitter.addListener(events.setCompressionLevel, compressionLevelHandler);
    eventEmitter.addListener(events.setArchiveType, archiveTypeHandler);
  }, []);

  useEffect(updateArchiveSizeText, [selectedFormats, compressionLevel, numberOfDocuments]);

  return (
    <div className='text-center my-12 font-opensans font-[14px]'>
      <TitleSection
        title='Téléchargement'
        num='3'
        showTooltipContent={showTooltipContent}
        infoTextContent={
          <>
            <div className='flex w-full justify-end relative left-1'>
              <button type='button' onClick={() => setShowTooltipContent(!showTooltipContent)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                <span className='sr-only'>Fermer l'info bulle</span>
                <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <p className='text-sm text-white'>
              Une estimation de la taille du corpus<br />
              s’affiche dans le bouton "télécharger"<br />
              lorsqu’elle excède 1 Go.<br />
              Dans le cas d’un corpus volumineux,<br />
              sélectionnez le niveau de<br />
              compression approprié à votre<br />
              bande passante et à l’espace de<br />
              stockage disponible sur votre disque<br />
              dur.<br />
              En cas de difficultés lors de<br />
              l’ouverture de l’archive ZIP avec les<br />
              outils Windows natifs, utilisez par<br />
              exemple le logiciel libre <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://www.7-zip.org/' rel='noreferrer'>7-zip</a>.<br />
              Voir la <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#t%C3%A9l%C3%A9chargement%0D-_1' rel='noreferrer'>documentation Istex</a>.
            </p>
          </>
        }
      />
      <div className='flex flex-col md:flex-row items-center justify-center mt-4 text-base'>
        <div className='pr-8'>
          <span className='pr-2'>Niveau de compression : </span>
          <select
            value={compressionLevel}
            onChange={event => {
              let { value } = event.target;
              value = parseInt(value);
              compressionLevelHandler(value);
            }}
            className='bg-white pl-4 py-2 text-sm'
          >
            {istexApiConfig.compressionLevels.levels.map(level => (
              <option key={level.label} value={level.value}>{level.label}</option>
            ))}
          </select>
        </div>
        <div>
          <span className='inline-block pt-2 md:pt-0 pr-2'>Format de l'archive : </span>
          {istexApiConfig.archiveTypes.types.map(type => (
            <span key={type.value} className='pr-4'>
              <input
                type='radio'
                checked={archiveType === type.value}
                value={type.value}
                name='archiveType'
                onChange={event => {
                  const { value } = event.target;
                  archiveTypeHandler(value);
                }}
              />
              <label className='pl-2' htmlFor={type.value}>{type.label.toUpperCase()}</label>
            </span>
          ))}
        </div>
      </div>
      {archiveSizeInGigabytes >= 1 && (
        <div className='my-6'>
          <FeedbackMessage
            type={archiveSizeInGigabytes >= 6 ? FeedbackMessageTypes.Error : FeedbackMessageTypes.Warning}
            message={<>Taille estimée &gt; {archiveSizeInGigabytes} Go</>}
          />
        </div>
      )}
      <DownloadButton />
    </div>
  );
}
