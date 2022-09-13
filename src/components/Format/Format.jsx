import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';

import { toggleFormat, isFormatSelected } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function Format ({ name, value, className, infoText }) {
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);

  const checkHandler = () => {
    eventEmitter.emit(events.setSelectedFormats, toggleFormat(selectedFormats, value));
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
          className='w-5 h-5 outline-none border-istcolor-grey-dark text-istcolor-green-light bg-gray-100 rounded focus:ring-isistcolor-green-light'
        />
        <label
          htmlFor={`checkbox-${name}`}
          className='flex items-center italic pl-2'
        >
          <span>{name}</span>
          <Tooltip
            trigger='click'
            content={infoText}
          >
            <button>
              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue pl-2 cursor-pointer' />
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
};
