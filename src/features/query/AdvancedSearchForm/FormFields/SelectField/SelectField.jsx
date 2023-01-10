import React, { useState } from 'react';
import PropTypes from 'prop-types';

function SelectField ({ options }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <select onChange={handleChange} value={value}>
      {options.map((option, index) => {
        return (
          <option
            key={index}
            value={option.value}
          >
            {option.label}
          </option>
        );
      })}
    </select>
  );
}

SelectField.propTypes = {
  options: PropTypes.array,
};

export default SelectField;
