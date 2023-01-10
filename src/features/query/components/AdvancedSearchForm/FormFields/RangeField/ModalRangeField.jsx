import React from 'react';
import PropTypes from 'prop-types';
import { Label, Modal, TextInput, Button } from 'flowbite-react';

function ModalRangeField ({
  openModal,
  onCloseModal,
  updateIntervalValue,
  modalIntervalUpdateType,
  modalIntervalUpdateValue,
  minValRef,
  maxValRef,
  min,
  max,
  updateValRef,
}) {
  return (
    <Modal
      show={openModal}
      onClose={onCloseModal}
    >
      <div className='istex-modal__header'>
        <Modal.Header>
          <span className='istex-modal__text'>
            Choix de l'intervalle
          </span>
        </Modal.Header>
      </div>
      <Modal.Body>
        <div>
          <div className='mb-2 block'>
            <Label
              htmlFor='value1'
              value={`Choisissez la valeur ${modalIntervalUpdateType === 'min' ? 'minimale' : 'maximale'}`}
            />
          </div>
          <TextInput
            id='value1'
            type='number'
            min={modalIntervalUpdateType === 'max' ? minValRef.current.value : min}
            max={modalIntervalUpdateType === 'min' ? maxValRef.current.value : max}
            placeholder='name@flowbite.com'
            required
            ref={updateValRef}
            defaultValue={modalIntervalUpdateValue}
          />
        </div>
      </Modal.Body>
      <Modal.Footer>
        <Button style={{ backgroundColor: '#458ca5' }} onClick={() => { updateIntervalValue(updateValRef.current.value); }}>
          Modifier la valeur
        </Button>
        <Button
          color='gray'
          onClick={onCloseModal}
        >
          Fermer
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

ModalRangeField.propTypes = {
  openModal: PropTypes.bool,
  onCloseModal: PropTypes.func,
  updateIntervalValue: PropTypes.func,
  modalIntervalUpdateType: PropTypes.string,
  modalIntervalUpdateValue: PropTypes.number,
  minValRef: PropTypes.any,
  maxValRef: PropTypes.any,
  updateValRef: PropTypes.any,
  min: PropTypes.number,
  max: PropTypes.number,
};

export default ModalRangeField;
