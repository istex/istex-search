import React from 'react';
import { Select } from 'flowbite-react';
import PropTypes from 'prop-types';

function OperatorField ({ options = [], setTypeField }) {
  const handleChange = (event) => {
    setTypeField(event.target.value);
  };

  return (
    <div
      id='select'
      className='pt-4'
    >
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
  setTypeField: PropTypes.func,
};

export default OperatorField;
