import React, { useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

import History from './History';

import './HistoryButton.css';

export default function HistoryButton () {
  const [modalOpen, setModalOpen] = useState(false);

  return (
    <>
      <Tooltip
        content={(
          <div className='max-w-[10rem] text-center'>
            Accédez à l'historique de vos 30 derniers téléchargements
          </div>
        )}
      >
        <div
          className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-2.5 h-[4.75rem] text-istcolor-black'
          onClick={() => setModalOpen(true)}
        >
          <div>
            <FontAwesomeIcon icon='clock-rotate-left' className='text-3xl md:text-4xl' />
          </div>
          <span className='text-center align-top'>Historique</span>
        </div>
      </Tooltip>
      {modalOpen && (
        <History onClose={() => setModalOpen(false)} />
      )}
    </>
  );
}
