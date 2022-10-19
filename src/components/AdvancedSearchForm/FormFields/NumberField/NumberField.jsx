import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

function NumberField ({ data, updateQuery, onChange, onCloseChoiceInputModal }) {
  const [value, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  // Change the value in realtime inside search input
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  return (
    <div className='flex flex-col justify-between'>
      <div className='mb-2'>
        <input
          name={data.dataValue}
          placeholder='Entrer votre valeur'
          onChange={event => handleChange(event)}
          value={value}
          type='number'
          className='border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium focus:outline-none'
        />
      </div>

      <div className='text-center'>
        <button
          type='button'
          className={`p-2 ml-2 text-white bg-istcolor-blue border focus:ring-4 focus:outline-none ${value === '' ? 'bg-istcolor-grey-medium cursor-not-allowed' : 'border-istcolor-blue cta1'}`}
          disabled={value === ''}
          onClick={(e) => {
            e.preventDefault();
            updateQuery(`${data.dataValue}:${value}`, value);
          }}
        >
          Valider
        </button>
        <button
          type='button'
          className='p-2 ml-2 text-white bg-istcolor-red border border-istcolor-red cta2 focus:ring-4 focus:outline-none'
          onClick={() => {
            onCloseChoiceInputModal();
          }}
        >
          Annuler
        </button>
      </div>
    </div>
  );
}

NumberField.propTypes = {
  data: PropTypes.object,
  updateQuery: PropTypes.func,
  onChange: PropTypes.func,
  onCloseChoiceInputModal: PropTypes.func,
};

export default NumberField;
