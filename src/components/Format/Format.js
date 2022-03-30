import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { toggleFormat, isFormatSelected } from '../../lib/istexApi';
import eventEmitter from '../../lib/eventEmitter';

export default function Format ({ name, value, style }) {
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);

  const checkHandler = () => {
    eventEmitter.emit('formatsChanged', toggleFormat(selectedFormats, value));
  };

  return (
    <div style={style}>
      <input
        type='checkbox'
        name={name}
        onChange={checkHandler}
        checked={isFormatSelected(selectedFormats, value)}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}

Format.propTypes = {
  name: PropTypes.string,
  value: PropTypes.number,
  style: PropTypes.object,
};
