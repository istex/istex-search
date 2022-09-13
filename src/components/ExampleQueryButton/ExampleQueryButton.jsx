import React, { Fragment, useState } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import PropTypes from 'prop-types';
import styles from './ExampleQueryButton.scss';
import { Tooltip } from 'flowbite-react';
import { useNavigate } from 'react-router';
import { SearchIcon } from '@heroicons/react/solid';

export default function ExampleQueryButton ({ setQueryStringInputValue, updateQueryString }) {
  const [isOpen, setIsOpen] = useState(false);

  const navigate = useNavigate();
  const onClickExample = params => {
    navigate(`/${params.request}`);
    setQueryStringInputValue(params.input);
    updateQueryString(params.input);
    setIsOpen(false);
  };

  const examples = [
    {
      text: 'des troncatures sur des termes de recherche en français et en anglais',
      request: '?q=orthophon*+OR+logothérap*+OR+logotherap*&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=30666',
      input: 'orthophon* OR logothérap* OR logotherap*',
    },
    {
      text: 'des opérateurs booléens imbriqués',
      request: '?q=%28species+AND+%28"plant+taxonomy"+OR++phytogeograph*%29%29+NOT+%28%28fungi+fungus%29+NOT+mycorrhiz*%29&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=12964',
      input: '(species AND ("plant taxonomy" OR  phytogeograph*)) NOT ((fungi fungus) NOT mycorrhiz*)',
    },
    {
      text: 'des données bibliographiques',
      request: '?q=%28host.issn%3A"0922-6435"+OR+host.title%3A"Journal+of+Geophysical+Research"%29+AND+publicationDate%3A2003+AND+genre%3A%28"research-article"+OR+“review+article”%29&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=2837',
      input: '(host.issn:"0922-6435" OR host.title:"Journal of Geophysical Research") AND publicationDate:2003 AND genre:("research-article" OR “review article”)',
    },
    {
      text: 'des indicateurs de qualité',
      request: '?q="deep+learning"+AND+qualityIndicators.pdfVersion%3A%5B1.3+TO+1.5%5D+AND+qualityIndicators.score%3A%5B3.5+TO+*%5D&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=2367',
      input: '"deep learning" AND qualityIndicators.pdfVersion:[1.3 TO 1.5] AND qualityIndicators.score:[3.5 TO *]',
    },
    {
      text: 'des expressions régulières sur des termes de recherche',
      request: '?q=%2Fes%28k%7Cqu%29im%28o%7Cau%29%5Bsx%5D%3F%2F+OR++%2Finuit%28s%29%3F%2F&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=37559',
      input: '/es(k|qu)im(o|au)[sx]?/ OR  /inuit(s)?/',
    },
    {
      text: 'de la recherche floue et des opérateurs de proximité',
      request: '?q=%28african~1+%2B+arctic~1%29+AND+"past+climate"~2&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=5488',
      input: '(african~1 + arctic~1) AND "past climate"~2',
    },
    {
      text: 'des enrichissements de type catégorie scientifique',
      request: '?q=categories.scienceMetrix%3A"astronomy+%26+astrophysics"+OR+categories.scopus%3A"astronomy+and+astrophysics"+OR+categories.wos%3A"astronomy+%26+astrophysics"+OR+categories.inist%3A"astronomy"&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=279304',
      input: 'categories.scienceMetrix:"astronomy & astrophysics" OR categories.scopus:"astronomy and astrophysics" OR categories.wos:"astronomy & astrophysics" OR categories.inist:"astronomy"',
    },
    {
      text: 'des enrichissements de type entité nommée',
      request: '?q=namedEntities.unitex.persName%3Abeethoven+AND+namedEntities.unitex.placeName%3Avienna+AND+namedEntities.unitex.date%3A"eighteenth+century"&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=164',
      input: 'namedEntities.unitex.persName:beethoven AND namedEntities.unitex.placeName:vienna AND namedEntities.unitex.date:"eighteenth century"',
    },
    {
      text: 'des enrichissements de type terme d’indexation',
      request: '?q=keywords.teeft%3Acoronavirus*&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=3676',
      input: 'keywords.teeft:coronavirus*',
    },
    {
      text: 'des identifiants ISTEX de type ARK',
      request: '?withID=true&q=arkIstex.raw%3A%28"ark%3A%2F67375%2FHXZ-3PZ5S1MB-7"+"ark%3A%2F67375%2FHXZ-XH6SRM66-7"+"ark%3A%2F67375%2F6H6-K00Q3697-8"+"ark%3A%2F67375%2F6H6-52QRK0X3-F"+"ark%3A%2F67375%2FHXZ-H5NSV5QF-M"+"ark%3A%2F67375%2FHXZ-J1BLQKH4-3"+"ark%3A%2F67375%2FHXZ-QVSXSCHW-P"+"ark%3A%2F67375%2FHXZ-RVC4D13J-W"+"ark%3A%2F67375%2F6H6-19QHR7H2-6"+"ark%3A%2F67375%2FHXZ-0F8518D4-K"+"ark%3A%2F67375%2F6H6-9Q9HLC0X-7"+"ark%3A%2F67375%2F6H6-QTZPZZXD-H"%29&extract=&size=0&rankBy=qualityOverRelevance&archiveType=zip&compressionLevel=6&sid=istex-dl&total=12',
      input: `ark:/67375/HXZ-3PZ5S1MB-7
      ark:/67375/HXZ-XH6SRM66-7
      ark:/67375/6H6-K00Q3697-8
      ark:/67375/6H6-52QRK0X3-F
      ark:/67375/HXZ-H5NSV5QF-M
      ark:/67375/HXZ-J1BLQKH4-3
      ark:/67375/HXZ-QVSXSCHW-P
      ark:/67375/HXZ-RVC4D13J-W
      ark:/67375/6H6-19QHR7H2-6
      ark:/67375/HXZ-0F8518D4-K
      ark:/67375/6H6-9Q9HLC0X-7
      ark:/67375/6H6-QTZPZZXD-H`,
    },
  ];

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
                      Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche. Cliquez sur l'une des loupes et la zone de requête sera remplie automatiquement par le contenu de l'exemple choisi. Cet échantillon illustre différentes façons d'interroger l'API ISTEX en utilisant :
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
