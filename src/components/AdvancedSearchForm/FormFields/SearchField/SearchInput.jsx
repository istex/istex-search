import React from 'react';
import PropTypes from 'prop-types';

const SearchInput = React.forwardRef(({
  disableCatalogInput,
  value,
  onClick,
  onChange,
}, ref) => {
  console.log('SearchInput', { value });

  return (
    <div className='w-1/2'>
      <label htmlFor='input-group-search' className='sr-only'>Search</label>
      <div className='relative'>
        <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
          <svg className='w-5 h-5 text-gray-500 dark:text-gray-400' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' /></svg>
        </div>
        <input
          type='text'
          id='input-group-search'
          onChange={onChange}
          defaultValue={value}
          onClick={onClick}
          className='block p-2 pl-10 w-full text-sm text-istcolor-black bg-istcolor-white rounded-full border border-istcolor-green-dark focus:border-istcolor-green-light'
          placeholder='Sélectionner un ou plusieurs champs dans le catalogue...'
          disabled={disableCatalogInput}
          ref={ref}
        />
      </div>
    </div>
  );
});

SearchInput.propTypes = {
  disableCatalogInput: PropTypes.bool,
  value: PropTypes.string,
  onClick: PropTypes.func,
  onChange: PropTypes.func,
};

export default SearchInput;
