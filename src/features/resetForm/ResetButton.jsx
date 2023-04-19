import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

import useResetForm from './useResetForm';

export default function ResetButton () {
  const resetForm = useResetForm();

  return (
    <Tooltip
      content={(
        <div className='max-w-[8rem]'>
          Effacez tout pour redémarrer avec un formulaire vide
        </div>
      )}
    >
      <button
        className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-2.5 h-[4.75rem] text-istcolor-black'
        onClick={resetForm}
      >
        <div>
          <FontAwesomeIcon icon='eraser' className='text-3xl md:text-4xl' />
        </div>
        <span className='text-center align-top'>Réinitialiser</span>
      </button>
    </Tooltip>
  );
}
