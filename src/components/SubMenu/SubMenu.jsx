import React from 'react';
import '../Header/Header.scss';
import PropTypes from 'prop-types';

export default function SubMenu ({ screenSize }) {
  return (
    <>
      {screenSize.dynamicWidth >= 900
        ? (
          <ul className='menu font-montserrat-bold flex gap-12 font-[14px]'>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/la-base/'>La base</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/fouille-de-texte/'>Fouille de textes</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/category/actualites/'>Actualités</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/a-propos/'>À propos</a>
            </li>
            <li className='text-sm text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
              <a className='block pb-[8px]' href='https://www.istex.fr/institutions-adherentes/'>Institutions  adhérentes</a>
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
