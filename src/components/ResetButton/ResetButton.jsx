import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useResetForm from '@/hooks/resetForm';

export default function ResetButton () {
  const resetForm = useResetForm();

  return (
    <div
      className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-1.5 text-istcolor-black'
      onClick={resetForm}
    >
      <div>
        <FontAwesomeIcon icon='eraser' className='text-3xl md:text-4xl' />
      </div>
      <span className='text-center align-top'>Réinitialiser</span>
    </div>
  );
}
