import React, { useRef, useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import { operatorsField } from '../../../../config';
import OperatorField from '../../OperatorField/OperatorField';
import SearchInput from './SearchInput';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip, Modal } from 'flowbite-react';
import RetreiveCorrectField from '../../RetreiveCorrectField/RetreiveCorrectField';
import SearchValue from './SearchValue';

export default function SearchField ({
  shoudDisplaySearch,
  openIntervalInput,
  setShoudDisplaySearch,
  startQueryAvancedSearch,
  selectField,
  removeFields,
  setDisableCatalogInput,
  index,
  updateQuery,
  groupIndex,
  numberOfFields,
  setOpenIntervalInput,
}) {
  const [operatorSelect, setOperatorSelect] = useState([]);
  const [showModal, setShowModal] = useState(true);
  const [typeField, setTypeField] = useState('text');
  const searchInputRef = useRef(null);
  const searchValueRef = useRef(null);

  const updateValueOfSearchInput = (fn) => {
    searchInputRef.current.value = fn();
  };

  const onCloseChoiceInputModal = () => {
    setOpenIntervalInput(false);
    setShoudDisplaySearch(false);
    startQueryAvancedSearch(true);
  };

  const handleTypeField = (field) => {
    setTypeField(field);
  };

  const handleRemoveFields = () => {
    removeFields(index - 1, groupIndex);

    if (numberOfFields === index + 1) {
      searchInputRef.current.value = '';
      setDisableCatalogInput(false);
    }
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

      setOperatorSelect(reduced);
      handleTypeField(reduced[0].typeField);
    }
  }, [selectField]);

  return (
    <div
      id='dropdownSearch'
      className='block z-10 rounded'
    >
      <div className='flex flex-col justify-between pb-3 '>
        <div className='flex items-center'>
          <SearchInput
            disableCatalogInput={!!selectField.enabledDeleteButton}
            value={selectField.inputSearchValue ? selectField.inputSearchValue : ''}
            onClick={() => {
              setShoudDisplaySearch(false);
              startQueryAvancedSearch(true);
            }}
            ref={searchInputRef}
          />
          {selectField.inputSearchValue && (
            <SearchValue
              value={selectField.value}
              ref={searchValueRef}
            />
          )}

          {selectField.enabledDeleteButton && (
            <Tooltip
              content='Supprimez cette recherche'
            >
              <button
                type='button'
                onClick={() => handleRemoveFields()}
                className='inline-block pl-2 text-istcolor-grey-light hover:text-istcolor-red'
              >
                <FontAwesomeIcon icon='trash-can' className='md:text-lg' />
              </button>
            </Tooltip>
          )}
        </div>

        {openIntervalInput && (
          <Modal
            show={showModal}
            onClose={onCloseChoiceInputModal}
            className='relative h-full w-full p-4 md:h-auto y max-w-2xl'
          >
            <div className='istex-modal__header'>
              <Modal.Header>
                <span className='istex-modal__text'>
                  {`Valeur de ${selectField.dataTitle}`}
                </span>
              </Modal.Header>
            </div>
            <Modal.Body>
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
                  <div className={`py-5 ${typeField === 'range' && 'w-full'}`}>
                    <RetreiveCorrectField
                      setOpenIntervalInput={setOpenIntervalInput}
                      setShowModal={setShowModal}
                      setShoudDisplaySearch={setShoudDisplaySearch}
                      startQueryAvancedSearch={startQueryAvancedSearch}
                      onCloseChoiceInputModal={onCloseChoiceInputModal}
                      data={selectField}
                      updateValueOfSearchInput={updateValueOfSearchInput}
                      updateQuery={updateQuery}
                      typeField={typeField}
                    />
                  </div>
                  )
                : null
            }
              </div>
            </Modal.Body>
          </Modal>
        )}
      </div>
    </div>
  );
}

SearchField.propTypes = {
  shoudDisplaySearch: PropTypes.bool,
  openIntervalInput: PropTypes.bool,
  setShoudDisplaySearch: PropTypes.func,
  startQueryAvancedSearch: PropTypes.func,
  selectField: PropTypes.object,
  updateQuery: PropTypes.func,
  removeFields: PropTypes.func,
  setDisableCatalogInput: PropTypes.func,
  setOpenIntervalInput: PropTypes.func,
  index: PropTypes.number,
  groupIndex: PropTypes.number,
  numberOfFields: PropTypes.number,
};
