import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import { buildFullUrl, sendDownloadApiRequest, sendSaveQIdApiRequest } from '../../lib/istexApi';
import { istexApiConfig, compressionLevels } from '../../config';
import eventEmitter from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const qId = useSelector(state => state.istexApi.qId);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

  // currentArchiveType is a local state variable linked to the UI while archiveType is in the Redux store
  // currentArchiveType is used to be able to reset the UI from the reset button
  const [currentArchiveType, setCurrentArchiveType] = useState(istexApiConfig.archiveTypes[0]);

  const compressionLevelChangedHandler = value => {
    dispatch(setCompressionLevel(value));

    eventEmitter.emit('updateCompressionLevelParam', value);
  };

  const archiveTypeChangedHandler = value => {
    setCurrentArchiveType(value);
    dispatch(setArchiveType(value));

    eventEmitter.emit('updateArchiveTypeParam', value);
  };

  useEffect(() => {
    eventEmitter.addListener('compressionLevelChanged', compressionLevelChangedHandler);
    eventEmitter.addListener('archiveTypeChanged', archiveTypeChangedHandler);
  }, []);

  const onDownload = async () => {
    const options = {
      selectedFormats,
      rankingMode,
      numberOfDocuments,
      compressionLevel,
      archiveType,
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
        {compressionLevels.map(level => (
          <option key={level.label} value={level.value}>{level.label}</option>
        ))}
      </select>
      <div>
        <span>Archive type: </span>
        {istexApiConfig.archiveTypes.map(type => (
          <span key={type}>
            <input
              type='radio'
              checked={currentArchiveType === type}
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
