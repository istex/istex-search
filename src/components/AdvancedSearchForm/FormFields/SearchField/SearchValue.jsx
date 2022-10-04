import React from 'react';
import PropTypes from 'prop-types';

const SearchValue = React.forwardRef(({
  value,
  onChange,
}, ref) => {
  return (
    <div className='ml-4'>
      <div className='relative'>
        <input
          key={value}
          type='text'
          onChange={onChange}
          defaultValue={value}
          className='block w-28 pl-4 text-sm text-istcolor-black bg-istcolor-white rounded-full border border-istcolor-green-dark focus:border-istcolor-green-light'
          placeholder='Ajouter une valeur'
          disabled
          ref={ref}
        />
      </div>
    </div>
  );
});

SearchValue.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
};

export default SearchValue;
