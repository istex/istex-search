import React from 'react';

import './TextHeaderIstexDL.scss';

export default function TextHeaderIstexDL () {
  return (
    <header className='flex flex-col justify-between items-center text-header-istex-dl pt-32'>
      <div>
        <img className='text-header-istex-dl__icon h-32 w-32' src='/images/ic_telecharger_corpus_white.svg' alt='image download' />
      </div>

      <div className='py-4'>
        <h1 className='text-header-istex-dl__title font-bold text-xl'>Téléchargez un corpus Istex</h1>
        <p className='text-center'>
          Vous êtes membre de l’Enseignement supérieur et de la Recherche et vous souhaitez extraire un corpus de documents ISTEX ?
        </p>
        <p className='text-center'>
          3 étapes suffisent pour récupérer une archive compressée de votre corpus sur votre disque dur.
        </p>
      </div>
    </header>
  );
}
