import React from 'react';

export default function SubMenu () {
  return (
    <ul className='font-montserrat-bold flex gap-12 font-[14px]'>
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
  );
}
