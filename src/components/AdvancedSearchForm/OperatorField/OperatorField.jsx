import { Select } from 'flowbite-react';
import React, { useState } from 'react';
import PropTypes from 'prop-types';

function OperatorField ({ options = [] }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);

    console.log({ value });
  };

  console.log('OperatorField', { options });

  return (
    <div id='select'>
      <Select
        id='countries'
        required
        onChange={handleChange}
      >
        {options.map((option, index) => (
          <option
            key={`${option.id}-${index}`}
            value={option.typeField}
          >
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
}

OperatorField.propTypes = {
  options: PropTypes.array,
};

export default OperatorField;
