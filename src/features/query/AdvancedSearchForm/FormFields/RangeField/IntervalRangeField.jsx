import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Spinner } from 'flowbite-react';

import RangeField from './RangeField';

function IntervalRangeField ({
  data,
  updateValueOfSearchInput,
  onCloseChoiceInputModal,
  updateQuery,
}) {
  const [intervalInputMaxValue, setIntervalInputMaxValue] = useState(100);
  const [intervalInputMinValue, setIntervalInputMinValue] = useState(0);
  const [isLoading, setLoading] = useState(true);

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
        setLoading(false); // stop loading when data is fetched
      } catch (error) {
        console.error('error', error);
      }
    };

    fetchData();
  }, []);

  return isLoading
    ? (
      <div className='flex justify-center'>
        <Spinner
          color='success'
          aria-label='loader fetch data'
        />
      </div>
      )
    : (
      <RangeField
        intervalInputData={data}
        step={1}
        min={intervalInputMinValue}
        max={intervalInputMaxValue}
        onCloseChoiceInputModal={onCloseChoiceInputModal}
        onChange={({ min, max }) => {
          updateValueOfSearchInput(() => {
            return `${data.dataTitle} de ${min} à ${max}`;
          });
        }}
        updateQuery={updateQuery}
      />
      );
}

IntervalRangeField.propTypes = {
  data: PropTypes.object,
  updateValueOfSearchInput: PropTypes.func,
  updateQuery: PropTypes.func,
  onCloseChoiceInputModal: PropTypes.func,
};

export default IntervalRangeField;
