import React, { useState } from 'react';
import PropTypes from 'prop-types';

import Modal from '@/components/Modal';

export default function ModalShareButton ({ initOpening = false, urlToClipboard = '', setOpenModal, handleSaveToClipboard }) {
  const [open, setOpen] = useState(initOpening);

  const onClose = () => {
    setOpen(false);
    setOpenModal(false);
  };

  return open && (
    <Modal onClose={onClose}>
      <Modal.Header>
        Partager
      </Modal.Header>
      <Modal.Body>
        <div
          className='flex w-full'
        >
          <input
            type='text'
            className='min-w-[24rem] p-2.5 px-3 text-sm text-black bg-[#eee] border-l-gray-100 border-l-2 border border-gray-300 focus:ring-blue-500 focus:border-istcolor-grey-medium'
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
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

ModalShareButton.propTypes = {
  initOpening: PropTypes.bool,
  urlToClipboard: PropTypes.string,
  setOpenModal: PropTypes.func,
  handleSaveToClipboard: PropTypes.func,
};
