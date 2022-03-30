import React from 'react';
import PropTypes from 'prop-types';
import eventEmitter from '../../lib/eventEmitter';

export default function PredefinedUsage ({ name, formats }) {
  const checkHandler = event => {
    const formatsToSend = event.target.checked ? formats : 0;
    eventEmitter.emit('formatsChanged', formatsToSend);
  };

  return (
    <div style={{ border: 'solid black 1px' }}>
      <input
        type='radio'
        name='predefinedUsages'
        onChange={checkHandler}
      />
      <label htmlFor={name}>{name}</label>
    </div>
  );
}

PredefinedUsage.propTypes = {
  name: PropTypes.string,
  formats: PropTypes.number,
};
