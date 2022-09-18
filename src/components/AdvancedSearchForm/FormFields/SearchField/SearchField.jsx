import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { operatorsField } from '../../../../config';
import OperatorField from '../../OperatorField/OperatorField';
import SearchInput from './SearchInput';
import IntervalRangeField from '../RangeField/IntervalRangeField';

export default function SearchField ({
  shoudDisplaySearch,
  disableCatalogInput,
  openIntervalInput,
  setShoudDisplaySearch,
  startQueryAvancedSearch,
  selectField,
  setSelectField,
  updateQuery,
}) {
  const [operatorSelect, setOperatorSelect] = useState([]);
  const [typeField, setTypeField] = useState('');
  const searchInputRef = useRef(null);

  const updateValueOfSearchInput = (fn) => {
    searchInputRef.current.value = fn();
  };

  const handleTypeField = (field) => {
    setTypeField(field);
  };

  useEffect(() => {
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
      <div className='flex flex-col justify-between pb-3 '>
        <SearchInput
          disableCatalogInput={disableCatalogInput}
          value={selectField.inputSearchValue ? selectField.inputSearchValue : ''}
          onClick={() => {
            setShoudDisplaySearch(false);
            startQueryAvancedSearch(true);
          }}
          onChange={event => setSelectField(prev => ({ ...prev, inputSearchValue: event.target.value }))}
          ref={searchInputRef}
        />

        {openIntervalInput && (
          <div className='flex flex-1 items-center flex-col justify-center bg-white h-[300px] mt-2'>
            {
              operatorSelect.length > 0 && (
                <OperatorField
                  options={operatorSelect}
                  setTypeField={field => handleTypeField(field)}
                  typeField={typeField}
                />
              )
            }
            {
              typeField
                ? (
                  <div className='py-5'>
                    <IntervalRangeField
                      data={selectField}
                      updateValueOfSearchInput={updateValueOfSearchInput}
                      updateQuery={updateQuery}
                    />
                  </div>
                  )
                : null
            }
          </div>
        )}
      </div>
    </div>
  );
}

SearchField.propTypes = {
  shoudDisplaySearch: PropTypes.bool,
  disableCatalogInput: PropTypes.bool,
  openIntervalInput: PropTypes.bool,
  setShoudDisplaySearch: PropTypes.func,
  startQueryAvancedSearch: PropTypes.func,
  selectField: PropTypes.object,
  setSelectField: PropTypes.func,
  updateQuery: PropTypes.func,
};
