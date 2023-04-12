import React, { useState } from 'react';
import { Tooltip, Modal } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Example from './Example';

import { examples } from '@/config';

export default function ExamplesButton () {
  const [modalOpened, showModal] = useState(false);

  return (
    <>
      <button
        className='!px-6 cta-blue-wired font-montserrat font-medium flex gap-2'
        onClick={() => showModal(true)}
      >
        <span>Exemples</span>
        <div className='m-auto'>
          <Tooltip content='Testez des exemples de requête'>
            <FontAwesomeIcon icon='circle-info' />
          </Tooltip>
        </div>
      </button>

      <Modal show={modalOpened} onClose={() => showModal(false)}>
        <div className='istex-modal__header'>
          <Modal.Header>
            <span className='istex-modal__text'>Exemples de requêtes</span>
          </Modal.Header>
        </div>
        <Modal.Body>
          <p className='pb-3 text-sm text-istcolor-grey-link'>
            Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche. Cliquez sur l'une des loupes et la zone de requête sera remplie automatiquement par le contenu de l'exemple choisi. Cet échantillon illustre différentes façons d'interroger l'API Istex en utilisant :
          </p>
          <div className='flex flex-col justify-between overflow-auto h-72'>
            {examples.map(example => (
              <div key={example.label}>
                <Example info={example} closeModal={() => showModal(false)} />
              </div>
            ))}
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-end'>
            <button
              onClick={() => showModal(false)}
              className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
            >
              Annuler
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}
