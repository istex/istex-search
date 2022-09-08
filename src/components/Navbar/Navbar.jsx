import React from 'react';
import { Tooltip } from 'flowbite-react';
import './Navbar.scss';
import ResetButton from '../ResetButton/ResetButton';
import FetchButton from '../FetchButton/FetchButton';
import ShareButton from '../ShareButton/ShareButton';
import HistoryButton from '../HistoryButton/HistoryButton';

export default function Navbar () {
  return (
    <div className='istex-footer'>
      <div className='pt-3 pb-1 flex justify-center'>
        <Tooltip
          content={(
            <div className='istex-footer__tooltip'>
              Effacez tout pour redémarrer avec un formulaire vide
            </div>
          )}
        >
          <ResetButton />
        </Tooltip>
        <Tooltip
          content={(
            <div className='istex-footer__tooltip'>
              Récupérez l'état en cours de votre formulaire
            </div>
          )}
        >
          <FetchButton />
        </Tooltip>
        <Tooltip
          content={(
            <div className='istex-footer__tooltip'>
              Activez cette fonctionnalité en complétant le formulaire et partagez votre corpus avant de le télécharger
            </div>
          )}
        >
          <ShareButton />
        </Tooltip>
        <Tooltip
          content={(
            <div className='istex-footer__tooltip'>
              Accédez à l'historique de vos 30 derniers téléchargements
            </div>
          )}
        >
          <HistoryButton />
        </Tooltip>
      </div>
    </div>
  );
}
