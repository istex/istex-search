import React from 'react';

export default function Footer () {
  return (
    <footer className='flex flex-col justify-between items-center bg-white mb-20 mt-5 py-5 before:content-[""] before:block before:h-[7px] before:w-full before:bg-gradient-to-r before:from-istcolor-blue before:via-[#458ca5]/95 before:to-istcolor-green-light before:bg-left-top'>
      <ul className='flex text-istcolor-black text-sm font-bold pt-5'>
        <li className='px-4'>
          <a href='https://www.istex.fr/politique-de-confidentialite/'>Confidentialité</a>
        </li>
        <li className='px-4'>
          <a href='https://www.istex.fr/accessibilite/'>Accessibilité</a>
        </li>
        <li className='px-4'>
          <a href='https://www.istex.fr/mentions-legales/'>Mentions légales</a>
        </li>
        <li className='px-4'>
          <a href='https://www.istex.fr/plan-du-site/'>Plan du site</a>
        </li>
        <li className='px-4'>
          <a href='https://stats.uptimerobot.com/Lg8APTkMmW'>Météo des services</a>
        </li>
      </ul>

      <ul className='flex justify-between items-center pt-5'>
        <li className='px-5'>
          <a href='https://www.enseignementsup-recherche.gouv.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/img/mesr.svg' alt="ministère de l'enseignement supérieur et de la recherche" />
          </a>
        </li>
        <li className='px-5'>
          <a href='https://www.cnrs.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/img/cnrs.svg' alt='cnrs' />
          </a>
        </li>
        <li className='px-5'>
          <a href='https://www.abes.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/img/abes.png' alt="abes : agence bibliographique de l'enseignement supérieur" />
          </a>
        </li>
        <li className='px-5'>
          <a href='https://www.couperin.org/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/img/couperin.png' alt='couperin.org' />
          </a>
        </li>
        <li className='px-5'>
          <a href='https://franceuniversites.fr/'>
            <img className='w-[150px]' src='https://www.istex.fr/wp-content/themes/istex/img/france_universites_logo.svg' alt='France universités' />
          </a>
        </li>
        <li className='px-5'>
          <a href='http://www.univ-lorraine.fr/'>
            <img src='https://www.istex.fr/wp-content/themes/istex/img/ul.svg' alt='université de lorraine' />
          </a>
        </li>
      </ul>

      <div className='py-5 text-center flex flex-col items-center'>
        <img src='https://www.istex.fr/wp-content/themes/istex/img/investissement.png' alt="investissement d'avenir" />
        <p className='mt-0 text-istcolor-grey-dark text-sm'>Financement : ANR-10-IDEX-0004-02</p>
      </div>

    </footer>
  );
}
