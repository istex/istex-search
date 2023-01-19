import React, { useContext, createContext } from 'react';
import PropTypes from 'prop-types';
import { EventEmitter } from 'eventemitter3';

export const events = {
  setQueryString: 'setQueryString',
  setQId: 'setQId',
  setQueryMode: 'setQueryMode',
  setNumberOfDocuments: 'setNumberOfDocuments',
  setRankingMode: 'setRankingMode',
  setSelectedFormats: 'setSelectedFormats',
  setCompressionLevel: 'setCompressionLevel',
  setArchiveType: 'setArchiveType',
  setUsage: 'setUsage',
  setQueryStringUrlParam: 'setQueryStringUrlParam',
  setQIdUrlParam: 'setQIdUrlParam',
  setNumberOfDocumentsUrlParam: 'setNumberOfDocumentsUrlParam',
  setRankingModeUrlParam: 'setRankingModeUrlParam',
  setExtractUrlParam: 'setExtractUrlParam',
  setCompressionLevelUrlParam: 'setCompressionLevelUrlParam',
  setArchiveTypeUrlParam: 'setArchiveTypeUrlParam',
  setUsageUrlParam: 'setUsageUrlParam',
  resetUrlParams: 'resetUrlParams',
  setQueryStringInLastRequestOfHistory: 'setQueryStringInLastRequestOfHistory',
  setNumberOfDocumentsInLastRequestOfHistory: 'setNumberOfDocumentsInLastRequestOfHistory',
  setRankingModeInLastRequestOfHistory: 'setRankingModeInLastRequestOfHistory',
  setSelectedFormatsInLastRequestOfHistory: 'setSelectedFormatsInLastRequestOfHistory',
  setCompressionLevelInLastRequestOfHistory: 'setCompressionLevelInLastRequestOfHistory',
  setArchiveTypeInLastRequestOfHistory: 'setArchiveTypeInLastRequestOfHistory',
  setUsageInLastRequestOfHistory: 'setUsageInLastRequestOfHistory',
  historyUpdated: 'historyUpdated',
  closeHistoryModal: 'closeHistoryModal',
  resultPreviewResponseReceived: 'resultPreviewResponseReceived',
  resetResultPreview: 'resetResultPreview',
  displayNotification: 'displayNotification',
  addFocusOnInput: 'addFocusOnInput',
  displayShareModal: 'displayShareModal',
  displayDownloadModal: 'displayDownloadModal',
  resetMessageImportCorpus: 'resetMessageImportCorpus',
  setQueryAdvancedSearch: 'setQueryAdvancedSearch',
};

export const EventEmitterContext = createContext();

const eventEmitter = new EventEmitter();

export default function EventEmitterProvider ({ children }) {
  const contextValue = {
    events,
    eventEmitter,
  };

  return (
    <EventEmitterContext.Provider value={contextValue}>
      {children}
    </EventEmitterContext.Provider>
  );
}

export function useEventEmitterContext () {
  const context = useContext(EventEmitterContext);

  if (!context) {
    throw new Error('useEventEmitterContext must be within a EventEmitterProvider');
  }

  return context;
}

EventEmitterProvider.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};
