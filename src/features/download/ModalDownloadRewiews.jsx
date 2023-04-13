import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@/components/Modal';

export default function ModalDownloadRewiews ({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <Modal.Header>Téléchargement en cours</Modal.Header>
      <Modal.Body>
        <p className='p-3'>
          La génération de votre corpus est en cours.<br />
          Veuillez patienter. L'archive sera bientôt téléchargée...
        </p>
        <div>
          <img className='m-auto' src='/images/loader.gif' alt='loader' />
        </div>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

ModalDownloadRewiews.propTypes = {
  onClose: PropTypes.func.isRequired,
};
