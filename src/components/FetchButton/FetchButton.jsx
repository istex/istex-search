import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import { useHistoryContext } from '@/contexts/HistoryContext';

export default function FetchButton () {
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const updateFormFromLastRequest = () => {
    const mostRecentRequest = history.getLastRequest();

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

  useEffect(() => {
    eventEmitter.addListener(events.setQueryStringInLastRequestOfHistory, queryString => history.populateLastRequest('queryString', queryString));
    eventEmitter.addListener(events.setNumberOfDocumentsInLastRequestOfHistory, numberOfDocuments => history.populateLastRequest('numberOfDocuments', numberOfDocuments));
    eventEmitter.addListener(events.setRankingModeInLastRequestOfHistory, rankingMode => history.populateLastRequest('rankingMode', rankingMode));
    eventEmitter.addListener(events.setCompressionLevelInLastRequestOfHistory, compressionLevel => history.populateLastRequest('compressionLevel', compressionLevel));
    eventEmitter.addListener(events.setArchiveTypeInLastRequestOfHistory, archiveType => history.populateLastRequest('archiveType', archiveType));
    eventEmitter.addListener(events.setSelectedFormatsInLastRequestOfHistory, selectedFormats => history.populateLastRequest('selectedFormats', selectedFormats));
    eventEmitter.addListener(events.setUsageInLastRequestOfHistory, usage => history.populateLastRequest('usage', usage));
  }, []);

  return (
    <div
      className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-1.5 text-istcolor-black'
      onClick={updateFormFromLastRequest}
    >
      <div>
        <FontAwesomeIcon icon='repeat' className='text-3xl md:text-4xl' />
      </div>
      <span className='text-center align-top'>
        Récupérer
      </span>
    </div>
  );
}
