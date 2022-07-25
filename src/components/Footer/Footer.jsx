import React from 'react';

import { version } from '../../../package.json';

export default function Footer () {
  return (
    <footer className='flex flex-col justify-between items-center bg-white mb-20 mt-5 py-5'>
      <img src='/images/investissement_avenir.png' alt='image download' />
      <p className='mb-2'>Financement : ANR-10-IDEX-0004-02</p>
      <p className='mb-2'><a className='text-blue-400' href='https://twitter.com/ISTEX_Platform'>@ISTEX_Platform</a></p>
      <ul className='menu-pied flex'>
        <li className='menu-item menu-item menu-item-type-post_type menu-item-object-page menu-item-73 border-r border-black pr-2 mr-2'>
          <a className='text-blue-400' href='https://www.istex.fr/mentions-legales/'>Mentions légales</a>
        </li>
        <li className='menu-item menu-item menu-item-type-post_type menu-item-object-page menu-item-83 border-r border-black pr-2 mr-2'>
          <a className='text-blue-400' href='https://www.istex.fr/cookies-et-statistiques/'>Politique de confidentialité</a>
        </li>
        <li className='menu-item menu-item menu-item-type-post_type menu-item-object-page menu-item-81 border-r border-black pr-2 mr-2'>
          <a className='text-blue-400' href='https://www.istex.fr/contact/'>Contacter ISTEX</a>
        </li>
        <li className='menu-item menu-item menu-item-type-custom menu-item-object-custom menu-item-84'>
          <a className='text-blue-400' href='https://doc.istex.fr/tdm/extraction/istex-dl.html' target='_blank' rel='noreferrer'>Documentation ISTEX-DL</a>
        </li>
      </ul>
      <ul id='menu-partenaires' className='flex items-center justify-center mt-5'>
        <li className='mr-8'>
          <a href='http://www.enseignementsup-recherche.gouv.fr/'>
            <img src='/images/mesr.svg' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='https://www.cnrs.fr/'>
            <img src='/images/cnrs.svg' alt='cnrs' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='https://www.abes.fr/'>
            <img src='/images/abes.png' alt={'abes : agence bibliographique de l\'enseignement supérieur'} />
          </a>
        </li>
        <li className='mr-8'>
          <a href='https://www.couperin.org/'>
            <img src='/images/couperin.png' alt='couperin.org' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='https://franceuniversites.fr/'>
            <img src='/images/france_universites_logo.svg' alt='France universités' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='http://www.univ-lorraine.fr/'>
            <img src='/images/ul.svg' alt='université de lorraine' />
          </a>
        </li>
      </ul>
      <div>
        <span id='version'>
          <span data-reactroot=''>
            Istex-DL <a className='text-blue-400' href={`//github.com/istex/istex-dl/releases/tag/v${version}`} target='_blank' rel='noopener noreferrer'>{version}</a>
          </span>
        </span>
      </div>
    </footer>
  );
}
