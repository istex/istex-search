import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'flowbite-react';

import {
  buildExtractParamsFromFormats,
  getQueryStringFromQId,
  isArkQueryString,
  getArksFromArkQueryString,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import historyManager from '../../lib/HistoryManager';
import { buildFullIstexDlUrl } from '../../lib/utils';

import './HistoryRequest.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
export default function HistoryRequest ({ requestInfo, onClose }) {
  const [requestStringToDisplay, setRequestStringToDisplay] = useState('');

  const editHandler = () => {
    if (requestInfo.qId) {
      eventEmitter.emit(events.setQId, requestInfo.qId);
    } else {
      eventEmitter.emit(events.setQueryString, requestInfo.queryString);
    }

    eventEmitter.emit(events.setSelectedFormats, requestInfo.selectedFormats);
    eventEmitter.emit(events.setNumberOfDocuments, requestInfo.numberOfDocuments);
    eventEmitter.emit(events.setRankingMode, requestInfo.rankingMode);
    eventEmitter.emit(events.setCompressionLevel, requestInfo.compressionLevel);
    eventEmitter.emit(events.setArchiveType, requestInfo.archiveType);
    eventEmitter.emit(events.setUsage, requestInfo.usage);
    eventEmitter.emit(events.addFocusOnInput, true);

    onClose();
  };

  const downloadHandler = () => {
    eventEmitter.emit(events.displayDownloadModal, true);
    onClose();
  };

  const shareHandler = () => {
    const istexDlFullUrl = buildFullIstexDlUrl(requestInfo);

    eventEmitter.emit(events.displayShareModal, istexDlFullUrl.href);

    onClose();
  };

  const deleteHandler = () => {
    historyManager.remove(requestInfo.index);
  };

  const getRequestStringToDisplay = async () => {
    let requestStringToDisplay;

    if (requestInfo.qId) {
      try {
        const response = await getQueryStringFromQId(requestInfo.qId);

        requestStringToDisplay = response.data.req;
      } catch (err) {
        // TODO: print an error message in a modal or delete the request from the history maybe
        console.error(err);

        requestStringToDisplay = requestInfo.qId;
      }
    }

    if (requestInfo.queryString) {
      requestStringToDisplay = requestInfo.queryString;
    }

    if (isArkQueryString(requestStringToDisplay)) {
      requestStringToDisplay = getArksFromArkQueryString(requestStringToDisplay).join('\n');
    }

    return requestStringToDisplay;
  };

  useEffect(async () => {
    setRequestStringToDisplay(await getRequestStringToDisplay());
  }, []);

  return (
    <Table.Row className='bg-white dark:border-gray-700 dark:bg-gray-800'>
      <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
        <span className='font-bold'>{requestInfo.index + 1}</span>
      </Table.Cell>
      <Table.Cell>
        {requestInfo.date}
      </Table.Cell>
      <Table.Cell>
        {requestStringToDisplay}
      </Table.Cell>
      <Table.Cell>
        {buildExtractParamsFromFormats(requestInfo.selectedFormats)}
      </Table.Cell>
      <Table.Cell>
        {requestInfo.numberOfDocuments}
      </Table.Cell>
      <Table.Cell>
        {requestInfo.rankingMode}
      </Table.Cell>
      <Table.Cell>
        <button
          type='button'
          onClick={editHandler}
          className='inline-block pl-2'
        >
          <FontAwesomeIcon icon='pen-to-square' size='2x' />
        </button>
        <button
          type='button'
          onClick={downloadHandler}
          className='inline-block pl-2'
        >
          <FontAwesomeIcon icon='download' size='2x' />
        </button>
        <button
          type='button'
          onClick={shareHandler}
          className='inline-block pl-2'
        >
          <FontAwesomeIcon icon='link' size='2x' />
        </button>
        <button
          type='button'
          onClick={deleteHandler}
          className='inline-block pl-2'
        >
          <FontAwesomeIcon icon='xmark' size='2x' />
        </button>
      </Table.Cell>
    </Table.Row>
  );
}

HistoryRequest.propTypes = {
  requestInfo: PropTypes.object,
  onClose: PropTypes.func,
};
