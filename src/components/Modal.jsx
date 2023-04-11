import React, { useRef } from 'react';
import PropTypes from 'prop-types';

// Reference to onClose function passed to <Modal> to be used by other components such as <ModalFooter>
let onCloseFromProps;

export default function Modal ({ onClose, children }) {
  const modalContentRef = useRef(null);

  onCloseFromProps = onClose;

  const isClickOutsideOfModalContent = event => {
    if (!modalContentRef.current) {
      return false;
    }

    const { clientX: clickX, clientY: clickY } = event;
    const { x: modalX, y: modalY, width: modalWidth, height: modalHeight } = modalContentRef.current.getBoundingClientRect();

    return (
      clickX < modalX || // click is to the left of the content
      clickX > modalX + modalWidth || // click is to the right of the content
      clickY < modalY || // click is above the content
      clickY > modalY + modalHeight // click is below the content
    );
  };

  const onClick = event => {
    if (isClickOutsideOfModalContent(event)) {
      closeModal(event);
    }
  };

  // Prevent the scroll on the body to avoid having 2 scrollbars
  document.body.style.overflow = 'hidden';

  return (
    <>
      <div
        className='z-50 fixed inset-0 flex justify-center items-center w-full overflow-y-auto py-3'
        onClick={onClick}
      >
        <div ref={modalContentRef} className='bg-white rounded w-11/12 [&>*]:p-3 m-auto'>
          {children}
        </div>
      </div>
      <div className='bg-gray-900 bg-opacity-50 fixed inset-0 z-40' />
    </>
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
          className='cta-blue text-center'
          onClick={closeModal}
        >
          Fermer
        </button>
      )}
    </div>
  );
}

// Call the onClose prop and reset the body overflow to what it was before
function closeModal (event) {
  onCloseFromProps(event);
  document.body.style.overflow = 'unset';
}

Modal.propTypes = {
  onClose: PropTypes.func.isRequired,
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
