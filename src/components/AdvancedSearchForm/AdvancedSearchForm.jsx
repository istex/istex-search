import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';

import FormField from './FormFields/FormField';
import OperatorRequest from './OperatorRequest/OperatorRequest';
import { useStateWithCallback } from '../../lib/hooks';

function AdvancedSearchForm ({ queryInputHandler }) {
  const initialFieldArray = [{ type: 'field' }];

  const [groupFields, setGroupFields] = useStateWithCallback([{ id: 1, allFields: initialFieldArray, type: 'group' }]);
  const [formFields, setFormFields] = useStateWithCallback(initialFieldArray);
  const [shouldDisplayAddButton, setShouldDisplayAddButton] = useState(false);
  const [shouldDisplayGroupOperatorButton, setShouldDisplayGroupOperatorButton] = useState(false);

  const handleSelectField = (field, index, groupIndex) => {
    const newGroupFields = [...groupFields];
    newGroupFields[groupIndex].allFields[index] = { ...newGroupFields[groupIndex].allFields[index], ...field };
    setGroupFields(newGroupFields);
  };

  const addFields = (groupIndex) => {
    const newGroupFields = [...groupFields];
    if (groupFields.length === 1) {
      newGroupFields[0].allFields = [...groupFields[0].allFields, { type: 'operator', queryValue: 'AND' }, { type: 'field' }];
      setGroupFields(newGroupFields);
    } else {
      newGroupFields[groupIndex].allFields = [...groupFields[groupIndex].allFields, { type: 'operator', queryValue: 'AND' }, { type: 'field' }];
      setGroupFields(newGroupFields);
    }
    setShouldDisplayAddButton(false);
  };

  // Update the Query at every GrouFields change
  useEffect(() => {
    handleQueryAdvancedSearch();
  }, [groupFields]);

  const addGroups = (value, updateGroupId = false) => {
    const operator = value.target.value;
    if (operator === 'OR' || operator === 'AND' || operator === 'NOT') {
      let updateGroupFields = [];
      let operatorLabel = '';
      if (operator === 'OR') operatorLabel = 'OU';
      else if (operator === 'AND') operatorLabel = 'ET';
      else if (operator === 'NOT') operatorLabel = 'SAUF';
      if (groupFields.length >= 1) updateGroupFields = groupFields.reverse();
      else updateGroupFields = groupFields;
      // Check if the group exist to update it
      const newGroupId = updateGroupFields.find(element => element.id).id;
      updateGroupFields = groupFields.reverse();
      if (groupFields[updateGroupId]) {
        updateGroupFields = groupFields;
        const index = groupFields.findIndex((group) => group.id === updateGroupId);
        updateGroupFields[index] = { id: updateGroupId, type: 'operator', queryValue: value.target.value, value: operatorLabel };
        setGroupFields([...updateGroupFields]);
      } else {
        setGroupFields([...groupFields, { id: newGroupId + 1, type: 'operator', queryValue: value.target.value, value: operatorLabel }, { id: newGroupId + 2, allFields: [{ type: 'field' }], type: 'group' }]);
      }
    }
    setShouldDisplayGroupOperatorButton(false);
  };

  const removeGroups = (groupId) => {
    const newGroupFields = [...groupFields];
    newGroupFields.splice(groupId - 1, 2);
    setGroupFields(newGroupFields);
  };

  const removeFields = (index, groupIndex) => {
    const newGroupFields = [...groupFields];

    if (newGroupFields.length === 1 && newGroupFields[0].allFields.length === 1) {
      newGroupFields[0].allFields = initialFieldArray;
      setGroupFields(newGroupFields);
      setFormFields(initialFieldArray);
      setShouldDisplayAddButton(false);
      queryInputHandler('');
    } else {
      if (index <= 0) {
        index = [0];
        newGroupFields[groupIndex].allFields.splice(index, 2);
      } else {
        newGroupFields[groupIndex].allFields.splice(index, 2);
      }

      if (newGroupFields[groupIndex].allFields.length === 0 && groupIndex === 0) {
        newGroupFields[0].allFields = [{ type: 'field' }];
        setGroupFields([...newGroupFields]);
      } else if (newGroupFields[groupIndex].allFields.length === 0) {
        removeGroups(groupIndex);
      } else {
        setGroupFields([...newGroupFields]);
      }
    }
  };

  const handleQueryAdvancedSearch = () => {
    let Query = '';
    if (groupFields.length === 1) {
      Query = groupFields[0].allFields.map((group) => {
        return group.queryValue;
      }).join(' ');
    } else {
      Query += '(';
      groupFields.forEach((group) => {
        if (group.id === 0 && group.type === 'group') {
          Query += `(${group.queryValue} `;
        }
        if (group.type === 'operator') {
          Query += `) ${group.queryValue} (`;
        } else if (group.type === 'group') {
          group.allFields.forEach((field, index) => {
            if (index <= group.allFields.length - 2) Query += field.queryValue + ' ';
            else Query += field.queryValue + '';
          });
        }
      });
      if (groupFields.length > 1) Query += ')';
    }
    // replace 'undefined' in the request api input when value is not set
    const updatedQuery = Query.replace('undefined', '*valeur à définir*');
    queryInputHandler(updatedQuery);
  };

  return (
    <form className='pl-2 ml-4 md:ml-4'>
      <ol data-testid='timeline-component' className='relative border-l border-[#458ca5] dark:border-gray-700'>
        {groupFields.map((groupField, groupIndex) => {
          if (groupField.type === 'group') {
            return (
              <li key={`groupfield-${groupIndex}`} data-testid='timeline-item' className='mb-10 ml-6'>
                <div data-testid='timeline-point' className='bg-[#458ca5]'>
                  <div className='absolute -left-1.5 mt-1.5 h-3 w-3 rounded-full border border-[#458ca5] bg-[#458ca5] dark:border-[#458ca5] dark:bg-[#458ca5]' />
                </div>
                <div data-testid='timeline-content' className=''>
                  <div className='mb-4 text-base font-normal text-gray-500 dark:text-gray-400'>
                    {groupIndex >= 1 && (
                      <button
                        onClick={() => removeGroups(groupIndex)}
                        className='border hover:bg-gray-100 hover:text-blue-700 disabled:hover:bg-white focus:ring-red-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 dark:disabled:hover:bg-gray-800 focus:!ring-2 group flex h-min w-fit items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg' type='button'
                      >
                        <span className='flex items-center rounded-md text-sm px-2 py-2 mb-2 relative bottom-2 text-white bg-istcolor-red border border-istcolor-red cta2 focus:ring-4 focus:outline-none'>
                          Supprimer le groupe
                        </span>
                      </button>)}
                    {groupField.type === 'group' && groupField.allFields.map((formField, index) => {
                      if (formField.type === 'field') {
                        return (
                          <>
                            <FormField
                              key={`field-${index}`}
                              setFormFields={setFormFields}
                              queryInputHandler={queryInputHandler}
                              index={index}
                              groupIndex={groupIndex}
                              setShouldDisplayAddButton={setShouldDisplayAddButton}
                              removeFields={removeFields}
                              selectField={formField}
                              setSelectField={handleSelectField}
                              handleQueryAdvancedSearch={handleQueryAdvancedSearch}
                              numberOfFields={formFields.length}
                            />
                          </>
                        );
                      } else {
                        return (
                          <div
                            key={`operator-request-${index}`}
                            className='inline-block w-20 mb-2'
                          >
                            <OperatorRequest
                              setSelectedOperatorRequest={handleSelectField}
                              index={index}
                              groupIndex={groupIndex}
                              handleQueryAdvancedSearch={handleQueryAdvancedSearch}
                            />
                          </div>
                        );
                      }
                    })}
                    {
                    shouldDisplayAddButton && (
                      <button
                        onClick={() => addFields(groupIndex)}
                        className='border hover:bg-gray-100 hover:text-blue-700 disabled:hover:bg-white focus:ring-blue-700 focus:text-blue-700 dark:bg-transparent dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700 focus:ring-2 dark:disabled:hover:bg-gray-800 focus:!ring-2 group flex h-min w-fit items-center justify-center p-0.5 text-center font-medium focus:z-10 rounded-lg' type='button'
                      >
                        <span className='flex items-center rounded-md text-sm px-4 py-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'>
                          Ajouter
                        </span>
                      </button>
                    )
                  }
                  </div>
                </div>
                <div onClick={() => setShouldDisplayGroupOperatorButton(!shouldDisplayGroupOperatorButton)} data-testid='timeline-point' className='h-3 w-3 mr-2 cursor-pointer'>
                  <span className='absolute -left-3 flex h-6 w-6 items-center justify-center rounded-full bg-[#458ca5] ring-8 ring-[#458ca5] dark:bg-white dark:ring-white'>

                    {groupIndex > groupFields.length - 3
                      ? (
                        <Tooltip
                          content={(
                            <div className='min-w-[9rem] max-w-[12rem] text-center  '>
                              Cliquez ici pour créer un nouveau groupe
                            </div>
                            )}
                        >
                          <svg stroke='currentColor' fill='currentColor' strokeWidth='0' viewBox='0 0 16 16' aria-hidden='true' className='h-3 w-3 text-white dark:text-blue-300' height='1em' width='1em' xmlns='http://www.w3.org/2000/svg'><path d='M14 7v1H8v6H7V8H1V7h6V1h1v6h6z' />
                          </svg>
                        </Tooltip>
                        )
                      : (
                        <>
                          <Tooltip
                            content={(
                              <div className='min-w-[9rem] max-w-[12rem] text-center  '>
                                Cliquez ici pour modifier l'opérateur groupe
                              </div>
                            )}
                          >
                            <span className='text-white text-sm'>
                              {groupFields[groupIndex + 1]?.value}
                            </span>
                          </Tooltip>
                        </>
                        )}

                  </span>
                </div>
                {
                  shouldDisplayGroupOperatorButton && (
                    <select style={{ maxWidth: '13rem', minWidth: '11rem' }} onChange={(e) => addGroups(e, groupField.id + 1 || false)} className='block w-full border disabled:cursor-not-allowed disabled:opacity-50 bg-gray-50 border-gray-300 text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500 rounded-lg p-2.5 text-sm' id='operator-request' required=''>
                      <option className='hidden' value=''> Choisissez l'opérateur </option>
                      <option value='AND'>ET</option>
                      <option value='OR'>OU</option>
                      <option value='NOT'>SAUF</option>
                    </select>
                  )
                }

              </li>
            );
          } else {
            return null;
          }
        })}
      </ol>

    </form>
  );
}

AdvancedSearchForm.propTypes = {
  queryInputHandler: PropTypes.func,
};

AdvancedSearchForm.defaultProps = {};

export default AdvancedSearchForm;
