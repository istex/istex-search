import React from 'react';
import { Select } from 'flowbite-react';
import PropTypes from 'prop-types';

import { operatorsRequest } from '../../../config';

function OperatorRequest ({ setTypeField }) {
  const handleChange = (event) => {
    // setTypeField(event.target.value);
    console.log({ value: event.target.value });
  };

  return (
    <div
      id='select'
    >
      <Select
        id='operator-request'
        required
        onChange={handleChange}
      >
        {operatorsRequest.map((option, index) => (
          <option
            key={`${option.id}-${index}`}
            value={option.value}
          >
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

OperatorRequest.propTypes = {
  setTypeField: PropTypes.func,
};

export default OperatorRequest;
