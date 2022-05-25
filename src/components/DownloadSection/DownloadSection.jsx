import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setCompressionLevel, setArchiveType } from '../../store/istexApiSlice';
import DownloadButton from '../DownloadButton';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { istexApiConfig } from '../../config';

export default function DownloadSection () {
  const dispatch = useDispatch();
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

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
      <DownloadButton />
    </>
  );
}
