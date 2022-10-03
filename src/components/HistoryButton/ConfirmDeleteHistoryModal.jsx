import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import PropTypes from 'prop-types';

export default function ConfirmDeleteHistoryModal ({ initOpening = false, setOpenModal, deleteAllHandler }) {
  const [open, setOpen] = useState(initOpening);

  const onClose = () => {
    setOpen(false);
    setOpenModal(false);
  };

  return (
    <>
      <Modal
        show={open}
        onClose={onClose}
        size='md'
      >
        <div className='istex-modal__header'>
          <Modal.Header className='istex-modal__header'>
            <span className='istex-modal__text'>
              Confirmation
            </span>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='flex items-center justify-between'>
            <p>
              Etes-vous sûr de vouloir supprimer<br />
              l'historique de vos téléchargements ?
            </p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='p-2 text-white bg-istcolor-grey-medium focus:ring-4 focus:outline-none'
            >
              Annuler
            </button>
            <button
              type='button'
              onClick={() => {
                deleteAllHandler();
                onClose();
              }}
              className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
            >
              Confirmer
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ConfirmDeleteHistoryModal.propTypes = {
  initOpening: PropTypes.bool,
  setOpenModal: PropTypes.func,
  deleteAllHandler: PropTypes.func,
};
