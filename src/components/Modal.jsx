import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

import useKeyDown from '@/hooks/useKeyDown';

// Reference to onClose function passed to <Modal> to be used by other components such as <ModalFooter>
let closeModal;

export default function Modal ({ onClose, nested = false, children }) {
  closeModal = onClose;

  useKeyDown('Escape', () => {
    closeModal();
  });

  useEffect(() => {
    // Prevent the scroll on the body to avoid having 2 scrollbars
    document.body.style.overflow = 'hidden';

    return () => {
      // Reset the body overflow to what it was before only if the current modal is not
      // nested inside of another modal
      if (!nested) {
        document.body.style.overflow = 'unset';
      }
    };
  }, []);

  return (
    <div className='z-40 fixed inset-0 flex justify-center items-center w-full overflow-y-auto px-6 py-3'>
      <div className='z-50 bg-white rounded [&>*]:p-3 m-auto'>
        {children}
      </div>
      <div
        className='bg-gray-900 bg-opacity-50 fixed inset-0 z-40'
        onClick={closeModal}
      />
    </div>
  );
}

function ModalHeader ({ children }) {
  return (
    <div className='rounded-t bg-istcolor-blue text-white font-bold text-xl'>
      {children}
    </div>
  );
}

function ModalBody ({ children }) {
  return (
    <div>
      {children}
    </div>
  );
}

function ModalFooter ({ children }) {
  return (
    <div className='flex flex-col items-end rounded-b border-t border-solid border-slate-300'>
      {/* If children are provided, display them, otherwise display a default close button */}
      {children || (
        <button
          className='cta-blue'
          onClick={closeModal}
        >
          Fermer
        </button>
      )}
    </div>
  );
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
  nested: PropTypes.bool,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

ModalHeader.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

ModalBody.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
};

ModalFooter.propTypes = {
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]),
};

Object.assign(Modal, { Header: ModalHeader, Body: ModalBody, Footer: ModalFooter });
