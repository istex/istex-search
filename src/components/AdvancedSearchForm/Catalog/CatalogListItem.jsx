import React from 'react';
import PropTypes from 'prop-types';

export default function CatalogListItem ({
  catalog,
  togglePreference,
}) {
  return (
    <li className='pb-3 pl-5'>
      <h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>{catalog.title} </h3>
      {catalog.items.map((item, index) => (
        <div className='flex pb-3' key={index}>
          <div className='flex items-center h-5'>
            <input
              id={`helper-radio-${index}`}
              name={item.dataTitle}
              type='checkbox'
              onChange={(e) => { togglePreference(e, item); }}
              value={item.dataTitle}
              aria-describedby='helper-radio-text-{index}'
              className='cursor-pointer w-4 h-4 text-blue-istex bg-gray-100 border-gray-300'
            />
          </div>
          <div className='ml-2 text-sm'>
            <label htmlFor='helper-radio' className='font-medium text-gray-900 dark:text-gray-300'>{item.dataTitle}</label>
            <p id={`helper-radio-text-${index}`} className='text-xs font-normal text-gray-500 dark:text-gray-300'>{item.dataInfo}</p>
          </div>
        </div>
      ))}
    </li>
  );
}

CatalogListItem.propTypes = {
  catalog: PropTypes.object,
  togglePreference: PropTypes.func,
};
