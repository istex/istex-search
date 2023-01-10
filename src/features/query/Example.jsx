import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import useResetForm from '@/features/resetForm/useResetForm';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function Example ({ info, closeModal }) {
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();

  const fillFormFromExample = () => {
    resetForm();

    eventEmitter.emit(events.setQueryString, info.queryString);

    closeModal();
  };

  return (
    <div className='flex min-h-[2.75rem] text-istcolor-grey-link'>
      <div className='flex flex-col justify-around'>
        <Tooltip content='Essayez cette requête'>
          <button onClick={fillFormFromExample}>
            <FontAwesomeIcon icon='magnifying-glass' className='text-2xl' />
          </button>
        </Tooltip>
      </div>
      <span className='flex flex-col justify-around ml-5 text-sm'>{info.label}</span>
    </div>
  );
}

Example.propTypes = {
  info: PropTypes.shape({
    label: PropTypes.string.isRequired,
    queryString: PropTypes.string.isRequired,
  }),
  closeModal: PropTypes.func.isRequired,
};
