import React from 'react';
import PropTypes from 'prop-types';

import CatalogListItem from './CatalogListItem';
import Modal from '@/components/Modal';

import { catalogList } from '@/config';

export default function CatalogList ({ togglePreference, onClose }) {
  return (
    <Modal onClose={onClose}>
      <Modal.Header>Champs Istex</Modal.Header>
      <Modal.Body>
        <ul>
          {catalogList.map((catalog, index) => (
            <CatalogListItem
              key={index}
              catalog={catalog}
              togglePreference={togglePreference}
            />
          ))}
        </ul>
      </Modal.Body>
      <Modal.Footer />
    </Modal>
  );
}

CatalogList.propTypes = {
  togglePreference: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};
