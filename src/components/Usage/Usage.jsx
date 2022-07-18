import React from 'react';
import PropTypes from 'prop-types';
import { useSelector } from 'react-redux';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { RadioGroup } from '@headlessui/react';

export default function PredefinedUsage({ name, formats }) {
  console.log('PredefinedUsage', { name });
  const usage = useSelector(state => state.istexApi.usage);

  const usageChangedHandler = value => {
    const newUsage = value;

    eventEmitter.emit(events.setSelectedFormats, formats);
    eventEmitter.emit(events.setUsage, newUsage);
  };

  const CheckIcon = (props) => {
    return (
      <svg viewBox='0 0 24 24' fill='none' {...props}>
        <circle cx={12} cy={12} r={12} fill='#fff' opacity='0.2' />
        <path
          d='M7 13l3 3 7-7'
          stroke='#fff'
          strokeWidth={1.5}
          strokeLinecap='round'
          strokeLinejoin='round'
        />
      </svg>
    );
  };

  return (
    <div>
      <RadioGroup
        value={usage}
        onChange={usageChangedHandler}
        className='h-30 w-30 mr-5'
        name='usages'
      >
        <RadioGroup.Option
          value={name}
          className='flex relative flex-col text-xl justify-between items-center focus:outline-none h-64 w-72'
        >
          {({ active, checked }) => (
            <div className='flex flex-col justify-between w-full h-full bg-white border-double border-2 cursor-pointer '>
              <div className='flex flex-col items-center justify-between'>
                <div className='flex flex-col items-center'>
                  <div className='flex flex-col justify-center items-center p-10'>
                    <RadioGroup.Label
                      as='p'
                      className='text-2xl text-gray-900 mt-8 font-semibold'
                    >
                      {name}
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
              <div className={`flex justify-around text-white p-4 ${checked ? ' bg-[#c4d733]' : 'bg-[#458ca5]'} w-full`}>
                {checked && (
                  <div className='shrink-0'>
                    <CheckIcon className='h-6 w-6' />
                  </div>
                )}
                <p>
                  {checked ? 'Usage sélectioné' : 'Choisir cet usage'}
                </p>
              </div>
              <div className='absolute right-1 top-1 border-[1px] p-2 border-gray-400'>
                <p className='text-sm'>TDM</p>
              </div>
              {name === 'customUsage' && (
                <div className='absolute right-1 top-10 border-[1px] p-2 border-gray-400'>
                  <p className='text-sm'>DOC</p>
                </div>
              )}
            </div>
          )}
        </RadioGroup.Option>
      </RadioGroup>
    </div>
  );
}

PredefinedUsage.propTypes = {
  name: PropTypes.string,
  formats: PropTypes.number,
};
