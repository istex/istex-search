import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { examples } from '@/config';

import useResetForm from '@/features/resetForm/useResetForm';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function ExampleList ({ onClose }) {
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();

  const fillFormFromExample = queryString => {
    resetForm();

    eventEmitter.emit(events.setQueryString, queryString);

    onClose();
  };

  return (
    <div className='flex flex-col gap-3'>
      {examples.map(({ label, queryString }) => (
        <div key={label} className='flex gap-4'>
          <Tooltip content='Essayez cette requête'>
            <button onClick={() => fillFormFromExample(queryString)}>
              <FontAwesomeIcon icon='magnifying-glass' className='text-2xl' />
            </button>
          </Tooltip>
          <span>{label}</span>
        </div>
      ))}
    </div>
  );
}

ExampleList.propTypes = {
  onClose: PropTypes.func.isRequired,
};
