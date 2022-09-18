import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';

import RangeField from './RangeField';
import { Spinner } from 'flowbite-react';

function IntervalRangeField ({
  data,
  updateValueOfSearchInput,
  updateQuery,
}) {
  const [intervalInputMaxValue, setIntervalInputMaxValue] = useState(1);
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
        console.log('error', error);
      }
    };

    fetchData();
  }, []);

  return isLoading
    ? (
      <Spinner
        color='success'
        aria-label='Success spinner example'
      />
      )
    : (
      <RangeField
        intervalInputData={data}
        min={intervalInputMinValue}
        max={intervalInputMaxValue}
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
};

export default IntervalRangeField;
