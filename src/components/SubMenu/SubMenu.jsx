import React from 'react';

export default function SubMenu () {
  return (
    <>
      <a href='https://www.istex.fr/la-base/' className='istex-header__submenu text-brown-grey ml-10 text-sm font-bold' aria-current='page'>La base</a>

      <a href='https://www.istex.fr/fouille-de-texte/' className='istex-header__submenu text-brown-grey ml-10 text-sm font-bold'>Fouille de textes</a>

      <a href='https://www.istex.fr/category/actualites/' className='istex-header__submenu text-brown-grey ml-10 text-sm font-bold'>Actualités</a>

      <a href='https://www.istex.fr/a-propos/' className='istex-header__submenu text-brown-grey ml-10 text-sm font-bold'>À propos</a>

      <a href='https://www.istex.fr/institutions-adherentes/' className='istex-header__submenu text-brown-grey ml-10 text-sm font-bold'>Institutions adhérentes</a>
    </>
  );
}
