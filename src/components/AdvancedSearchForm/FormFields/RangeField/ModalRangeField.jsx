import React, { useRef } from 'react';
import { Label, Modal, TextInput } from 'flowbite-react';
import PropTypes from 'prop-types';

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
}) {
  const updateValRef = useRef(null);

  return (
    <Modal
      show={openModal}
      onClose={onCloseModal}
    >
      <Modal.Header>
        Choix de l'intervalle
      </Modal.Header>
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
        <div className='flex w-full justify-end'>
          <button
            type='button'
            onClick={onCloseModal}
            className='p-2 text-white bg-istcolor-grey-medium focus:ring-4 focus:outline-none'
          >
            Fermer
          </button>
          <button
            type='button'
            onClick={() => { updateIntervalValue(updateValRef.current.value); }}
            className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
          >
            Modifier la valeur
          </button>
        </div>
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
  min: PropTypes.number,
  max: PropTypes.number,
};

export default ModalRangeField;
