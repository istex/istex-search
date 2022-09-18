import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { operatorsField } from '../../../../config';
import OperatorField from '../../OperatorField/OperatorField';
import SearchInput from './SearchInput';
import IntervalRangeField from '../RangeField/IntervalRangeField';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

export default function SearchField ({
  shoudDisplaySearch,
  disableCatalogInput,
  openIntervalInput,
  setShoudDisplaySearch,
  startQueryAvancedSearch,
  selectField,
  setSelectField,
  updateQuery,
  enabledDeleteButton,
  removeFields,
  setDisableCatalogInput,
  index,
  setEnabledDeleteButton,
}) {
  console.log('SearchField', { selectField });
  const [operatorSelect, setOperatorSelect] = useState([]);
  const [typeField, setTypeField] = useState('text');
  const searchInputRef = useRef(null);

  const updateValueOfSearchInput = (fn) => {
    searchInputRef.current.value = fn();
  };

  const handleTypeField = (field) => {
    setTypeField(field);
  };

  const handleRemoveFields = () => {
    setDisableCatalogInput(false);
    removeFields(index);
    searchInputRef.current.value = '';
    setEnabledDeleteButton(false);
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
        <div className='flex items-center'>
          <SearchInput
            disableCatalogInput={disableCatalogInput}
            value={selectField.inputSearchValue ? selectField.inputSearchValue : ''}
            onClick={() => {
              setShoudDisplaySearch(false);
              startQueryAvancedSearch(true);
            }}
            ref={searchInputRef}
          />

          {enabledDeleteButton && (
            <Tooltip
              content='Supprimer cette recherche'
            >
              <button
                type='button'
                onClick={() => handleRemoveFields()}
                className='inline-block pl-2 text-istcolor-red'
              >
                <FontAwesomeIcon icon='trash-can' className='md:text-lg' />
              </button>
            </Tooltip>
          )}
        </div>

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
              typeField === 'range'
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
  enabledDeleteButton: PropTypes.bool,
  removeFields: PropTypes.func,
  setDisableCatalogInput: PropTypes.func,
  index: PropTypes.number,
  setEnabledDeleteButton: PropTypes.func,
};
