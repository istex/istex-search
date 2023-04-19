import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

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
    const setQueryStringInLastRequestOfHistory = queryString => history.populateLastRequest('queryString', queryString);
    const setNumberOfDocumentsInLastRequestOfHistory = numberOfDocuments => history.populateLastRequest('numberOfDocuments', numberOfDocuments);
    const setRankingModeInLastRequestOfHistory = rankingMode => history.populateLastRequest('rankingMode', rankingMode);
    const setCompressionLevelInLastRequestOfHistory = compressionLevel => history.populateLastRequest('compressionLevel', compressionLevel);
    const setArchiveTypeInLastRequestOfHistory = archiveType => history.populateLastRequest('archiveType', archiveType);
    const setSelectedFormatsInLastRequestOfHistory = selectedFormats => history.populateLastRequest('selectedFormats', selectedFormats);
    const setUsageInLastRequestOfHistory = usage => history.populateLastRequest('usage', usage);

    eventEmitter.addListener(events.setQueryStringInLastRequestOfHistory, setQueryStringInLastRequestOfHistory);
    eventEmitter.addListener(events.setNumberOfDocumentsInLastRequestOfHistory, setNumberOfDocumentsInLastRequestOfHistory);
    eventEmitter.addListener(events.setRankingModeInLastRequestOfHistory, setRankingModeInLastRequestOfHistory);
    eventEmitter.addListener(events.setCompressionLevelInLastRequestOfHistory, setCompressionLevelInLastRequestOfHistory);
    eventEmitter.addListener(events.setArchiveTypeInLastRequestOfHistory, setArchiveTypeInLastRequestOfHistory);
    eventEmitter.addListener(events.setSelectedFormatsInLastRequestOfHistory, setSelectedFormatsInLastRequestOfHistory);
    eventEmitter.addListener(events.setUsageInLastRequestOfHistory, setUsageInLastRequestOfHistory);

    return () => {
      eventEmitter.removeListener(events.setQueryStringInLastRequestOfHistory, setQueryStringInLastRequestOfHistory);
      eventEmitter.removeListener(events.setNumberOfDocumentsInLastRequestOfHistory, setNumberOfDocumentsInLastRequestOfHistory);
      eventEmitter.removeListener(events.setRankingModeInLastRequestOfHistory, setRankingModeInLastRequestOfHistory);
      eventEmitter.removeListener(events.setCompressionLevelInLastRequestOfHistory, setCompressionLevelInLastRequestOfHistory);
      eventEmitter.removeListener(events.setArchiveTypeInLastRequestOfHistory, setArchiveTypeInLastRequestOfHistory);
      eventEmitter.removeListener(events.setSelectedFormatsInLastRequestOfHistory, setSelectedFormatsInLastRequestOfHistory);
      eventEmitter.removeListener(events.setUsageInLastRequestOfHistory, setUsageInLastRequestOfHistory);
    };
  }, []);

  return (
    <Tooltip
      content={(
        <div className='max-w-[10.5rem]'>
          Récupérez l'état en cours de votre formulaire
        </div>
      )}
    >
      <button
        className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-2.5 h-[4.75rem] text-istcolor-black'
        onClick={updateFormFromLastRequest}
      >
        <div>
          <FontAwesomeIcon icon='repeat' className='text-3xl md:text-4xl' />
        </div>
        <span className='text-center align-top'>
          Récupérer
        </span>
      </button>
    </Tooltip>
  );
}
