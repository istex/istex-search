import React, { useEffect, useState } from 'react';
import eventEmitter from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function FetchButton () {
  const [isButtonEnabled, enableButton] = useState(!!localStorage.get(0));

  const updateFormFromLastRequestInLocalStorage = () => {
    const mostRecentRequest = localStorage.get(0);

    if (!mostRecentRequest) {
      return;
    }

    if (mostRecentRequest.qId) {
      eventEmitter.emit('qIdChanged', mostRecentRequest.qId);
    } else {
      eventEmitter.emit('queryInputChanged', mostRecentRequest.queryString);
    }

    eventEmitter.emit('queryInputChanged', mostRecentRequest.queryString);
    eventEmitter.emit('formatsChanged', mostRecentRequest.selectedFormats);
    eventEmitter.emit('numberOfDocumentsChanged', mostRecentRequest.numberOfDocuments);
    eventEmitter.emit('rankingModeChanged', mostRecentRequest.rankingMode);
    eventEmitter.emit('compressionLevelChanged', mostRecentRequest.compressionLevel);
    eventEmitter.emit('archiveTypeChanged', mostRecentRequest.archiveType);
  };

  const localStorageUpdatedHandler = () => {
    enableButton(!!localStorage.get(0));
  };

  useEffect(() => {
    eventEmitter.addListener('localStorageUpdated', localStorageUpdatedHandler);
  }, []);

  return (
    <div>
      <button
        onClick={updateFormFromLastRequestInLocalStorage}
        disabled={!isButtonEnabled}
      >
        Fetch
      </button>
    </div>
  );
}
