import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal, Table } from 'flowbite-react';

import HistoryRequest from './HistoryRequest';
import ConfirmDeleteHistoryModal from './ConfirmDeleteHistoryModal';

import { useHistoryContext } from '@/contexts/HistoryContext';

export default function ModalListHistory ({ show, onClose: setOpenModal, requests }) {
  const [openConfirmMofal, setOpenConfirmMofal] = useState(false);
  const history = useHistoryContext();

  if (!show) {
    return null;
  }
  const onClose = () => {
    setOpenModal();
  };

  const deleteAllHandler = () => {
    history.removeAll();
  };

  const handleMarginTopModal = (numberOfrequest) => {
    if (numberOfrequest > 4) {
      return 'mt-96';
    }

    if (numberOfrequest > 0 && numberOfrequest <= 4) {
      return 'mt-48';
    }

    return 'mt-0';
  };

  return (
    <>
      <Modal
        show={show}
        onClose={onClose}
        size='7xl'
      >
        <div className={`istex-modal__header ${handleMarginTopModal(requests?.length)}`}>
          <Modal.Header className='istex-modal__header'>
            <span className='istex-modal__text'>
              Historique des requêtes
            </span>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className={`${requests?.length > 4 ? 'h-full' : ''} overflow-auto`}>
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
          </div>
          <div className='flex pt-6 md:pt-4'>
            <button
              type='button'
              onClick={() => { setOpenConfirmMofal(true); }}
              disabled={history.isEmpty()}
              className={`p-2 text-white bg-[#d9534f] border border-[#d43f3a] ${history.isEmpty() ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-[#c9302c] hover:border-[#ac2925]'} focus:ring-4 focus:outline-none`}
            >
              Supprimer l'historique
            </button>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
            >
              Fermer
            </button>
          </div>
        </Modal.Footer>
      </Modal>
      {openConfirmMofal && (
        <ConfirmDeleteHistoryModal
          initOpening={openConfirmMofal}
          setOpenModal={setOpenConfirmMofal}
          deleteAllHandler={deleteAllHandler}
        />
      )}
    </>
  );
}

ModalListHistory.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  requests: PropTypes.array,
};
