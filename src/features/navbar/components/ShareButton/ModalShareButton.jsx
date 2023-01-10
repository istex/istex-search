import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';

export default function ModalShareButton ({ initOpening = false, urlToClipboard = '', setOpenModal, handleSaveToClipboard }) {
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
        <div className='istex-modal__header'>
          <Modal.Header>
            <span className='istex-modal__text'>
              Partager
            </span>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='space-y-6'>
            <div
              className='flex w-full'
            >
              <input
                type='text'
                className='p-2.5 px-3 z-20 flex-1 text-sm text-black bg-[#eee] border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-istcolor-grey-medium'
                placeholder={urlToClipboard}
                readOnly
              />
              <button
                type='button'
                className='p-2.5 text-sm font-medium text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
                onClick={handleSaveToClipboard}
              >
                Copier
              </button>
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
            >
              Annuler
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalShareButton.propTypes = {
  initOpening: PropTypes.bool,
  urlToClipboard: PropTypes.string,
  setOpenModal: PropTypes.func,
  handleSaveToClipboard: PropTypes.func,
};
