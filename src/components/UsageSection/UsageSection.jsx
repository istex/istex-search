import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import Format from '../Format/Format';
import Usage from '../Usage/Usage';
import { setSelectedFormats, setUsage } from '../../store/istexApiSlice';
import { buildExtractParamsFromFormats, deselectFormat, isFormatSelected, selectFormat } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { formats, usages } from '../../config';
import TitleSection from '../TitleSection/TitleSection';
import { ChevronLeftIcon } from '@heroicons/react/solid';

export default function UsageSection () {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const usage = useSelector(state => state.istexApi.usage);
  const [shouldDisplayUsage, setShouldDisplayUsage] = useState(true);
  const [hasClickOnSubCategory, setHasClickOnSubCategory] = useState(false);

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
    <div className='my-12'>
      <TitleSection
        title='Usage'
        num='2'
        infoTextTitle=''
        infoTextContent=''
      />
      <p>Cliquez sur l’usage visé pour votre corpus :</p>
      {!shouldDisplayUsage && (
        <h4
          className='flex justify-start items-center cursor-pointer text-[#458ca5] text-xl font-semibold border-t-[1px] border-b-[1px] border-black mt-4 p-2'
          onClick={() => { setShouldDisplayUsage(true); }}
        >
          <ChevronLeftIcon className='h-4 w-4' />{' '}
          <span className=''>Usage personnalisé</span>
        </h4>
      )}
      <div className='flex mt-4 justify-between w-full'>
        {Object.keys(usages).map(usageName => (
          <div
            key={usageName}
          >
            <Usage
              name={usageName}
              label={usages[usageName].label}
              formats={usages[usageName].selectedFormats}
            />
            {/* Check if the current usage being rendered (usageName) and the current selected usage (currentUsage)
            are both the custom usage */}
            {(usageName === 'customUsage' && usage === 'customUsage') && (
              <div className='flex'>
                {Object.keys(formats).map(formatCategory => {
                  // Cases of covers and annexes which are not in a category
                  if (Number.isInteger(formats[formatCategory])) {
                    return (
                      <div key={formatCategory} className='mx-10 font-semibold capitalize'>
                        <Format className='font-bold capitalize' name={formatCategory} value={formats[formatCategory]} />
                      </div>
                    );
                  }

                  return (
                    <div key={formatCategory} className='mx-10'>
                      <input
                        type='checkbox'
                        name={formatCategory}
                        onChange={toggleWholeCategory}
                        checked={isWholeCategorySelected(formatCategory)}
                        className={`mr-2 w-5 h-5 outline-none rounded border-gray-400 accent-[#a9bb1e] p-2 ${hasClickOnSubCategory ? 'bg-pink' : ''}`}
                      />
                      <label
                        htmlFor={formatCategory}
                        className='font-bold capitalize'
                      >
                        {formatCategory}
                      </label>
                      {Object.entries(formats[formatCategory]).map(([formatName, formatValue]) => (
                        <Format
                          key={formatName}
                          name={formatName}
                          value={formatValue}
                          className='pl-5'
                          setHasClickOnSubCategory={setHasClickOnSubCategory}
                        />
                      ))}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
