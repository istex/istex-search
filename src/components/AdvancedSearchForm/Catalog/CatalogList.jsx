import React from 'react';
import PropTypes from 'prop-types';

import CatalogListItem from './CatalogListItem';
import { catalogList } from '../../../config';

export default function CatalogList ({
  openCatalogList,
  togglePreference,
}) {
  return (
    <div>
      <h2 id='accordion-collapse-heading' className={`${openCatalogList ? 'opacity-1' : 'hidden'}`}>
        <div className='catalog-title flex items-center justify-between w-full p-5  bg-black-200 font-medium text-left text-gray-500 border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' data-accordion-target='#accordion-collapse-body-1' aria-expanded='true' aria-controls='accordion-collapse-body-1'>
          <div className='grow opacity-0'>
            <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
          </div>
          <span className='text-white grow-1 font-bold'>Champs Istex</span>
          <div className='grow opacity-0'>
            <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
          </div>
        </div>
      </h2>

      <div id='dropdownUsers' className={`${openCatalogList ? 'opacity-1' : 'hidden'} z-10 w-120 bg-white rounded shadow dark:bg-gray-700 scroll`}>
        <ul className='catalog-container overflow-y-auto py-1 h-48 text-gray-700 pb-3 dark:text-gray-200 ml-4 scroll' aria-labelledby='dropdownUsersButton'>
          {catalogList.map((catalog, index) => (
            <CatalogListItem
              key={index}
              catalog={catalog}
              togglePreference={togglePreference}
            />
          ))}
        </ul>
      </div>
    </div>
  );
}

CatalogList.propTypes = {
  openCatalogList: PropTypes.bool,
  togglePreference: PropTypes.func,
};
