import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Table } from 'flowbite-react';

import HistoryRequest from '../HistoryRequest/HistoryRequest';
import HistoryManager from '../../lib/HistoryManager';
import ConfirmDeleteHistoryModal from './ConfirmDeleteHistoryModal';

export default function ModalListHistory ({ show, onClose, requests }) {
  const [openConfirmMofal, setOpenConfirmMofal] = useState(false);

  if (!show) {
    return null;
  }

  const deleteAllHandler = () => {
    HistoryManager.removeAll();
  };

  return (
    <div className='modal text-istcolor-black'>
      <div className='modal-content' onClick={e => e.stopPropagation()}>
        <div className='flex justify-between items-center border-b-2 p-[15px]'>
          <h2 className='text-[18px]'>Historique des requêtes</h2>
          <button onClick={onClose} className='close'>&times;</button>
        </div>
        <div className='p-[15px]'>
          <Table>
            <Table.Head>
              <Table.HeadCell>
                #
              </Table.HeadCell>
              <Table.HeadCell>
                Date
              </Table.HeadCell>
              <Table.HeadCell>
                Request
              </Table.HeadCell>
              <Table.HeadCell>
                Formats
              </Table.HeadCell>
              <Table.HeadCell>
                Nb. docs
              </Table.HeadCell>
              <Table.HeadCell>
                Rank mode
              </Table.HeadCell>
              <Table.HeadCell>
                Actions
              </Table.HeadCell>
            </Table.Head>
            <Table.Body className='divide-y'>
              {requests.map((request, index) => (
                <HistoryRequest
                  key={request.date}
                  requestInfo={{ ...request, index }}
                  onClose={onClose}
                />
              ))}
            </Table.Body>
          </Table>
          <div className='flex pt-4'>
            <button
              type='button'
              onClick={() => { setOpenConfirmMofal(true); }}
              disabled={HistoryManager.isEmpty()}
              className={`p-2 text-white bg-[#d9534f] border border-[#d43f3a] ${HistoryManager.isEmpty() ? 'cursor-not-allowed opacity-75' : 'cursor-pointer hover:bg-[#c9302c] hover:border-[#ac2925]'} focus:ring-4 focus:outline-none`}
            >
              Supprimer l'historique
            </button>
          </div>
        </div>
        <div className='flex justify-end items-center border-t-2 p-[15px]'>
          <button
            type='button'
            onClick={onClose}
            className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
          >
            Fermer
          </button>
        </div>
      </div>
      {openConfirmMofal && (
        <ConfirmDeleteHistoryModal
          initOpening={openConfirmMofal}
          setOpenModal={setOpenConfirmMofal}
          deleteAllHandler={deleteAllHandler}
        />
      )}
    </div>
  );
}

ModalListHistory.propTypes = {
  show: PropTypes.bool,
  onClose: PropTypes.func,
  requests: PropTypes.array,
};
