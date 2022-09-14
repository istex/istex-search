import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { ChevronLeftIcon } from '@heroicons/react/solid';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Format from '../Format/Format';
import { formats as formatInfoText } from '../Format/infoTooltip';
import Usage from '../Usage/Usage';
import { setSelectedFormats, setUsage } from '../../store/istexApiSlice';
import { buildExtractParamsFromFormats, deselectFormat, isFormatSelected, noFormatSelected, resetFormatSelected, selectFormat } from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { formats, usages } from '../../config';
import TitleSection from '../TitleSection/TitleSection';

export default function UsageSection () {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const usage = useSelector(state => state.istexApi.usage);
  const [shouldDisplayUsage, setShouldDisplayUsage] = useState(true);

  const handleDisplayingOfUsage = usageName => setShouldDisplayUsage(usageName !== 'customUsage');

  const getWholeCategoryFormat = categoryName => {
    if (!formats[categoryName]) return 0;

    let wholeCategoryFormat = 0;
    for (const formatName in formats[categoryName].formats) {
      wholeCategoryFormat = selectFormat(wholeCategoryFormat, formats[categoryName].formats[formatName].value);
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

  const selectedFormatsHandler = (newSelectedFormats) => {
    // if user resets form
    const isResetForm = newSelectedFormats === resetFormatSelected();
    if (isResetForm) {
      setShouldDisplayUsage(true);
    }

    dispatch(setSelectedFormats(newSelectedFormats));
    eventEmitter.emit(events.setSelectedFormatsInLastRequestOfHistory, isResetForm ? noFormatSelected() : newSelectedFormats);

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
        infoTextContent={
          <p className='text-sm text-white'>
            Le choix du mode "Usage<br />
            personnalisé" donne accès à tous les<br />
            types de fichiers et de formats<br />
            existants dans ISTEX. En revanche, le<br />
            choix d’une plateforme ou d’un outil<br />
            particuliers induit une sélection<br />
            automatique des formats et types de<br />
            fichiers qui seront extraits.<br />
            Voir la <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#usage_1'>documentation ISTEX </a>.
          </p>
        }
      />
      <p className='text-sm md:text-base'>Cliquez sur l’usage visé pour votre corpus :</p>
      {!shouldDisplayUsage && (
        <div
          className='text-istcolor-blue text-xl font-semibold border-t-[1px] border-b-[1px] border-istcolor-black mt-4 p-2'
        >
          <span className='cursor-pointer font-[16px]' onClick={() => { setShouldDisplayUsage(true); }}>
            <ChevronLeftIcon className='inline h-6 w-6' />{' '}
            <span className='text-sm font-semibold'>Usage personnalisé</span>
          </span>
        </div>
      )}
      <div className='flex flex-col md:flex-row mt-4'>
        {Object.keys(usages).map(usageName => (
          <div
            key={usageName}
          >
            {shouldDisplayUsage && (
              <div onClick={() => { handleDisplayingOfUsage(usageName); }}>
                <Usage
                  name={usageName}
                  label={usages[usageName].label}
                  formats={usages[usageName].selectedFormats}
                  setShouldDisplayUsage={setShouldDisplayUsage}
                />
              </div>
            )}
            {/* Check if the current usage being rendered (usageName) and the current selected usage (currentUsage)
            are both the custom usage */}
            {(usageName === 'customUsage' && usage === 'customUsage') && !shouldDisplayUsage && (
              <div className='flex flex-col md:flex-row gap-x-8 gap-y-4'>
                {Object.keys(formats).map(formatCategory => {
                  // Cases of covers and annexes which are not in a category
                  if (formats[formatCategory].value !== undefined) {
                    return (
                      <div key={formatCategory} className='font-semibold capitalize mx-5 md:mx-0'>
                        <Format
                          isSubCategory={false}
                          className='font-bold capitalize'
                          name={formats[formatCategory].label}
                          value={formats[formatCategory].value}
                          infoText={formatInfoText[formatCategory].infoText}
                        />
                      </div>
                    );
                  }

                  return (
                    <div
                      key={formatCategory}
                      className='mx-5'
                    >
                      <div className='flex items-center mb-4'>
                        <input
                          type='checkbox'
                          name={formatCategory}
                          onChange={toggleWholeCategory}
                          checked={isWholeCategorySelected(formatCategory)}
                          id={`checkbox-${formatCategory}`}
                          value=''
                          className='w-5 h-5 outline-none border-istcolor-grey-dark bg-gray-100 text-istcolor-green-light rounded focus:ring-isistcolor-green-light'
                        />
                        <label
                          htmlFor={`checkbox-${formatCategory}`}
                          className='flex items-center font-bold capitalize pl-2'
                        >
                          {formats[formatCategory].label}
                          <Tooltip
                            trigger='click'
                            content={formatInfoText[formatCategory].infoText}
                          >
                            <button>
                              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue pl-2 cursor-pointer' />
                            </button>
                          </Tooltip>
                        </label>
                      </div>
                      {Object.keys(formats[formatCategory].formats).map(formatName => (
                        <Format
                          key={formats[formatCategory]?.formats[formatName]?.label}
                          name={formats[formatCategory]?.formats[formatName]?.label}
                          value={formats[formatCategory]?.formats[formatName]?.value}
                          infoText={formatInfoText[formatCategory]?.formats[formatName]?.infoText}
                          className='pl-5'
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
