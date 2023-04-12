import React, { useState } from 'react';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import ExampleList from './ExampleList';
import Modal from '@/components/Modal';

export default function ExamplesButton () {
  const [modalOpen, setModalOpen] = useState(false);

  const showModal = show => () => setModalOpen(show);

  return (
    <>
      <button
        className='!px-6 cta-blue-wired font-montserrat font-medium flex gap-2'
        onClick={showModal(true)}
      >
        <span>Exemples</span>
        <div className='m-auto'>
          <Tooltip content='Testez des exemples de requête'>
            <FontAwesomeIcon icon='circle-info' />
          </Tooltip>
        </div>
      </button>

      {modalOpen && (
        <Modal onClose={showModal(false)}>
          <Modal.Header>Exemples de requêtes</Modal.Header>
          <Modal.Body>
            <div className='p-1 flex flex-col gap-5'>
              <p className='max-w-2xl'>
                Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche. Cliquez sur l'une des loupes et la zone de requête sera remplie automatiquement par le contenu de l'exemple choisi. Cet échantillon illustre différentes façons d'interroger l'API Istex en utilisant :
              </p>
              <ExampleList onClose={showModal(false)} />
            </div>
          </Modal.Body>
          <Modal.Footer />
        </Modal>
      )}
    </>
  );
}
