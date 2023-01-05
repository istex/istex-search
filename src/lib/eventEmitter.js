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

export default new EventEmitter();
