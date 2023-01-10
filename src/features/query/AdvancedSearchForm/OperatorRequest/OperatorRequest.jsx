import React from 'react';
import { Select } from 'flowbite-react';
import PropTypes from 'prop-types';

import { operatorsRequest } from '@/config';

function OperatorRequest ({ setSelectedOperatorRequest, index, handleQueryAdvancedSearch, groupIndex }) {
  const handleChange = (event) => {
    const operator = event.target.value;
    setSelectedOperatorRequest({
      queryValue: operator,
    }, index, groupIndex);
    handleQueryAdvancedSearch();
  };

  return (
    <div
      id='select'
      className='mb-1'
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
  setSelectedOperatorRequest: PropTypes.func,
  handleQueryAdvancedSearch: PropTypes.func,
  index: PropTypes.number,
  groupIndex: PropTypes.number,
};

export default OperatorRequest;
