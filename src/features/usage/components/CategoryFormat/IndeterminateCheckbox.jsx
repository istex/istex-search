import React, { useEffect } from 'react';
import PropTypes from 'prop-types';

export default function IndeterminateCheckbox ({
  formatCategory,
  onChange,
  checked,
  indeterminate,
}) {
  const checkboxRef = React.useRef();

  useEffect(() => {
    checkboxRef.current.indeterminate = indeterminate;
  }, [indeterminate]);

  return (
    <input
      ref={checkboxRef}
      type='checkbox'
      name={formatCategory}
      onChange={onChange}
      checked={checked}
      id={`checkbox-${formatCategory}`}
      value=''
      className={`${indeterminate ? '!bg-istcolor-blue ' : ''}w-5 h-5 border-[2px] border-istcolor-grey-light text-istcolor-green-light bg-gray-100 rounded focus:ring-transparent focus:border-istcolor-grey-light checked:border-istcolor-grey-light`}
    />
  );
}

IndeterminateCheckbox.propTypes = {
  formatCategory: PropTypes.string,
  onChange: PropTypes.func,
  checked: PropTypes.bool,
  indeterminate: PropTypes.bool,
};
