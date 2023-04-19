import React from 'react';
import { Tooltip } from 'flowbite-react';

import ResetButton from '@/features/resetForm/ResetButton';
import FetchButton from '@/features/fetch/FetchButton';
import ShareButton from '@/features/share/ShareButton';
import HistoryButton from '@/features/history/HistoryButton';

export default function BottomMenu () {
  return (
    <div className='!fixed border-0 w-full bottom-0 left-0 bg-istcolor-green-dark py-0.5 h-20 z-10'>
      <div className='flex justify-center gap-2 md:gap-x-14 items-center'>
        <ResetButton />
        <Tooltip
          content={(
            <div className='max-w-[8rem] text-center'>
              Récupérez l'état en cours de votre formulaire
            </div>
          )}
        >
          <button>
            <FetchButton />
          </button>
        </Tooltip>
        {/* We don't use button here because of bug. the button adds a focus
          to the click which prevents the tooltip from disappearing after opening the modal */}
        <div>
          <ShareButton />
        </div>
        {/* We don't use button here because of bug. the button adds a focus
          to the click which prevents the tooltip from disappearing after opening the modal */}
        <div>
          <HistoryButton />
        </div>
      </div>
    </div>
  );
}
