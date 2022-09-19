import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormField from './FormFields/FormField';
import OperatorRequest from './OperatorRequest/OperatorRequest';
import { useStateWithCallback } from '../../lib/hooks';

function AdvancedSearchForm ({ queryInputHandler }) {
  const initialFieldArray = [{ type: 'field' }];

  const [formFields, setFormFields] = useStateWithCallback(initialFieldArray);
  const [shouldDisplayAddButton, setShouldDisplayAddButton] = useState(false);

  const handleSelectField = (field, index) => {
    const newFormFields = [...formFields];
    newFormFields[index] = { ...newFormFields[index], ...field };
    setFormFields(newFormFields);
  };

  const addFields = () => {
    setFormFields([...formFields, { type: 'operator', queryValue: 'AND' }, { type: 'field' }]);
    setShouldDisplayAddButton(false);
  };

  const removeFields = (index) => {
    if (formFields.length === 1) {
      setFormFields(initialFieldArray);
      setShouldDisplayAddButton(false);
      queryInputHandler('');
    }

    if (formFields.length > 1 && formFields.length > index + 1) {
      const removeValFrom = [index, index + 1];
      const newFormFields = formFields.filter((value, index) => removeValFrom.indexOf(index) === -1);
      setFormFields(newFormFields);
      handleQueryAdvancedSearch({ newFormFields });
    }

    if (formFields.length > 1 && formFields.length === index + 1) {
      const removeValFrom = [index, index - 1];
      const newFormFields = formFields.filter((value, index) => removeValFrom.indexOf(index) === -1);
      setFormFields(newFormFields);
      handleQueryAdvancedSearch({ newFormFields });
    }
  };

  const handleQueryAdvancedSearch = ({ newFormFields = formFields, queryValue = '', operator = '', index = 0 }) => {
    let result = newFormFields.map((formField) => {
      return formField.queryValue;
    }).join(' ');

    if (queryValue) {
      result = `${result}${queryValue}`;
    }

    if (operator && index) {
      const newFormFieldsOperator = [...newFormFields];
      newFormFieldsOperator[index] = { queryValue: operator };

      result = newFormFieldsOperator.map((field) => {
        return field.queryValue;
      }).join(' ');
    }

    queryInputHandler(result);
  };

  return (
    <form>
      {formFields.map((formField, index) => {
        if (formField.type === 'field') {
          return (
            <FormField
              key={`field-${index}`}
              setFormFields={setFormFields}
              queryInputHandler={queryInputHandler}
              index={index}
              setShouldDisplayAddButton={setShouldDisplayAddButton}
              removeFields={removeFields}
              selectField={formField}
              setSelectField={handleSelectField}
              handleQueryAdvancedSearch={handleQueryAdvancedSearch}
            />
          );
        } else {
          return (
            <div
              key={`operator-request-${index}`}
              className='w-1/4 mb-2'
            >
              <OperatorRequest
                setSelectedOperatorRequest={handleSelectField}
                index={index}
                handleQueryAdvancedSearch={handleQueryAdvancedSearch}
              />
            </div>
          );
        }
      })}
      {
        shouldDisplayAddButton && (
          <button
            type='button'
            onClick={() => addFields()}
            className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
          >
            Ajouter
          </button>
        )
      }
    </form>
  );
}

AdvancedSearchForm.propTypes = {
  queryInputHandler: PropTypes.func,
};

AdvancedSearchForm.defaultProps = {};

export default AdvancedSearchForm;
