import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'flowbite-react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
  buildExtractParamsFromFormats,
  getQueryStringFromQId,
  isArkQueryString,
  getArksFromArkQueryString,
  sendDownloadApiRequest,
  buildFullApiUrl,
  isIstexIdQueryString,
  getIstexIdsFromIstexIdQueryString,
} from '@/lib/istexApi';
import { buildFullIstexDlUrl } from '@/lib/utils';
import useResetForm from '@/features/resetForm/hooks/useResetForm';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import { useHistoryContext } from '@/contexts/HistoryContext';

import './HistoryRequest.scss';

export default function HistoryRequest ({ requestInfo, onClose }) {
  const [queryString, setQueryString] = useState('');
  const [_isArkQueryString, setIsArkQueryString] = useState(false);
  const [_isIstexIdQueryString, setIsIstexIdQueryString] = useState(false);
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const editHandler = () => {
    if (requestInfo.qId) {
      eventEmitter.emit(events.setQId, requestInfo.qId);
    }

    eventEmitter.emit(events.setQueryString, queryString);
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
    eventEmitter.emit(events.displayDownloadModal);

    const url = buildFullApiUrl(requestInfo).toString();

    // This function is synchronous
    sendDownloadApiRequest(url);

    history.add({
      ...requestInfo,
      date: Date.now(),
    });

    resetForm();
    onClose();
  };

  const shareHandler = () => {
    const istexDlFullUrl = buildFullIstexDlUrl(requestInfo);

    eventEmitter.emit(events.displayShareModal, istexDlFullUrl.href);

    onClose();
  };

  const deleteHandler = () => {
    history.remove(requestInfo.index);
  };

  // If requestInfo contains a q_id, we need to fetch the corresponding query string, otherwise just return
  // requestInfo.queryString
  const getQueryString = async () => {
    if (requestInfo.qId) {
      try {
        const response = await getQueryStringFromQId(requestInfo.qId);

        return response.data.req;
      } catch (err) {
        // TODO: print an error message in a modal or delete the request from the history maybe
        console.error(err);

        return requestInfo.qId;
      }
    }

    return requestInfo.queryString;
  };

  useEffect(async () => {
    const queryStringToUse = await getQueryString();
    setQueryString(queryStringToUse);

    setIsArkQueryString(isArkQueryString(queryStringToUse));
    setIsIstexIdQueryString(isIstexIdQueryString(queryStringToUse));
  }, []);

  return (
    <Table.Row className='bg-white'>
      <Table.Cell className='whitespace-nowrap font-medium text-gray-900 dark:text-white'>
        <span className='font-bold'>{requestInfo.index + 1}</span>
      </Table.Cell>
      <Table.Cell>
        {format(requestInfo.date, 'dd/MM/yyyy hh:mm:ss')}
      </Table.Cell>
      <Table.Cell>
        <div
          className={`history-tab-request ${_isArkQueryString || _isIstexIdQueryString ? 'history-tab-request__ark' : 'history-tab-request__query-string'}`}
        >
          {(() => {
            if (_isArkQueryString) return getArksFromArkQueryString(queryString).map(ark => <div key={ark}>{ark}<br /></div>);
            if (_isIstexIdQueryString) return getIstexIdsFromIstexIdQueryString(queryString).map(id => <div key={id}>{id}<br /></div>);
            return queryString;
          })()}
        </div>
      </Table.Cell>
      <Table.Cell>
        <div className='flex flex-col'>
          {buildExtractParamsFromFormats(requestInfo.selectedFormats).split(';').map((selectedFormat, index) => (
            <span key={index}>{selectedFormat}</span>
          ))}
        </div>
      </Table.Cell>
      <Table.Cell>
        {requestInfo.numberOfDocuments}
      </Table.Cell>
      <Table.Cell>
        {requestInfo.rankingMode}
      </Table.Cell>
      <Table.Cell>
        <div className='flex'>
          <Tooltip
            content='Editer cette requête'
          >
            <button
              type='button'
              onClick={editHandler}
              className='inline-block pl-2'
            >
              <FontAwesomeIcon icon='pen-to-square' className='md:text-xl' />
            </button>
          </Tooltip>
          <Tooltip
            content='Télécharger cette requête'
          >
            <button
              type='button'
              onClick={downloadHandler}
              className='inline-block pl-2'
            >
              <FontAwesomeIcon icon='download' className='md:text-xl' />
            </button>
          </Tooltip>
          <Tooltip
            content='Partager cette requête'
          >
            <button
              type='button'
              onClick={shareHandler}
              className='inline-block pl-2'
            >
              <FontAwesomeIcon icon='link' className='md:text-xl' />
            </button>
          </Tooltip>
          <Tooltip
            content='Supprimer cette requête'
          >
            <button
              type='button'
              onClick={deleteHandler}
              className='inline-block pl-2'
            >
              <FontAwesomeIcon icon='xmark' className='md:text-xl' />
            </button>
          </Tooltip>
        </div>
      </Table.Cell>
    </Table.Row>
  );
}

HistoryRequest.propTypes = {
  requestInfo: PropTypes.object,
  onClose: PropTypes.func,
};
