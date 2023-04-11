import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Table, Tooltip } from 'flowbite-react';
import { format } from 'date-fns';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { getIdsFromIdQueryString, getIdTypeInfoFromQueryString } from '@/lib/query';
import { buildExtractParamsFromFormats } from '@/lib/formats';
import { getQueryStringFromQId, sendDownloadApiRequest, buildFullApiUrl } from '@/lib/istexApi';
import { buildFullIstexDlUrl } from '@/lib/utils';
import useResetForm from '@/features/resetForm/useResetForm';
import { istexApiConfig } from '@/config';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import { useHistoryContext } from '@/contexts/HistoryContext';

export default function HistoryRequest ({ requestInfo, onClose }) {
  const [queryString, setQueryString] = useState('');
  const [idTypeInfo, setIdTypeInfo] = useState(null);
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const closeHistoryModal = () => {
    onClose();
    document.body.style.overflow = 'unset';
  };

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

    closeHistoryModal();
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
    closeHistoryModal();
  };

  const shareHandler = () => {
    const istexDlFullUrl = buildFullIstexDlUrl(requestInfo);

    eventEmitter.emit(events.displayShareModal, istexDlFullUrl.href);

    closeHistoryModal();
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

  useEffect(() => {
    const getQueryStringToUse = async () => {
      const queryStringToUse = await getQueryString();
      setQueryString(queryStringToUse);

      return queryStringToUse;
    };

    getQueryStringToUse().then(queryStringToUse => {
      setIdTypeInfo(getIdTypeInfoFromQueryString(queryStringToUse));
    });
  }, []);

  return (
    <Table.Row className='bg-white'>
      <Table.Cell className='!px-3 text-center whitespace-nowrap font-medium text-gray-900 dark:text-white'>
        <span className='font-bold'>{requestInfo.index + 1}</span>
      </Table.Cell>
      <Table.Cell className='!px-3'>
        {format(requestInfo.date, 'dd/MM/yyyy hh:mm:ss')}
      </Table.Cell>
      <Table.Cell className='!px-3'>
        <div
          className={`line-clamp-${idTypeInfo != null ? '3' : '2'}`}
        >
          {idTypeInfo != null ? getIdsFromIdQueryString(idTypeInfo, queryString).slice(0, 4).map(id => <div key={id}>{id}<br /></div>) : queryString}
        </div>
      </Table.Cell>
      <Table.Cell className='!px-3'>
        <div className='flex flex-col'>
          {buildExtractParamsFromFormats(requestInfo.selectedFormats).split(';').map((selectedFormat, index) => (
            <span key={index}>{selectedFormat}</span>
          ))}
        </div>
      </Table.Cell>
      <Table.Cell className='!px-3 text-center'>
        {requestInfo.numberOfDocuments}
      </Table.Cell>
      <Table.Cell className='!px-3'>
        {istexApiConfig.rankingModes.modes.find(mode => mode.value === requestInfo.rankingMode).label}
      </Table.Cell>
      <Table.Cell className='!px-3'>
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
