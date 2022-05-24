import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import { resetForm } from '../ResetButton';
import { buildFullUrl, sendDownloadApiRequest, sendSaveQIdApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';
import { istexApiConfig } from '../../config';

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

  useEffect(() => {
    eventEmitter.addListener(events.compressionLevelChanged, compressionLevelChangedHandler);
    eventEmitter.addListener(events.archiveTypeChanged, archiveTypeChangedHandler);
  }, []);

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

    localStorage.add({
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
    </>
  );
}
