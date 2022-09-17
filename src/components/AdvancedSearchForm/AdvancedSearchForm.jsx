import React, { useState } from 'react';
import PropTypes from 'prop-types';

import FormField from './FormFields/FormField';

function AdvancedSearchForm ({ queryInputHandler }) {
  const [formFields, setFormFields] = useState([
    { dataValue: '', newValue: '' },
  ]);

  // const addFields = () => {
  //   let object = {
  //     name: '',
  //     age: '',
  //   };

  //   setFormFields([...formFields, object]);
  // };

  // const removeFields = (index) => {
  //   let data = [...formFields];
  //   data.splice(index, 1);
  //   setFormFields(data);
  // };

  return (
    <form>
      {formFields.map((formField, index) => (
        <FormField
          key={index}
          setFormFields={setFormFields}
          queryInputHandler={queryInputHandler}
        />
      ))}
    </form>
  );
}

AdvancedSearchForm.propTypes = {
  queryInputHandler: PropTypes.func,
};

AdvancedSearchForm.defaultProps = {};

export default AdvancedSearchForm;
