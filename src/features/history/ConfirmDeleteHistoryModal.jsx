import React from 'react';
import PropTypes from 'prop-types';

import Modal from '@/components/Modal';

export default function ConfirmDeleteHistoryModal ({ onClose }) {
  return (
    <Modal onClose={onClose}>
      <Modal.Header>
        Confirmation
      </Modal.Header>
      <Modal.Body>
        Êtes-vous sûr de vouloir supprimer l'historique de vos téléchargements ?
      </Modal.Body>
      <Modal.Footer>
        <div className='flex gap-2'>
          <button
            className='cta-red'
            onClick={onClose}
          >
            Annuler
          </button>
          <button
            className='cta-blue'
            onClick={onClose}
          >
            Confirmer
          </button>
        </div>
      </Modal.Footer>
    </Modal>
  );
}

ConfirmDeleteHistoryModal.propTypes = {
  onClose: PropTypes.func.isRequired,
};
