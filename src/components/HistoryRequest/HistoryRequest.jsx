import React from 'react';
import PropTypes from 'prop-types';
import './HistoryRequest.css';
import { buildExtractParamsFromFormats, buildFullUrl, sendDownloadApiRequest } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import localStorage from '../../lib/localStorage';

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

    eventEmitter.emit(events.modalCloseRequest);
  };

  const downloadHandler = () => {
    const url = buildFullUrl(requestInfo).toString();

    sendDownloadApiRequest(url);
  };

  const shareHandler = () => {
    // The ISTEX-DL URL and ISTEX API have the same search parameters so we build the full ISTEX API URL
    // and copy its search parameters to the ISTEX-DL URL to get the URL to share
    const istexApiFullUrl = buildFullUrl(requestInfo);
    const istexDlFullUrl = new URL(window.location.href);
    istexDlFullUrl.search = istexApiFullUrl.search;

    navigator.clipboard.writeText(istexApiFullUrl.href)
      .then(() => window.alert(`${istexApiFullUrl.href} copied to clipboard!`))
      .catch(() => window.alert(`${istexApiFullUrl.href} failed to copy to clipboard!`));
  };

  const deleteHandler = () => {
    localStorage.remove(requestInfo.index);
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