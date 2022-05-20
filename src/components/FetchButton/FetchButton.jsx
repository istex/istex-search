import React, { useEffect } from 'react';
import eventEmitter, { events } from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

export default function FetchButton () {
  const updateFormFromLastRequestInLocalStorage = () => {
    const mostRecentRequest = localStorage.getLastRequest();

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

  const populateLastRequest = (fieldName, fieldValue) => {
    localStorage.populateLastRequest(fieldName, fieldValue);
  };

  useEffect(() => {
    eventEmitter.addListener(events.setQueryStringInLastRequestOfHistory, queryString => populateLastRequest('queryString', queryString));
    eventEmitter.addListener(events.setNumberOfDocumentsInLastRequestOfHistory, numberOfDocuments => populateLastRequest('numberOfDocuments', numberOfDocuments));
    eventEmitter.addListener(events.setRankingModeInLastRequestOfHistory, rankingMode => populateLastRequest('rankingMode', rankingMode));
    eventEmitter.addListener(events.setCompressionLevelInLastRequestOfHistory, compressionLevel => populateLastRequest('compressionLevel', compressionLevel));
    eventEmitter.addListener(events.setArchiveTypeInLastRequestOfHistory, archiveType => populateLastRequest('archiveType', archiveType));
    eventEmitter.addListener(events.setSelectedFormatsInLastRequestOfHistory, selectedFormats => populateLastRequest('selectedFormats', selectedFormats));
  }, []);

  return (
    <div>
      <button onClick={updateFormFromLastRequestInLocalStorage}>
        Fetch
      </button>
    </div>
  );
}
