import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { toggleFormat, isFormatSelected } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Format ({
  name,
  value,
  className,
  infoText,
  setSelectedFormatInsideCategory,
  selectedFormatInsideCategory,
}) {
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const buttonRef = useRef(null);

  const checked = isFormatSelected(selectedFormats, value);

  const checkHandler = () => {
    const selectedFormat = !checked;

    if (setSelectedFormatInsideCategory) {
      if (selectedFormat === true) {
        setSelectedFormatInsideCategory([...selectedFormatInsideCategory, name]);
      } else {
        const newSelected = selectedFormatInsideCategory.filter(formatName => formatName !== name);
        setSelectedFormatInsideCategory(newSelected);
      }
    }

    eventEmitter.emit(events.setSelectedFormats, toggleFormat(selectedFormats, value));
  };

  const onCloseClick = (ref) => {
    ref.current.click();
  };

  return (
    <div className={className}>
      <div className='flex items-center mb-4'>
        <input
          type='checkbox'
          name={name}
          onChange={checkHandler}
          checked={isFormatSelected(selectedFormats, value)}
          id={`checkbox-${name}`}
          value=''
          className='w-5 h-5 border-[2px] border-istcolor-grey-light text-istcolor-green-light bg-gray-100 rounded focus:ring-transparent focus:border-istcolor-grey-light'
        />
        <label
          htmlFor={`checkbox-${name}`}
          className='flex items-center pl-2'
        >
          <span className='text-sm pr-2'>{name}</span>
          <Tooltip
            trigger='click'
            content={
              <>
                <div className='flex w-full justify-end relative left-1'>
                  <button type='button' onClick={() => onCloseClick(buttonRef)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                {infoText}
              </>
            }
          >
            <button ref={buttonRef}>
              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue cursor-pointer' />
            </button>
          </Tooltip>
        </label>
      </div>
    </div>
  );
}

Format.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  className: PropTypes.string,
  infoText: PropTypes.node,
  selectedFormatInsideCategory: PropTypes.array,
  setSelectedFormatInsideCategory: PropTypes.func,
};
