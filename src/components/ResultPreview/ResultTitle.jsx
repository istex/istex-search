import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export default function ResultTitle ({ shouldDisplayResultDetail, setShouldDisplayResultDetail }) {
  const handleClick = () => {
    if (!shouldDisplayResultDetail) {
      return;
    }

    setShouldDisplayResultDetail(false);
  };
  const tooltipCloseButton = useRef();
  const onCloseClick = () => {
    tooltipCloseButton.current.click();
  };

  return (
    <h4 className='font-semibold border-[#303030] border-b-[1px] mb-4'>
      <span className={`${shouldDisplayResultDetail && 'cursor-pointer'} flex justify-between flex-row`} onClick={handleClick}>Parcourir les résultats
        <Tooltip
          trigger='click'
          content={
            <>
              <div className='max-w-[22rem]'>
                <div className='flex w-full justify-end relative left-1'>
                  <button type='button' onClick={() => onCloseClick()} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <p>
                  L'exploration des résultats peut vous aider à ajuster
                  votre équation à votre besoin en vous offrant par un simple clic l’accès aux formats proposés
                  pour chacun des documents. Par défaut, sont affichés les résultats classés selon des critères de pertinence &
                  qualité par rapport à votre requête.
                  Le choix d’un autre mode de tri modifiera l'ordre proposé en conséquence.
                </p>
              </div>
            </>
            }
        >
          <button className='scale-125' ref={(ref) => { tooltipCloseButton.current = ref; }}>
            <FontAwesomeIcon icon='circle-info' size='1x' className='text-istcolor-blue pl-2 cursor-pointer' />
          </button>
        </Tooltip>
      </span>{' '}
      {shouldDisplayResultDetail && <span className='text-istcolor-grey-medium'>/ Document ISTEX</span>}
    </h4>
  );
}

ResultTitle.propTypes = {
  shouldDisplayResultDetail: PropTypes.bool,
  setShouldDisplayResultDetail: PropTypes.func,
};
