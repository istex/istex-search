import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import { buildFullUrl } from '../../lib/istexApi';
import { istexApiConfig, compressionLevels } from '../../config';
import eventEmitter from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);
  const [fullUrl, setFullUrl] = useState('');

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

  const fullUrlChangedHandler = value => {
    setFullUrl(value);
  };

  useEffect(() => {
    eventEmitter.addListener('compressionLevelChanged', compressionLevelChangedHandler);
    eventEmitter.addListener('archiveTypeChanged', archiveTypeChangedHandler);
    eventEmitter.addListener('fullUrlChanged', fullUrlChangedHandler);
  }, []);

  const onBuildUrl = () => {
    const options = {
      queryString,
      selectedFormats,
      rankingMode,
      numberOfDocuments,
      compressionLevel,
      archiveType,
    };
    fullUrlChangedHandler(buildFullUrl(options).toString());

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
      <button onClick={onBuildUrl} disabled={isFormIncomplete}>Build URL</button>
      <p>final URL: {decodeURIComponent(fullUrl)}</p>
    </>
  );
}
