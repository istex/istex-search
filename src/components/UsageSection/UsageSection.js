import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Format from '../Format';
import PredefinedUsage from '../PredefinedUsage';
import { setSelectedFormats } from '../../store/istexApiSlice';
import { buildExtractParamsFromFormats, deselectFormat, isFormatSelected, selectFormat } from '../../lib/istexApi';
import eventEmitter from '../../lib/eventEmitter';
import { formats, predefinedUsages } from '../../config';

export default function UsageSection () {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);

  const getWholeCategoryFormat = categoryName => {
    if (!formats[categoryName]) return 0;

    let wholeCategoryFormat = 0;
    for (const formatName in formats[categoryName]) {
      wholeCategoryFormat = selectFormat(wholeCategoryFormat, formats[categoryName][formatName]);
    }

    return wholeCategoryFormat;
  };

  const toggleWholeCategory = event => {
    const categoryName = event.target.name;

    if (!formats[categoryName]) return;

    const wholeCategoryFormat = getWholeCategoryFormat(categoryName);
    let newSelectedFormats = selectedFormats;

    if (event.target.checked) {
      newSelectedFormats = selectFormat(newSelectedFormats, wholeCategoryFormat);
    } else {
      newSelectedFormats = deselectFormat(newSelectedFormats, wholeCategoryFormat);
    }

    eventEmitter.emit('formatsChanged', newSelectedFormats);
  };

  const isWholeCategorySelected = formatCategory => {
    const wholeCategoryFormat = getWholeCategoryFormat(formatCategory);
    return isFormatSelected(selectedFormats, wholeCategoryFormat);
  };

  const formatsChangedHandler = value => {
    dispatch(setSelectedFormats(value));

    const extractParams = buildExtractParamsFromFormats(value);
    eventEmitter.emit('updateExtractParam', extractParams);
  };

  useEffect(() => {
    eventEmitter.addListener('formatsChanged', formatsChangedHandler);
  }, []);

  return (
    <>
      <h2>Usage</h2>
      <div style={{ display: 'flex' }}>
        <div style={{ border: 'solid black 1px' }}>
          {Object.keys(formats).map(formatCategory => {
            // Cases of covers and annexes which are not in a category
            if (Number.isInteger(formats[formatCategory])) {
              return (
                <div key={formatCategory}>
                  <Format name={formatCategory} value={formats[formatCategory]} />
                </div>
              );
            }

            return (
              <div key={formatCategory}>
                <input
                  type='checkbox'
                  name={formatCategory}
                  onChange={toggleWholeCategory}
                  checked={isWholeCategorySelected(formatCategory)}
                />
                <label htmlFor={formatCategory}>{formatCategory}</label>
                {Object.entries(formats[formatCategory]).map(([formatName, formatValue]) => (
                  <Format key={formatName} name={formatName} value={formatValue} style={{ paddingLeft: '1em' }} />
                ))}
              </div>
            );
          })}
        </div>
        {Object.keys(predefinedUsages).map(predefinedUsageName => (
          <PredefinedUsage
            key={predefinedUsageName}
            name={predefinedUsageName}
            formats={predefinedUsages[predefinedUsageName].selectedFormats}
          />
        ))}
      </div>
    </>
  );
}
