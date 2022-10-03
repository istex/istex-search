import React from 'react';
import PropTypes from 'prop-types';

import TextField from '../FormFields/TextField/TextField';
import NumberField from '../FormFields/NumberField/NumberField';
import DateField from '../FormFields/DateField/DateField';
import IntervalRangeField from '../FormFields/RangeField/IntervalRangeField';

function RetreiveCorrectField (props) {
  let fieldComponent;

  switch (props.typeField) {
    case 'text':
      fieldComponent = (
        <TextField
          {...props}
          onChange={(value) => {
            /** need to have this each time because search input is uncontrolled component */
          }}
        />
      );
      break;
    case 'date':
      fieldComponent = (
        <DateField
          {...props}
          onChange={(value) => {
            /** need to have this each time because search input is uncontrolled component */
          }}
        />
      );
      break;
    case 'number':
      fieldComponent = (
        <NumberField
          {...props}
          onChange={(value) => {
            /** need to have this each time because search input is uncontrolled component */
          }}
        />
      );
      break;
    case 'range':
      fieldComponent = <IntervalRangeField {...props} />;
      break;
    default:
      fieldComponent = null;
      break;
  }

  return fieldComponent;
}

RetreiveCorrectField.propTypes = {
  typeField: PropTypes.string,
};

export default RetreiveCorrectField;
