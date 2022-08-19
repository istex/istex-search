import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';

export default function FetchButton () {
  const updateFormFromLastRequest = () => {
    const mostRecentRequest = historyManager.getLastRequest();

    if (!mostRecentRequest) {
      return;
    }

    if (mostRecentRequest.qId) {
      eventEmitter.emit(events.setQId, mostRecentRequest.qId);
    } else {
      eventEmitter.emit(events.setQueryString, mostRecentRequest.queryString);
    }

    eventEmitter.emit(events.setQueryString, mostRecentRequest.queryString);
    eventEmitter.emit(events.setSelectedFormats, mostRecentRequest.selectedFormats);
    eventEmitter.emit(events.setNumberOfDocuments, mostRecentRequest.numberOfDocuments);
    eventEmitter.emit(events.setRankingMode, mostRecentRequest.rankingMode);
    eventEmitter.emit(events.setCompressionLevel, mostRecentRequest.compressionLevel);
    eventEmitter.emit(events.setArchiveType, mostRecentRequest.archiveType);
    eventEmitter.emit(events.setUsage, mostRecentRequest.usage);
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
    <div
      className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white'
      onClick={updateFormFromLastRequest}
    >
      <div className=''>
        <FontAwesomeIcon icon='repeat' size='3x' />
      </div>
      <button className='istex-footer__text pt-1'>
        Récupérer
      </button>
    </div>
  );
}
