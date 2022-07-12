import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Format from '../Format/Format';
import Usage from '../Usage/Usage';
import { setSelectedFormats, setUsage } from '../../store/istexApiSlice';
import { buildExtractParamsFromFormats, deselectFormat, isFormatSelected, selectFormat } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { formats, usages } from '../../config';
import TitleSection from '../TitleSection/TitleSection';

export default function UsageSection() {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const usage = useSelector(state => state.istexApi.usage);

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

    eventEmitter.emit(events.setSelectedFormats, newSelectedFormats);
  };

  const isWholeCategorySelected = formatCategory => {
    const wholeCategoryFormat = getWholeCategoryFormat(formatCategory);

    return isFormatSelected(selectedFormats, wholeCategoryFormat);
  };

  const selectedFormatsHandler = newSelectedFormats => {
    dispatch(setSelectedFormats(newSelectedFormats));
    eventEmitter.emit(events.setSelectedFormatsInLastRequestOfHistory, newSelectedFormats);

    const extractParams = buildExtractParamsFromFormats(newSelectedFormats);
    eventEmitter.emit(events.setExtractUrlParam, extractParams);
  };

  const usageHandler = newUsage => {
    dispatch(setUsage(newUsage));

    eventEmitter.emit(events.setUsageUrlParam, newUsage);
    eventEmitter.emit(events.setUsageInLastRequestOfHistory, newUsage);
  };

  useEffect(() => {
    eventEmitter.addListener(events.setSelectedFormats, selectedFormatsHandler);
    eventEmitter.addListener(events.setUsage, usageHandler);
  }, []);

  return (
    <>
      <TitleSection
        title='Usage'
        num='1'
        infoTextTitle=''
        infoTextContent=''
      />
      <div style={{ display: 'flex' }}>
        {Object.keys(usages).map(usageName => (
          <div key={usageName} style={{ border: 'solid black 1px' }}>
            <Usage
              name={usageName}
              formats={usages[usageName].selectedFormats}
            />
            {/* Check if the current usage being rendered (usageName) and the current selected usage (currentUsage)
            are both the custom usage */}
            {(usageName === 'customUsage' && usage === 'customUsage') && (
              <div>
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
            )}
          </div>
        ))}
      </div>
    </>
  );
}
