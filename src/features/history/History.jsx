import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { Table } from 'flowbite-react';

import HistoryRequest from './HistoryRequest';
import ConfirmDeleteHistoryModal from './ConfirmDeleteHistoryModal';
import Modal from '@/components/Modal';

import { useHistoryContext } from '@/contexts/HistoryContext';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function History ({ onClose }) {
  const [confirmDeleteModalOpen, setConfirmDeleteModalOpen] = useState(false);
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
        <div className='flex flex-col gap-3'>
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
          <button
            className='cta-red max-w-max'
            disabled={history.isEmpty()}
            onClick={() => setConfirmDeleteModalOpen(true)}
          >
            Supprimer l'historique
          </button>
        </div>
        {confirmDeleteModalOpen && (
          <ConfirmDeleteHistoryModal onClose={() => setConfirmDeleteModalOpen(false)} />
        )}
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

History.propTypes = {
  onClose: PropTypes.func.isRequired,
};
