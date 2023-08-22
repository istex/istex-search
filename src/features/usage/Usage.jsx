import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RadioGroup } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function Usage ({ usageInfo }) {
  const usage = useSelector(state => state.istexApi.usage);
  const { eventEmitter, events } = useEventEmitterContext();

  const usageChangedHandler = value => {
    const newUsage = value;

    eventEmitter.emit(events.setSelectedFormats, usageInfo.selectedFormats);
    eventEmitter.emit(events.setUsage, newUsage);
  };

  return (
    <RadioGroup
      value={usage}
      onChange={usageChangedHandler}
      className='h-full b-2 md:mb-0 cursor-pointer'
      name='usages'
    >
      <RadioGroup.Option
        value={usageInfo.name}
        className='h-full flex relative flex-col text-xl justify-between items-center focus:outline-none'
      >
        {({ active, checked }) => (
          <>
            <div className={`flex flex-col justify-start items-center w-full h-full py-2 px-4 bg-white border-[3px] border-b-0${checked ? ' border-istcolor-green-dark' : ' border-white'}`}>
              <div className='w-full flex justify-end gap-1'>
                {usageInfo.tags.map(tag => (
                  <span key={tag} className='text-xs font-bold p-2 text-center text-istcolor-grey-link bg-istcolor-white'>{tag}</span>
                ))}
              </div>
              <div className='flex flex-col justify-center items-center h-32'>
                <RadioGroup.Label
                  as='p'
                  className='text-xl text-istcolor-black'
                >
                  {usageInfo.label}
                </RadioGroup.Label>
                {usageInfo.description && (
                  <RadioGroup.Description
                    as='span'
                    className='text-xs text-center pt-3'
                  >
                    {usageInfo.description}
                  </RadioGroup.Description>
                )}
              </div>
            </div>
            <div className={`flex justify-center text-white p-4 ${checked ? ' bg-istcolor-green-dark' : 'bg-istcolor-blue cta1'} w-full`}>
              {checked && (
                <FontAwesomeIcon icon='check' />
              )}
              <p>
                <span className='pl-2 text-sm font-bold'>{checked ? 'Usage sélectionné' : 'Choisir cet usage'}</span>
              </p>
            </div>
          </>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

Usage.propTypes = {
  usageInfo: PropTypes.object,
};
