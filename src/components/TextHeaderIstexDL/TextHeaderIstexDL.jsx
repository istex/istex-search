import React from 'react';

import './TextHeaderIstexDL.scss';

export default function TextHeaderIstexDL () {
  return (
    <header className='flex flex-col w-full md:flex-row items-center justify-center px-10 py-10 text-header-istex-dl pt-32 overflow-hidden'>
      <div>
        <img className='text-header-istex-dl__icon h-32 w-32' src='/images/ic_telecharger_corpus_white.svg' alt='image download' />
      </div>

      <div className='py-4 flex flex-col items-start pl-5'>
        <h1 className='text-header-istex-dl__title font-bold text-4xl'>Téléchargez un corpus Istex</h1>
        <p className='font-bold'>
          Vous êtes membre de l’Enseignement supérieur et de la Recherche et vous souhaitez extraire un corpus de documents ISTEX ?
        </p>
        <p className='font-bold'>
          3 étapes suffisent pour récupérer une archive compressée de votre corpus sur votre disque dur.
        </p>
      </div>
    </header>
  );
}
