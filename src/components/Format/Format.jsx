import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toggleFormat, isFormatSelected } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';

export default function Format ({ name, value, className, setHasClickOnSubCategory }) {
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);

  const checkHandler = () => {
    setHasClickOnSubCategory && setHasClickOnSubCategory(true);
    eventEmitter.emit(events.setSelectedFormats, toggleFormat(selectedFormats, value));
  };

  return (
    <div className={className}>
      <input
        type='checkbox'
        name={name}
        onChange={checkHandler}
        checked={isFormatSelected(selectedFormats, value)}
        className='mr-2 w-5 h-5 outline-none rounded border-gray-400 accent-[#a9bb1e] p-2'
      />
      <label
        htmlFor={name}
      >
        {name}
      </label>
    </div>
  );
}

Format.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  setHasClickOnSubCategory: PropTypes.func,
  className: PropTypes.string,
};
