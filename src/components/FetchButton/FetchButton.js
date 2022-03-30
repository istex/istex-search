import React from 'react';
import eventEmitter from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function FetchButton () {
  const updateFormFromLastRequestInLocalStorage = () => {
    const mostRecentRequest = localStorage.get(0);

    eventEmitter.emit('queryInputChanged', mostRecentRequest.queryString);
    eventEmitter.emit('formatsChanged', mostRecentRequest.selectedFormats);
    eventEmitter.emit('numberOfDocumentsChanged', mostRecentRequest.numberOfDocuments);
    eventEmitter.emit('rankingModeChanged', mostRecentRequest.rankingMode);
    eventEmitter.emit('compressionLevelChanged', mostRecentRequest.compressionLevel);
    eventEmitter.emit('archiveTypeChanged', mostRecentRequest.archiveType);
  };

  return (
    <div>
      <button onClick={updateFormFromLastRequestInLocalStorage}>Fetch</button>
    </div>
  );
}
