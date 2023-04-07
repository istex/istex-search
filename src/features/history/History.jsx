import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'flowbite-react';

import HistoryRequest from './HistoryRequest';
import Modal from '@/components/Modal';

import { useHistoryContext } from '@/contexts/HistoryContext';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function History ({ onClose }) {
  const { eventEmitter, events } = useEventEmitterContext();
  const history = useHistoryContext();

  const [requests, setRequests] = useState(history.getAll());

  const historyUpdatedHandler = () => {
    setRequests([...history.getAll()]);
  };

  useEffect(() => {
    eventEmitter.addListener(events.historyUpdated, historyUpdatedHandler);

    return () => {
      eventEmitter.removeListener(events.historyUpdated, historyUpdatedHandler);
    };
  }, []);

  return (
    <Modal onClose={onClose}>
      <Modal.Header>Historique des requêtes</Modal.Header>
      <Modal.Body>
        <Table hoverable>
          <Table.Head>
            <Table.HeadCell>
              #
            </Table.HeadCell>
            <Table.HeadCell>
              Date
            </Table.HeadCell>
            <Table.HeadCell>
              Requête
            </Table.HeadCell>
            <Table.HeadCell>
              Formats
            </Table.HeadCell>
            <Table.HeadCell>
              Nb. docs
            </Table.HeadCell>
            <Table.HeadCell>
              Tri
            </Table.HeadCell>
            <Table.HeadCell>
              Actions
            </Table.HeadCell>
          </Table.Head>
          <Table.Body className='divide-y text-2xl md:text-sm'>
            {requests.map((request, index) => (
              <HistoryRequest
                key={request.date}
                requestInfo={{ ...request, index }}
                onClose={onClose}
              />
            ))}
          </Table.Body>
        </Table>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

History.propTypes = {
  onClose: PropTypes.func.isRequired,
};
