import React from 'react';
import PropTypes from 'prop-types';

import TextField from '../FormFields/TextField/TextField';
import RangeField from '../FormFields/RangeField/RangeField';

function RetreiveCorrectField ({ field, typeField }) {
  let fieldComponent;

  switch (typeField) {
    case 'text':
      fieldComponent = <TextField />;
      break;
    case 'range':
      fieldComponent = <RangeField />;
      break;
    default:
      break;
  }

  return fieldComponent;
}

RetreiveCorrectField.propTypes = {
  typeField: PropTypes.string,
};

export default RetreiveCorrectField;
