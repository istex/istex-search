import React, { useEffect, useState, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

import Usage from '@/features/usage/Usage';
import SectionTitle from '@/components/SectionTitle';
import CategoryFormat from '@/features/usage/CategoryFormat';
import NoCategoryFormat from '@/features/usage/NoCategoryFormat';

import { setSelectedFormats, setUsage } from '@/store/istexApiSlice';
import { buildExtractParamsFromFormats, deselectFormat, isFormatSelected, selectFormat, getWholeCategoryFormat } from '@/lib/formats';
import { formats, usages } from '@/config';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function UsageSection () {
  const dispatch = useDispatch();
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const usage = useSelector(state => state.istexApi.usage);
  const [shouldDisplayUsage, setShouldDisplayUsage] = useState(true);
  const [showLowerTooltipContent, setShowLowerTooltipContent] = useState(true);
  const toolTipButton = useRef(null);
  const firstUpdate = useRef(true);
  const { eventEmitter, events } = useEventEmitterContext();

  const simulateClick = () => {
    toolTipButton.current?.click();
  };

  const handleDisplayingOfUsage = usageName => setShouldDisplayUsage(usageName !== 'customUsage');

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
    dispatch(setSelectedFormats(newSelectedFormats));
    eventEmitter.emit(events.setSelectedFormatsInLastRequestOfHistory, newSelectedFormats);

    const extractParams = buildExtractParamsFromFormats(newSelectedFormats);
    eventEmitter.emit(events.setExtractUrlParam, extractParams);
  };

  const usageHandler = newUsage => {
    // newUsage is an empty string when the format gets reset and we want to display
    // the different usages again in that case
    if (newUsage === '') {
      setShouldDisplayUsage(true);
    }

    dispatch(setUsage(newUsage));

    eventEmitter.emit(events.setUsageUrlParam, newUsage);
    eventEmitter.emit(events.setUsageInLastRequestOfHistory, newUsage);
  };

  useEffect(() => {
    if (!firstUpdate.current) simulateClick();
    firstUpdate.current = false;
  }, [showLowerTooltipContent]);

  useEffect(() => {
    eventEmitter.addListener(events.setSelectedFormats, selectedFormatsHandler);
    eventEmitter.addListener(events.setUsage, usageHandler);

    return () => {
      eventEmitter.removeListener(events.setSelectedFormats, selectedFormatsHandler);
      eventEmitter.removeListener(events.setUsage, usageHandler);
    };
  }, []);

  return (
    <div className='my-12'>
      <SectionTitle
        title='Usage'
        num='2'
        infoTextContent={
          <p className='text-sm text-white'>
            Le choix du mode "Usage <br />
            personnalisé" donne accès à<br />
            tous les types de fichiers<br />
            et de formats existants dans<br />
            Istex.<br />
            En revanche, le choix d’une<br />
            plateforme ou d’un outil<br />
            particuliers induit une<br />
            sélection automatique des<br />
            formats et types de fichiers<br />
            qui seront extraits.<br />
            Attention : les publications<br />
            Istex ne possèdent pas toutes<br />
            l’ensemble des types de fichiers<br />
            et de formats possibles<br />
            (notamment annexes,<br />
            couvertures ou enrichissements).<br />
            Voir la <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#usage' rel='noreferrer'>documentation Istex</a>.
          </p>
        }
      />
      <p>Cliquez sur l’usage visé pour votre corpus :</p>
      {!shouldDisplayUsage && (
        <div
          className='flex justify-start text-istcolor-blue text-xl font-semibold border-t-[1px] border-b-[1px] border-istcolor-black mt-4 mb-5 p-2'
        >
          <span className='cursor-pointer' onClick={() => { setShouldDisplayUsage(true); }}>
            <FontAwesomeIcon icon='angle-left' />{' '}
            <span className='text-base'>Usage personnalisé</span>
          </span>

          <Tooltip
            trigger='click'
            content={
              <div className='max-w-[14rem]'>
                <div className='flex justify-end relative left-1'>
                  <button type='button' onClick={() => setShowLowerTooltipContent(!showLowerTooltipContent)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <p className='text-sm text-white'>
                  Les différents formats et types de fichiers disponibles sont décrits
                  succinctement dans cette interface et plus complètement dans
                  <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/tdm/annexes/liste-des-formats.html' rel='noreferrer'> cette annexe</a> de la documentation Istex.
                  <br />
                  Les particularités de sélection associées aux formats TXT et CLEANED sont à découvrir dans la <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#usage-_1' rel='noreferrer'>documentation Istex</a>.
                </p>
              </div>
            }
          >
            <button className='pl-2 w-fit h-2 relative top-[0.3em]' ref={toolTipButton}>
              <FontAwesomeIcon icon='circle-info' size='1x' className='text-istcolor-blue cursor-pointer' />
            </button>
          </Tooltip>
        </div>
      )}
      <div className='grid grid-cols-2 gap-6 lg:gap-3 lg:grid-cols-4 mt-4'>
        {Object.keys(usages).map(usageName => (
          <div
            key={usageName}
          >
            {shouldDisplayUsage && (
              <div className='h-full' onClick={() => { handleDisplayingOfUsage(usageName); }}>
                <Usage usageInfo={{ name: usageName, ...usages[usageName] }} />
              </div>
            )}
            {/* Check if the current usage being rendered (usageName) and the current selected usage (currentUsage)
            are both the custom usage */}
            {(usageName === 'customUsage' && usage === 'customUsage') && !shouldDisplayUsage && (
              <div className='grid grid-cols-3 gap-x-44'>
                <div className='p-[5px]'>
                  <CategoryFormat
                    formatCategory='fulltext'
                    toggleWholeCategory={toggleWholeCategory}
                    isWholeCategorySelected={isWholeCategorySelected}
                    formats={formats}
                  />
                </div>
                <div className='flex flex-col justify-around p-[5px]'>
                  <CategoryFormat
                    formatCategory='metadata'
                    toggleWholeCategory={toggleWholeCategory}
                    isWholeCategorySelected={isWholeCategorySelected}
                    formats={formats}
                  />
                  <NoCategoryFormat
                    formatCategory='annexes'
                    formats={formats}
                  />
                  <NoCategoryFormat
                    formatCategory='covers'
                    formats={formats}
                  />
                </div>
                <div className='p-[5px]'>
                  <CategoryFormat
                    formatCategory='enrichments'
                    toggleWholeCategory={toggleWholeCategory}
                    isWholeCategorySelected={isWholeCategorySelected}
                    formats={formats}
                  />
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
