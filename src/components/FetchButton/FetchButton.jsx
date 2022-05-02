import React, { useEffect, useState } from 'react';
import eventEmitter, { events } from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function FetchButton () {
  const [isButtonEnabled, enableButton] = useState(!!localStorage.get(0));

  const updateFormFromLastRequestInLocalStorage = () => {
    const mostRecentRequest = localStorage.get(0);

    if (!mostRecentRequest) {
      return;
    }

    if (mostRecentRequest.qId) {
      eventEmitter.emit(events.qIdChanged, mostRecentRequest.qId);
    } else {
      eventEmitter.emit(events.queryInputChanged, mostRecentRequest.queryString);
    }

    eventEmitter.emit(events.queryInputChanged, mostRecentRequest.queryString);
    eventEmitter.emit(events.formatsChanged, mostRecentRequest.selectedFormats);
    eventEmitter.emit(events.numberOfDocumentsChanged, mostRecentRequest.numberOfDocuments);
    eventEmitter.emit(events.rankingModeChanged, mostRecentRequest.rankingMode);
    eventEmitter.emit(events.compressionLevelChanged, mostRecentRequest.compressionLevel);
    eventEmitter.emit(events.archiveTypeChanged, mostRecentRequest.archiveType);
  };

  const localStorageUpdatedHandler = () => {
    enableButton(!!localStorage.get(0));
  };

  useEffect(() => {
    eventEmitter.addListener(events.localStorageUpdated, localStorageUpdatedHandler);
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
