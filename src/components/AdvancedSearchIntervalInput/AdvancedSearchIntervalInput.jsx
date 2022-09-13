import React, { useState, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import './AdvancedSearchIntervalInput.scss';
import PropTypes from 'prop-types';
import { Modal, Button, TextInput, Label } from 'flowbite-react';

function AdvancedSearchIntervalInput ({
  min,
  max,
  onChange,
  intervalInputData,
  setOpenIntervalInput,
  searchInput,
  setRequest,
  queryInputHandler,
  setDisableCatalogInput
}) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const [openModal, setOpenModal] = useState(false);
  const [modalIntervalUpdateType, setModalIntervalUpdateType] = useState('min');
  const [modalIntervalUpdateValue, setModalIntervalUpdateValue] = useState(null);
  const minValRef = useRef(0);
  const maxValRef = useRef(0);
  const updateValRef = useRef(null);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback((value) => {
    Math.round(((value - min) / (max - min)) * 100);
  }, [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);
      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  const onCloseModal = () => {
    setOpenModal(false);
  };
  const changeValue = (value) => {
    if (value === 'min') {
      setModalIntervalUpdateValue(minVal);
    } else {
      setModalIntervalUpdateValue(maxVal);
    }
    setOpenModal(true);
    setModalIntervalUpdateType(value);
  };
  const updateIntervalValue = (value) => {
    if (modalIntervalUpdateType === 'min' && value <= maxValRef.current.value) {
      setMinVal(value);
      minValRef.current.value = value;
    } else if (modalIntervalUpdateType === 'max' && value >= minValRef.current.value) {
      setMaxVal(value);
      maxValRef.current.value = value;
    }
    onCloseModal();
  };

  // Update the query with the interval search values and close the interval input box
  const updateQuery = () => {
    queryInputHandler(`${intervalInputData.dataValue}:[${minVal} TO ${maxVal}]`);
    setDisableCatalogInput(true);
    setOpenIntervalInput(false);
  };

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <>
      <div className='container rounded-t-xl bg-white rounded shadow dark:bg-gray-700'>
        <label htmlFor='default-range' className=' bold block mb-3-25 text-sm font-medium text-gray-900 dark:text-gray-300'>{intervalInputData.dataTitle}</label>

        <div>
          <input
            id='minmax-range'
            type='range'
            min={min}
            max={max}
            value={minVal}
            ref={minValRef}
            onChange={(event) => {
              const value = Math.min(+event.target.value, maxVal - 1);
              setMinVal(value);
              event.target.value = value.toString();
            }}
            className={classnames('thumb thumb--zindex-3', {
              'thumb--zindex-5': minVal > max - 100,
            })}
          />
          <input
            type='range'
            min={min}
            max={max}
            value={maxVal}
            ref={maxValRef}
            onChange={(event) => {
              const value = Math.max(+event.target.value, minVal + 1);
              setMaxVal(value);
              event.target.value = value.toString();
            }}
            className='thumb thumb--zindex-4'
          />

          <div className='slider'>
            <div className='slider__track' />
            <div ref={range} className='slider__range' />
            <div className='slider__left-value cursor-pointer' onClick={() => { changeValue('min'); }}>{minVal}</div>
            <div className='slider__right-value cursor-pointer' onClick={() => { changeValue('max'); }}>{maxVal}</div>
          </div>
        </div>
        <button onClick={(e) => { e.preventDefault(); updateQuery(); }} className='text-white relative right-2  bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-4 py-2 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800'>Ajouter</button>
      </div>

      <div className='interval-wrapper' onClick={() => { setRequest(''); searchInput.current.value = ''; setOpenIntervalInput(false); setDisableCatalogInput(false); }} role='navigation' aria-label='menu-principal'>
        <button id='toggle-nav' title='fermer la fenêtre' className='close-button ' />
      </div>

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
          <Button onClick={() => { updateIntervalValue(updateValRef.current.value); }}>
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

AdvancedSearchIntervalInput.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  intervalInputData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  setDisableCatalogInput: PropTypes.func.isRequired,
  searchInput: PropTypes.any.isRequired,
  setOpenIntervalInput: PropTypes.func.isRequired,
  setRequest: PropTypes.func.isRequired,
  queryInputHandler: PropTypes.func.isRequired,
};

AdvancedSearchIntervalInput.defaultProps = {};

export default AdvancedSearchIntervalInput;
