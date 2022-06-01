import React from 'react';
import PropTypes from 'prop-types';
import './HistoryRequest.css';
import { buildExtractParamsFromFormats, buildFullApiUrl, sendDownloadApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';
import { buildFullIstexDlUrl } from '../../lib/utils';

export default function HistoryRequest ({ requestInfo }) {
  const editHandler = () => {
    if (requestInfo.qId) {
      eventEmitter.emit(events.qIdChanged, requestInfo.qId);
    } else {
      eventEmitter.emit(events.queryInputChanged, requestInfo.queryString);
    }

    eventEmitter.emit(events.formatsChanged, requestInfo.selectedFormats);
    eventEmitter.emit(events.numberOfDocumentsChanged, requestInfo.numberOfDocuments);
    eventEmitter.emit(events.rankingModeChanged, requestInfo.rankingMode);
    eventEmitter.emit(events.compressionLevelChanged, requestInfo.compressionLevel);
    eventEmitter.emit(events.archiveTypeChanged, requestInfo.archiveType);
    eventEmitter.emit(events.usageChanged, requestInfo.usage);

    eventEmitter.emit(events.modalCloseRequest);
  };

  const downloadHandler = () => {
    const url = buildFullApiUrl(requestInfo).toString();

    // This function is synchronous
    sendDownloadApiRequest(url);

    historyManager.add({
      ...requestInfo,
      date: Date.now(),
    });
  };

  const shareHandler = () => {
    const istexDlFullUrl = buildFullIstexDlUrl(requestInfo);

    navigator.clipboard.writeText(istexDlFullUrl.href)
      .then(() => window.alert(`${istexDlFullUrl.href} copied to clipboard!`))
      .catch(() => window.alert(`${istexDlFullUrl.href} failed to copy to clipboard!`));
  };

  const deleteHandler = () => {
    historyManager.remove(requestInfo.index);
  };

  return (
    <div className='history-request'>
      <div className='history-request-item index'>{requestInfo.index + 1}</div>
      <div className='history-request-item date'>{requestInfo.date}</div>
      <div className='history-request-item request'>{requestInfo.qId ? requestInfo.qId : requestInfo.queryString}</div>
      <div className='history-request-item formats'>{buildExtractParamsFromFormats(requestInfo.selectedFormats)}</div>
      <div className='history-request-item nb-docs'>{requestInfo.numberOfDocuments}</div>
      <div className='history-request-item rank'>{requestInfo.rankingMode}</div>
      <div className='history-request-item actions'>
        <button onClick={editHandler}>Edit</button>
        <button onClick={downloadHandler}>Download</button>
        <button onClick={shareHandler}>Share</button>
        <button onClick={deleteHandler}>Delete</button>
      </div>
    </div>
  );
}

HistoryRequest.propTypes = {
  requestInfo: PropTypes.object,
};
