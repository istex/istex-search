import React from 'react';

export default function SubMenu () {
  return (
    <ul className='flex gap-12'>
      <li className='flex flex-col justify-start hover:border-b-[3px] hover:border-istcolor-green-light text-istcolor-grey-light hover:text-istcolor-black pb-3'>
        <a
          href='https://www.istex.fr/la-base/'
          className='istex-header__submenu text-sm font-bold'
          aria-current='page'
        >
          La base
        </a>
      </li>

      <li className='flex flex-col justify-start hover:border-b-[3px] hover:border-istcolor-green-light text-istcolor-grey-light hover:text-istcolor-black pb-3'>
        <a
          href='https://www.istex.fr/fouille-de-texte/'
          className='istex-header__submenu text-sm font-bold'
        >
          Fouille de textes
        </a>
      </li>
      <li className='flex flex-col justify-start hover:border-b-[3px] hover:border-istcolor-green-light text-istcolor-grey-light hover:text-istcolor-black pb-3'>
        <a
          href='https://www.istex.fr/category/actualites/'
          className='istex-header__submenu text-sm font-bold'
        >
          Actualités
        </a>
      </li>
      <li className='flex flex-col justify-start hover:border-b-[3px] hover:border-istcolor-green-light text-istcolor-grey-light hover:text-istcolor-black pb-3'>
        <a
          href='https://www.istex.fr/a-propos/'
          className='istex-header__submenu text-sm font-bold'
        >
          À propos
        </a>
      </li>
      <li className='flex flex-col justify-start hover:border-b-[3px] hover:border-istcolor-green-light text-istcolor-grey-light hover:text-istcolor-black pb-3'>
        <a
          href='https://www.istex.fr/institutions-adherentes/'
          className='istex-header__submenu text-sm font-bold'
        >
          Institutions adhérentes
        </a>
      </li>
    </ul>
  );
}
