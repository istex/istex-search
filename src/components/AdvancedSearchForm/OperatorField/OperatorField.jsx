import React from 'react';
import PropTypes from 'prop-types';

function OperatorField ({ options = [], setTypeField, typeField }) {
  const handleChange = (event) => {
    setTypeField(event.target.value);
  };

  return (
    <div
      id='select'
      className='pt-4 min-w-6 md:min-w-4'
    >
      <select
        id='operator-field'
        required
        onChange={handleChange}
        className='block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg  text-sm mr-6'
      >
        {options.map((option, index) => (
          <option
            key={`${option.id}-${index}`}
            value={option.typeField}
          >
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
}

OperatorField.propTypes = {
  options: PropTypes.array,
  setTypeField: PropTypes.func,
  typeField: PropTypes.string,
};

export default OperatorField;
