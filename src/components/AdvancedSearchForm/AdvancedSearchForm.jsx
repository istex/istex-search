import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormField from './FormFields/FormField';
import OperatorRequest from './OperatorRequest/OperatorRequest';

function AdvancedSearchForm ({ queryInputHandler }) {
  const initialFieldArray = [{ type: 'field' }];

  const [formFields, setFormFields] = useState(initialFieldArray);
  const [shouldDisplayAddButton, setShouldDisplayAddButton] = useState(false);

  const handleSelectField = (field, index) => {
    const newFormFields = [...formFields];
    newFormFields[index] = { ...field, ...newFormFields[index] };
    setFormFields(newFormFields);
  };

  const addFields = () => {
    setFormFields([...formFields, { type: 'operator' }, { type: 'field' }]);
    setShouldDisplayAddButton(false);
  };

  const removeFields = (index) => {
    console.log({ length: formFields.length, index });
    if (formFields.length === 1) {
      setFormFields(initialFieldArray);
      setShouldDisplayAddButton(false);
      console.log('removeFields', 'premier cas');
    }

    if (formFields.length > 1 && formFields.length > index + 1) {
      console.log('removeFields', 'deuxieme cas');
      const removeValFrom = [index, index + 1];
      const newFormFields = formFields.filter((value, index) => removeValFrom.indexOf(index) === -1);
      setFormFields(newFormFields);
    }

    if (formFields.length > 1 && formFields.length === index + 1) {
      console.log('removeFields', 'troisieme cas');
      const removeValFrom = [index, index - 1];
      const newFormFields = formFields.filter((value, index) => removeValFrom.indexOf(index) === -1);
      setFormFields(newFormFields);
    }
  };

  console.log('AdvancedSearchForm', { formFields });

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
            />
          );
        } else {
          return (
            <div
              key={`operator-request-${index}`}
              className='w-1/2 mb-2'
            >
              <OperatorRequest />
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
            Ajouter une recherche
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
