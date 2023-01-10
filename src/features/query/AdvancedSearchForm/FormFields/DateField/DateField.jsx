import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import { Spinner } from 'flowbite-react';

function DateField ({ data, updateQuery, onChange, onCloseChoiceInputModal }) {
  const [value, setValue] = useState('');
  const [selectedOption, setSelectedOption] = useState(null);
  const [intervalInputMaxValue, setIntervalInputMaxValue] = useState(100);
  const [intervalInputMinValue, setIntervalInputMinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [optionsValue, setOptionsValue] = useState([]);

  const handleChange = (item) => {
    // item.value is of type number and needs to be casted to a string to be set in value
    setValue(`${item.value}`);
    setSelectedOption(item);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`https://api.istex.fr/document/?q=*&facet=${data.dataValue}`);
        const jsonResponse = await response.json();

        setIntervalInputMinValue(parseInt(
          jsonResponse.aggregations[data.dataValue].buckets[0].fromAsString ||
          jsonResponse.aggregations[data.dataValue].buckets[0].from,
        ));
        setIntervalInputMaxValue(parseInt(
          jsonResponse.aggregations[data.dataValue].buckets[0].toAsString ||
          jsonResponse.aggregations[data.dataValue].buckets[0].to,
        ));
      } catch (error) {
        console.error('error', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    setLoading(true);
    const optionsValue = [];

    for (let i = intervalInputMaxValue; i >= intervalInputMinValue; i--) {
      optionsValue.push({
        value: i, label: `${i}`,
      });
    }

    setOptionsValue(optionsValue);
    setLoading(false);
  }, [intervalInputMaxValue, intervalInputMinValue]);

  // Change the value in realtime inside search input
  useEffect(() => {
    onChange(value);
  }, [value, onChange]);

  const customStyles = {
    control: (base, state) => ({
      ...base,
      boxShadow: 'none',
      borderColor: state.isFocused && 'none',
      // You can also use state.isFocused to conditionally style based on the focus state
    }),
  };

  return (
    <div className='flex flex-col justify-between'>
      <div className='mb-2'>
        {
          isLoading
            ? (
              <div className='flex justify-center'>
                <Spinner
                  color='success'
                  aria-label='loader fetch data'
                />
              </div>
              )
            : (
              <Select
                name={data.dataValue}
                options={optionsValue}
                onChange={event => handleChange(event)}
                value={selectedOption}
                className='mb-4'
                styles={customStyles}
                placeholder='YYYY'
              />
              )
        }
      </div>
      <div className='text-center font-montserrat font-medium'>
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

DateField.propTypes = {
  data: PropTypes.object,
  updateQuery: PropTypes.func,
  onChange: PropTypes.func,
  onCloseChoiceInputModal: PropTypes.func,
};

export default DateField;
