import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import RangeField from '../RangeField/RangeField';
import { operatorsField } from '../../../../config';
import OperatorField from '../../OperatorField/OperatorField';

export default function SearchField ({
  shoudDisplaySearch,
  request,
  disableCatalogInput,
  openIntervalInput,
  setOpenIntervalInput,
  intervalInputMinValue,
  intervalInputMaxValue,
  setDisableCatalogInput,
  queryInputHandler,
  setRequest,
  intervalInputData,
  setShoudDisplaySearch,
  startQueryAvancedSearch,
  selectField,
}) {
  const [operatorSelect, setOperatorSelect] = useState([]);
  const searchInput = useRef();

  const updateIntervalRequest = (min, max) => {
    searchInput.current.value = `${intervalInputData.dataTitle} de ${min} à ${max}`;
  };

  useEffect(() => {
    console.log('SearchField USE_EFFECT', { selectField });
    const { operatorsField: operatorsFieldFromSelectedField } = selectField;
    if (operatorsFieldFromSelectedField && operatorsFieldFromSelectedField.length > 0) {
      const reduced = operatorsField.reduce((filtered, operator) => {
        const elt = operatorsFieldFromSelectedField.find(
          operatorFieldFromSelectedField => operatorFieldFromSelectedField.id === operator.id,
        );

        if (elt) {
          const someNewValue = {
            id: operator.id,
            label: operator.label,
            typeField: elt.typeField,
          };

          filtered.push(someNewValue);
        }

        return filtered;
      }, []);

      console.log('SearchField USE_EFFECT', { reduced });

      setOperatorSelect(reduced);
    }
  }, [selectField]);

  return (
    <div
      id='dropdownSearch'
      className={`${shoudDisplaySearch ? 'block' : 'hidden'} z-10 rounded`}
    >
      <div className='flex flex-col md:flex-row justify-between pb-3 '>
        <div className='w-1/2'>
          <label htmlFor='input-group-search' className='sr-only'>Search</label>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg className='w-5 h-5 text-gray-500 dark:text-gray-400' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' /></svg>
            </div>
            <input
              type='text'
              id='input-group-search'
              ref={searchInput}
              onChange={event => setRequest(event.target.value)}
              defaultValue={request}
              onClick={() => {
                setShoudDisplaySearch(false);
                startQueryAvancedSearch(true);
              }}
              className='block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Sélectionner un ou plusieurs champs dans le catalogue...'
              disabled={disableCatalogInput}
            />
          </div>
        </div>
        {
          operatorSelect.length > 0 && <OperatorField options={operatorSelect} />
        }
        {/* {
          openIntervalInput
            ? (
              <div className='w-1/2'>
                <RangeField
                  intervalInputData={intervalInputData}
                  setOpenIntervalInput={setOpenIntervalInput}
                  setRequest={setRequest}
                  min={intervalInputMinValue}
                  max={intervalInputMaxValue}
                  searchInput={searchInput}
                  setDisableCatalogInput={setDisableCatalogInput}
                  queryInputHandler={queryInputHandler}
                  onChange={({ min, max }) => { updateIntervalRequest(min, max); }}
                />
              </div>
              )
            : null
        } */}
      </div>
    </div>
  );
}

SearchField.propTypes = {
  shoudDisplaySearch: PropTypes.bool,
  disableCatalogInput: PropTypes.bool,
  openIntervalInput: PropTypes.bool,
  setOpenIntervalInput: PropTypes.func,
  setDisableCatalogInput: PropTypes.func,
  intervalInputMinValue: PropTypes.number,
  intervalInputMaxValue: PropTypes.number,
  queryInputHandler: PropTypes.func,
  setRequest: PropTypes.func,
  intervalInputData: PropTypes.any,
  request: PropTypes.string,
  setShoudDisplaySearch: PropTypes.func,
  startQueryAvancedSearch: PropTypes.func,
  selectField: PropTypes.object,
};
