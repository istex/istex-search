import React from 'react';
import PropTypes from 'prop-types';

import './Header.scss';

export default function SubMenu ({ screenSize }) {
  return (
    <>
      {screenSize.dynamicWidth >= 900
        ? (
          <ul className='menu font-montserrat font-bold flex gap-12'>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/la-base/' target='_blank' rel='noreferrer'>La base</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/fouille-de-texte/' target='_blank' rel='noreferrer'>Fouille de textes</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/category/actualites/' target='_blank' rel='noreferrer'>Actualités</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/a-propos/' target='_blank' rel='noreferrer'>À propos</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/institutions-adherentes/' target='_blank' rel='noreferrer'>Institutions adhérentes</a>
            </li>
          </ul>
          )
        : null}
    </>
  );
}

SubMenu.propTypes = {
  screenSize: PropTypes.object,
};
