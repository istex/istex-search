import React, { useState, useRef, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Modal, Button, TextInput, Label, Tooltip } from 'flowbite-react';
import ModalRangeField from './ModalRangeField';
import './RangeField.scss';

function RangeField ({
  step,
  min,
  max,
  onChange,
  onCloseChoiceInputModal,
  intervalInputData,
  updateQuery,
}) {
  const [minValue, setMinValue] = useState(min);
  const [maxValue, setMaxValue] = useState(max);
  const [openModal, setOpenModal] = useState(false);
  const [modalIntervalUpdateType, setModalIntervalUpdateType] = useState('min');
  const [modalIntervalUpdateValue, setModalIntervalUpdateValue] = useState(null);
  const minValRef = useRef(0);
  const maxValRef = useRef(0);
  const updateValRef = useRef(null);

  const onCloseModal = () => {
    setOpenModal(false);
  };

  useEffect(() => {
    // Close modal and change valeur of interval with press Enter
    const keyDownHandler = event => {
      if (event.key === 'Enter' && openModal === true) {
        event.preventDefault();
        updateIntervalValue(updateValRef.current.value);
      }
    };
    document.addEventListener('keydown', keyDownHandler);
    return () => {
      document.removeEventListener('keydown', keyDownHandler);
    };
  }, []);

  const updateIntervalValue = (value) => {
    if (modalIntervalUpdateType === 'min' && value <= maxValRef.current.value) {
      value = parseFloat(value);
      // the new min value is the value from the event.
      // it should not exceed the current max value!
      if (min <= value) {
        setMinValue(value);
        minValRef.current.value = value;
      } else {
        setMinValue(min);
        minValRef.current.value = min;
      }
    } else if (modalIntervalUpdateType === 'max' && value >= minValRef.current.value) {
      value = parseFloat(value);
      // the new min value is the value from the event.
      // it should not exceed the current min value!
      if (max >= value) {
        setMaxValue(value);
        maxValRef.current.value = value;
      } else {
        setMaxValue(max);
        maxValRef.current.value = max;
      }
    }
    onCloseModal();
  };

  const changeValue = (value) => {
    if (value === 'min') {
      setModalIntervalUpdateValue(minValue);
      updateValRef.current.value = minValue;
    } else {
      setModalIntervalUpdateValue(maxValue);
      updateValRef.current.value = maxValue;
    }
    setOpenModal(true);
    setModalIntervalUpdateType(value);
  };

  const handleMinChange = event => {
    event.preventDefault();
    const value = parseFloat(event.target.value);
    // the new min value is the value from the event.
    // it should not exceed the current max value!
    const newMinVal = Math.min(value, maxValue - step);
    setMinValue(newMinVal);
  };

  const handleMaxChange = event => {
    event.preventDefault();
    const value = parseFloat(event.target.value);
    // the new max value is the value from the event.
    // it must not be less than the current min value!
    const newMaxVal = Math.max(value, minValue + step);
    setMaxValue(newMaxVal);
  };

  const minPos = ((minValue - min) / (max - min)) * 100;
  const maxPos = ((maxValue - min) / (max - min)) * 100;

  return (
    <>
      <div id='container-range' className='relative bottom-6'>
        <div className='wrapper'>
          <div className='input-wrapper'>
            <input
              className='input'
              type='range'
              value={minValue}
              min={min}
              max={max}
              step={step}
              ref={minValRef}
              onChange={handleMinChange}
            />
            <input
              className='input'
              type='range'
              value={maxValue}
              ref={maxValRef}
              min={min}
              max={max}
              step={step}
              onChange={handleMaxChange}
            />
          </div>

          <div className='control-wrapper '>
            <div className='control' style={{ left: `${minPos}%` }} />
            <div className='rail'>
              <div
                className='inner-rail'
                style={{ left: `${minPos}%`, right: `${100 - maxPos}%` }}
              />
            </div>
            <div className='control' style={{ left: `${maxPos}%` }} />
          </div>
        </div>
        <div className='flex justify-between relative bottom-4'>
          <Tooltip
            content={(
              <div className='max-w-[12rem] text-center'>
                Cliquez pour saisir la valeur minimale
              </div>
            )}
          >
            <div className='pl-3 cursor-pointer' onClick={() => { changeValue('min'); }}><span className='bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800'> {minValue} </span></div>
          </Tooltip>

          <Tooltip
            content={(
              <div className='max-w-[12rem] min-w-[10rem] text-center'>
                Cliquez pour saisir la valeur maximale
              </div>
            )}
          >
            <div className='pr-3 cursor-pointer' onClick={() => { changeValue('max'); }}><span className='bg-blue-100 text-blue-800 text-xs font-semibold mr-2 px-2.5 py-0.5 rounded dark:bg-blue-200 dark:text-blue-800'> {maxValue} </span></div>
          </Tooltip>
        </div>

        <div
          role='navigation'
          aria-label='menu-principal'
          className='text-center'
        >
          <button
            type='button'
            onClick={(e) => {
              e.preventDefault();
              updateQuery(`${intervalInputData.dataValue}:[${minValue} TO ${maxValue}]`, `${minValue} à ${maxValue}`);
            }}
            className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
          >
            Valider
          </button>
          <button
            type='button'
            onClick={() => {
              onCloseChoiceInputModal();
            }}
            className='p-2 ml-2 text-white bg-istcolor-red border border-istcolor-red cta2 focus:ring-4 focus:outline-none'
          >
            Annuler
          </button>
        </div>
      </div>

      <ModalRangeField
        openModal={openModal}
        onCloseModal={onCloseModal}
        updateIntervalValue={updateIntervalValue}
        modalIntervalUpdateType={modalIntervalUpdateType}
        modalIntervalUpdateValue={modalIntervalUpdateValue}
        minValRef={minValRef}
        maxValRef={maxValRef}
        min={min}
        max={max}
        updateValRef={updateValRef}
      />

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
              placeholder={`Choisissez une valeur ${modalIntervalUpdateType === 'min' ? 'minimale' : 'maximale'}`}
              required
              ref={updateValRef}
              defaultValue={modalIntervalUpdateValue}
            />
          </div>
        </Modal.Body>
        <Modal.Footer className='flex justify-end items-center space-x-2 rounded-b border-gray-200 p-6 dark:border-gray-600 border-t'>
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
    </>
  );
}

RangeField.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  step: PropTypes.number.isRequired,
  intervalInputData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  onCloseChoiceInputModal: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
};

export default RangeField;
