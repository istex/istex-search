import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import styles from './ExampleQueryButton.scss';
import { Tooltip } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { SearchIcon } from '@heroicons/react/solid';
import { examples } from './examplesRequests';

export default function ExampleQueryButton ({ setQueryStringInputValue, updateQueryString }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const onClickExample = params => {
    navigate(`/${params.request}`);
    setQueryStringInputValue(params.input);
    updateQueryString(params.input);
    setIsOpen(false);
  };

  const ExamplesList = examples.map((example) =>
    <div key={example.text.toString()} className={styles.exempleRequestLine}>
      <Tooltip content='Essayez cette requête'>
        <span className={styles.exampleRequest}>
          <SearchIcon className='h-5 w-5 text-istcolor-grey-dark' onClick={() => onClickExample(example)} />
        </span>
      </Tooltip>
      {example.text}
    </div>,
  );

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div role='none' onClick={openModal}>
        <div className='flex items-center font-medium mr-2 w-32' id='headlessui-radiogroup-option-7' role='radio' aria-checked='false' tabIndex='-1'>
          <span className='border-[1px] w-full text-center border-istcolor-blue text-istcolor-blue p-2'>exemples</span>
        </div>
      </div>
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as='div' className='relative z-10' onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter='ease-out duration-300'
            enterFrom='opacity-0'
            enterTo='opacity-100'
            leave='ease-in duration-200'
            leaveFrom='opacity-100'
            leaveTo='opacity-0'
          >
            <div className='fixed inset-0 bg-black bg-opacity-25' />
          </Transition.Child>

          <div className='fixed inset-0 overflow-y-auto'>
            <div className='flex min-h-full justify-center p-4'>
              <Transition.Child
                as={Fragment}
                enter='ease-out duration-300'
                enterFrom='opacity-0 scale-95'
                enterTo='opacity-100 scale-100'
                leave='ease-in duration-200'
                leaveFrom='opacity-100 scale-100'
                leaveTo='opacity-0 scale-95'
              >

                <Dialog.Panel>
                  <div className={styles.modalContent} role='document'>
                    <div className={styles.modalHeader}>
                      <h4 className={styles.modalTitle}> Exemples de requêtes</h4>
                      <button type='button' onClick={closeModal} className={styles.close}>
                        <span aria-hidden='true'>×</span>
                        <span className={styles.srOnly}> Close</span>
                      </button>
                    </div>
                    <div className={styles.modalBody}>
                      Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche. Cliquez sur l'une des loupes et la zone de requête sera remplie automatiquement par le contenu de l'exemple choisi. Cet échantillon illustre différentes façons d'interroger l'API Istex en utilisant :
                      {ExamplesList}
                    </div>
                    <div className={styles.modalFooter}><button type='button' onClick={closeModal} className={[styles.btn + ' ' + styles.btnDefault]}>Annuler</button>
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
}

ExampleQueryButton.propTypes = {
  setQueryStringInputValue: PropTypes.func,
  updateQueryString: PropTypes.func,
};
