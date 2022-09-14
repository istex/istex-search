import React, { useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';

export default function FetchButton ({ className, sizeIcon, fontSizeText }) {
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
      className={className}
      onClick={updateFormFromLastRequest}
    >
      <div>
        <FontAwesomeIcon icon='repeat' className={sizeIcon} />
      </div>
      <span className={fontSizeText}>
        Récupérer
      </span>
    </div>
  );
}

FetchButton.propTypes = {
  className: PropTypes.string,
  sizeIcon: PropTypes.string,
  fontSizeText: PropTypes.string,
};
