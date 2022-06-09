import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import eventEmitter, { events } from '../../lib/eventEmitter';

export default function PredefinedUsage ({ name, formats }) {
  const usage = useSelector(state => state.istexApi.usage);

  const usageChangedHandler = event => {
    const newUsage = event.target.value;

    eventEmitter.emit(events.setSelectedFormats, formats);
    eventEmitter.emit(events.setUsage, newUsage);
  };

  return (
    <>
      <input
        type='radio'
        name='usages'
        value={name}
        checked={usage === name}
        onChange={usageChangedHandler}
      />
      <label htmlFor={name}>{name}</label>
    </>
  );
}

PredefinedUsage.propTypes = {
  name: PropTypes.string,
  formats: PropTypes.number,
};
