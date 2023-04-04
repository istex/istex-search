import React, { useRef } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

export default function SectionTitle ({ num, title, infoTextContent }) {
  const buttonRef = useRef(null);

  // The only way to close the tooltip is to click on button which opened the tooltip.
  // This seems to be a bug inside flowbite which prevents tooltips from closing once
  // they catch focus (either by getting clicked or with tab).
  const closeTooltip = () => {
    buttonRef?.current?.click();
  };

  return (
    <div className='flex justify-between items-center pb-[5px] text-istcolor-black mt-2 mb-2 border-b-2 border-istcolor-black'>
      <h3 className='flex title-3 text-center'>
        <span className='rounded-full bg-istcolor-green-dark w-10 h-10 mr-2'>
          {`${num}.`}
        </span>
        <span>{title}</span>
      </h3>
      <Tooltip
        trigger='click'
        content={
          <>
            <div className='flex w-full justify-end relative left-1'>
              <button type='button' onClick={closeTooltip} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                <span className='sr-only'>Fermer l'info bulle</span>
                <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            {infoTextContent}
          </>
        }
      >
        <button ref={buttonRef}>
          <FontAwesomeIcon icon='circle-info' size='2x' className='text-istcolor-blue cursor-pointer' />
        </button>
      </Tooltip>
    </div>
  );
}

SectionTitle.propTypes = {
  num: PropTypes.string,
  title: PropTypes.string,
  infoTextContent: PropTypes.node,
};
