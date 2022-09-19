import React, { useState, useRef, useCallback, useEffect } from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';

import './RangeField.scss';

function RangeField ({
  min,
  max,
  onChange,
  intervalInputData,
  updateQuery,
}) {
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);
  const minValRef = useRef(0);
  const maxValRef = useRef(0);
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback((value) => {
    Math.round(((value - min) / (max - min)) * 100);
  }, [min, max]);

  useEffect(() => {
    setMinVal(min);
    setMaxVal(max);
  }, [min, max]);

  // Set width of the range to decrease from the left side
  useEffect(() => {
    if (maxValRef.current) {
      const minPercent = getPercent(minVal);
      const maxPercent = getPercent(+maxValRef.current.value);
      if (range.current) {
        range.current.style.left = `${minPercent}%`;
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [minVal, getPercent]);

  // Set width of the range to decrease from the right side
  useEffect(() => {
    if (minValRef.current) {
      const minPercent = getPercent(+minValRef.current.value);
      const maxPercent = getPercent(maxVal);

      if (range.current) {
        range.current.style.width = `${maxPercent - minPercent}%`;
      }
    }
  }, [maxVal, getPercent]);

  // Get min and max values when their state changes
  useEffect(() => {
    onChange({ min: minVal, max: maxVal });
  }, [minVal, maxVal, onChange]);

  return (
    <div>
      <div>
        <div className='z-0'>
          <input
            id='minmax-range'
            type='range'
            min={min}
            max={max}
            value={minVal}
            ref={minValRef}
            onChange={(event) => {
              const value = Math.min(+event.target.value, maxVal - 1);
              setMinVal(value);
              event.target.value = value.toString();
            }}
            className={classnames('thumb thumb--zindex-3', {
              'thumb--zindex-5': minVal > max - 100,
            })}
          />
          <input
            type='range'
            min={min}
            max={max}
            value={maxVal}
            ref={maxValRef}
            onChange={(event) => {
              const value = Math.max(+event.target.value, minVal + 1);
              setMaxVal(value);
              event.target.value = value.toString();
            }}
            className='thumb thumb--zindex-4'
          />

          <div className='slider'>
            <div className='slider__track' />
            <div ref={range} className='slider__range' />
            <div className='slider__left-value'>{minVal}</div>
            <div className='slider__right-value'>{maxVal}</div>
          </div>
        </div>
      </div>
      <div
        role='navigation'
        aria-label='menu-principal'
        className='pt-8 text-center'
      >
        <button
          type='button'
          onClick={(e) => {
            e.preventDefault();
            updateQuery(`${intervalInputData.dataValue}:[${minVal} TO ${maxVal}]`);
          }}
          className='p-2 ml-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
        >
          Valider
        </button>
      </div>

    </div>
  );
}

RangeField.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
  intervalInputData: PropTypes.object.isRequired,
  onChange: PropTypes.func.isRequired,
  updateQuery: PropTypes.func.isRequired,
};

export default RangeField;
