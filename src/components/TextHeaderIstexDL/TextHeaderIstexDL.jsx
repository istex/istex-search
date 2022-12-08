import React from 'react';

import './TextHeaderIstexDL.scss';

export default function TextHeaderIstexDL () {
  return (
    <header className='flex flex-col w-full md:flex-row items-center justify-center p-6 text-header-istex-dl overflow-hidden'>
      <img className='h-32 w-32' src='/images/ic_telecharger_corpus_white.svg' alt='image download' />

      <div className='py-4 flex flex-col items-start pl-5'>
        <h1 className='title-1 !font-bold'>Téléchargez un corpus Istex</h1>
        <p className='title-5'>
          Vous êtes membre de l’Enseignement supérieur et de la Recherche et vous souhaitez extraire un corpus de documents Istex ?
        </p>
        <p className='title-5'>
          3 étapes suffisent pour récupérer une archive compressée de votre corpus sur votre disque dur.
        </p>
      </div>
    </header>
  );
}
