import React, { useEffect } from 'react';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';

export default function FetchButton () {
  const updateFormFromLastRequest = () => {
    const mostRecentRequest = historyManager.getLastRequest();

    if (!mostRecentRequest) {
      return;
    }

    if (mostRecentRequest.qId) {
      eventEmitter.emit(events.qIdChanged, mostRecentRequest.qId);
    } else {
      eventEmitter.emit(events.changeQueryString, mostRecentRequest.queryString);
    }

    eventEmitter.emit(events.changeQueryString, mostRecentRequest.queryString);
    eventEmitter.emit(events.formatsChanged, mostRecentRequest.selectedFormats);
    eventEmitter.emit(events.numberOfDocumentsChanged, mostRecentRequest.numberOfDocuments);
    eventEmitter.emit(events.rankingModeChanged, mostRecentRequest.rankingMode);
    eventEmitter.emit(events.compressionLevelChanged, mostRecentRequest.compressionLevel);
    eventEmitter.emit(events.archiveTypeChanged, mostRecentRequest.archiveType);
    eventEmitter.emit(events.usageChanged, mostRecentRequest.usage);
  };

  const populateLastRequest = (fieldName, fieldValue) => {
    historyManager.populateLastRequest(fieldName, fieldValue);
  };

  useEffect(() => {
    eventEmitter.addListener(events.setQueryStringInLastRequestOfHistory, queryString => populateLastRequest('queryString', queryString));
    eventEmitter.addListener(events.setNumberOfDocumentsInLastRequestOfHistory, numberOfDocuments => populateLastRequest('numberOfDocuments', numberOfDocuments));
    eventEmitter.addListener(events.setRankingModeInLastRequestOfHistory, rankingMode => populateLastRequest('rankingMode', rankingMode));
    eventEmitter.addListener(events.setCompressionLevelInLastRequestOfHistory, compressionLevel => populateLastRequest('compressionLevel', compressionLevel));
    eventEmitter.addListener(events.setArchiveTypeInLastRequestOfHistory, archiveType => populateLastRequest('archiveType', archiveType));
    eventEmitter.addListener(events.setSelectedFormatsInLastRequestOfHistory, selectedFormats => populateLastRequest('selectedFormats', selectedFormats));
    eventEmitter.addListener(events.setUsageInLastRequestOfHistory, usage => populateLastRequest('usage', usage));
  }, []);

  return (
    <div>
      <button onClick={updateFormFromLastRequest}>
        Fetch
      </button>
    </div>
  );
}
