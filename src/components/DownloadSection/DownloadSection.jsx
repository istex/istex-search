import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import { resetForm } from '../ResetButton';
import { buildFullUrl, isFormatSelected, sendDownloadApiRequest, sendSaveQIdApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';
import { istexApiConfig, formats, formatSizes } from '../../config';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const qId = useSelector(state => state.istexApi.qId);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);
  const usage = useSelector(state => state.istexApi.usage);

  const [archiveSizeInGigabytes, setArchiveSizeInGigabytes] = useState(0);

  const compressionLevelChangedHandler = newCompressionLevel => {
    dispatch(setCompressionLevel(newCompressionLevel));

    eventEmitter.emit(events.updateCompressionLevelParam, newCompressionLevel);
    eventEmitter.emit(events.setCompressionLevelInLastRequestOfHistory, newCompressionLevel);
  };

  const archiveTypeChangedHandler = newArchiveType => {
    dispatch(setArchiveType(newArchiveType));

    eventEmitter.emit(events.updateArchiveTypeParam, newArchiveType);
    eventEmitter.emit(events.setArchiveTypeInLastRequestOfHistory, newArchiveType);
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

    const url = buildFullUrl(options).toString();

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
      if (Number.isInteger(formats[formatCategory])) {
        format = formats[formatCategory];

        if (!isFormatSelected(selectedFormats, format)) continue;

        const formatSize = formatSizes.baseSizes[formatCategory];
        const multiplier = formatSizes.multipliers[compressionLevel][formatCategory];

        size += formatSize * multiplier * numberOfDocuments;

        continue;
      }

      for (const formatName in formats[formatCategory]) {
        format = formats[formatCategory][formatName];

        if (!isFormatSelected(selectedFormats, format)) continue;

        const formatSize = formatSizes.baseSizes[formatCategory][formatName];
        const multiplier = formatSizes.multipliers[compressionLevel][formatCategory][formatName];

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

  useEffect(() => {
    eventEmitter.addListener(events.compressionLevelChanged, compressionLevelChangedHandler);
    eventEmitter.addListener(events.archiveTypeChanged, archiveTypeChangedHandler);
  }, []);

  return (
    <>
      <h2>Download</h2>
      <span>Compression level: </span>
      <select
        value={compressionLevel}
        onChange={event => {
          let { value } = event.target;
          value = parseInt(value);
          compressionLevelChangedHandler(value);
        }}
      >
        {istexApiConfig.compressionLevels.levels.map(level => (
          <option key={level.label} value={level.value}>{level.label}</option>
        ))}
      </select>
      <div>
        <span>Archive type: </span>
        {istexApiConfig.archiveTypes.types.map(type => (
          <span key={type}>
            <input
              type='radio'
              checked={archiveType === type}
              value={type}
              name='archiveType'
              onChange={event => {
                const { value } = event.target;
                archiveTypeChangedHandler(value);
              }}
            />
            <label htmlFor={type}>{type}</label>
          </span>
        ))}
      </div>
      <button onClick={onDownload} disabled={isFormIncomplete}>Download</button>
      {archiveSizeInGigabytes >= 1 && (
        <span>{archiveSizeInGigabytes >= 5 ? 'Danger' : archiveSizeInGigabytes >= 1 ? 'Warning' : ''}: &gt;{archiveSizeInGigabytes} GB</span>
      )}
    </>
  );
}
