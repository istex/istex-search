import React from 'react';

export default function Footer() {
  return (
    <footer className='flex flex-col justify-between items-center bg-gray-200 mb-20 mt-5 py-5'>
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
            <img src='https://www.istex.fr/wp-content/themes/istex/images/footer/MESRI_logo.jpg' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='http://www.enseignementsup-recherche.gouv.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/images/footer/logo-cnrs-simple.svg' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='http://www.enseignementsup-recherche.gouv.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/images/footer/ABES-logo.png' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='http://www.enseignementsup-recherche.gouv.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/images/footer/CPU-Logo.png' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
        <li className='mr-8'>
          <a href='http://www.enseignementsup-recherche.gouv.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/images/footer/ul_logo_blanc_rvb.png' alt='ministère enseignement supérieur et de la recherche' />
          </a>
        </li>
      </ul>
      <div>
        <span id='version'>
          <span data-reactroot=''>
            ISTEX DL <a className='text-blue-400' href='//github.com/istex/istex-dl/releases/tag/4.22.1' target='_blank' rel='noopener noreferrer'>4.22.1</a>
          </span>
        </span>
      </div>
    </footer>
  );
}
