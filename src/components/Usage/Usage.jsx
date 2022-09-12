import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import { RadioGroup } from '@headlessui/react';
import { CheckIcon } from '@heroicons/react/solid';

import eventEmitter, { events } from '../../lib/eventEmitter';
export default function Usage ({ name, formats, label }) {
  const usage = useSelector(state => state.istexApi.usage);

  const usageChangedHandler = value => {
    const newUsage = value;

    eventEmitter.emit(events.setSelectedFormats, formats);
    eventEmitter.emit(events.setUsage, newUsage);
  };

  return (
    <RadioGroup
      value={usage}
      onChange={usageChangedHandler}
      className='mb-2 md:mb-0 md:mr-5'
      name='usages'
    >
      <RadioGroup.Option
        value={name}
        className='flex relative flex-col text-xl justify-between items-center focus:outline-none h-[270px] md:w-[351px]'
      >
        {({ active, checked }) => (
          <div className={`box-content flex flex-col justify-between w-full h-full bg-white border-4 cursor-pointer border-b-0${checked ? ' border-istcolor-green-dark' : ''}`}>
            <div className='flex flex-col items-center justify-between'>
              <div className='flex flex-col items-center'>
                <div className='flex flex-col justify-center items-center p-10'>
                  <RadioGroup.Label
                    as='p'
                    className='text-xl text-gray-900 mt-8 font-semibold'
                  >
                    {label}
                  </RadioGroup.Label>
                  <RadioGroup.Description
                    as='span'
                  >
                    {name === 'lodex' && (
                      <span className='text-xs pt-4'>
                        Analyse graphique / Exploration de corpus
                      </span>
                    )}
                  </RadioGroup.Description>
                </div>
              </div>
            </div>
            <div className={`flex justify-center text-white p-4 ${checked ? ' bg-istcolor-green-dark' : 'bg-[#458ca5]'} w-full`}>
              {checked && (
                <CheckIcon className='h-6 w-6' />
              )}
              <p>
                {checked ? <span className='pl-2'>Usage sélectioné</span> : <span className='pl-2'>Choisir cet usage</span>}
              </p>
            </div>
            <div className='absolute right-2 top-2 p-2 text-center text-[#4a4a4a] bg-[#f0f0f0]'>
              <p className='text-sm'>TDM</p>
            </div>
            {name === 'customUsage' && (
              <div className='absolute right-2 top-11 p-2 text-center text-[#4a4a4a] bg-[#f0f0f0]'>
                <p className='text-sm'>DOC</p>
              </div>
            )}
          </div>
        )}
      </RadioGroup.Option>
    </RadioGroup>
  );
}

Usage.propTypes = {
  name: PropTypes.string,
  label: PropTypes.string,
  formats: PropTypes.number,
};
