import React from 'react';

import './TextHeaderIstexDL.scss';

export default function TextHeaderIstexDL() {
  return (
    <header className='flex flex-col justify-between items-center text-header-istex-dl'>
      <div>
        <img className='text-header-istex-dl__icon' src='/images/ic_telecharger_corpus.svg' alt='image download' />
      </div>

      <div className='py-4'>
        <h1 className='text-header-istex-dl__title font-bold text-xl'>Téléchargez un corpus ISTEX</h1>
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
