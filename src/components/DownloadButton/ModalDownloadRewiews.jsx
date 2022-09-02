import React, { useState } from 'react';
import { Modal } from 'flowbite-react';
import PropTypes from 'prop-types';

export default function ModalDownloadRewiews ({ initOpening = false, setOpenModal }) {
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
      >
        <Modal.Header>
          Téléchargement en cours
        </Modal.Header>
        <Modal.Body>
          <div className='flex flex-col justify-between items-center'>
            <p>
              La génération de votre corpus est en cours.<br />
              Veuillez patienter. L'archive sera bientôt téléchargée...
            </p>
            <p>
              <img src='/images/loader.gif' alt='loader' />
            </p>
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
    </>
  );
}

ModalDownloadRewiews.propTypes = {
  initOpening: PropTypes.bool,
  setOpenModal: PropTypes.func,
};
