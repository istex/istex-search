import React from 'react';
import { Tooltip } from 'flowbite-react';

import ResetButton from '../ResetButton/ResetButton';
import FetchButton from '../FetchButton/FetchButton';
import ShareButton from '../ShareButton/ShareButton';
import HistoryButton from '../HistoryButton/HistoryButton';

export default function Navbar () {
  const defaultClassName = 'flex flex-col justify-between items-center cursor-pointer hover:text-white text-istcolor-black';
  const sizeIcon = 'text-3xl md:text-4xl';
  const fontSizeText = 'text-center text-[14px] md:text-base align-top';

  return (
    <div className='!fixed border-0 w-full bottom-0 left-0 bg-istcolor-blue py-2'>
      <div className='flex justify-center gap-2 md:gap-x-16 items-center'>
        <Tooltip
          content={(
            <div className='max-w-[12rem] text-center'>
              Effacez tout pour redémarrer avec un formulaire vide
            </div>
          )}
        >
          <button>
            <ResetButton className={defaultClassName} sizeIcon={sizeIcon} fontSizeText={fontSizeText} />
          </button>
        </Tooltip>
        <Tooltip
          content={(
            <div className='max-w-[12rem] text-center'>
              Récupérez l'état en cours de votre formulaire
            </div>
          )}
        >
          <button>
            <FetchButton className={defaultClassName} sizeIcon={sizeIcon} fontSizeText={fontSizeText} />
          </button>
        </Tooltip>
        <Tooltip
          content={(
            <div className='max-w-[12rem] text-center'>
              Activez cette fonctionnalité en complétant le formulaire et partagez votre corpus avant de le télécharger
            </div>
          )}
        >
          <button>
            <ShareButton sizeIcon={sizeIcon} fontSizeText={fontSizeText} />
          </button>
        </Tooltip>
        <Tooltip
          content={(
            <div className='max-w-[12rem] text-center'>
              Accédez à l'historique de vos 30 derniers téléchargements
            </div>
          )}
        >
          <button>
            <HistoryButton className={defaultClassName} sizeIcon={sizeIcon} fontSizeText={fontSizeText} />
          </button>
        </Tooltip>
      </div>
    </div>
  );
}
