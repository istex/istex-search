import React from 'react';

export default function Footer () {
  return (
    <footer className='flex flex-col justify-between items-center bg-white pb-14 md:pb-20 mt-5 before:content-[""] before:block before:h-[7px] before:w-full before:bg-gradient-to-r before:from-istcolor-blue before:via-[#458ca5]/95 before:to-istcolor-green-light before:bg-left-top'>
      <ul className='flex gap-[30px] flex-wrap justify-center items-center m-0 text-center text-istcolor-grey-link text-[14px] font-[600] pt-5'>
        <li>
          <a href='https://www.istex.fr/politique-de-confidentialite/'>Confidentialité</a>
        </li>
        <li>
          <a href='https://www.istex.fr/accessibilite/'>Accessibilité</a>
        </li>
        <li>
          <a href='https://www.istex.fr/mentions-legales/'>Mentions légales</a>
        </li>
        <li>
          <a href='https://www.istex.fr/plan-du-site/'>Plan du site</a>
        </li>
        <li>
          <a href='https://stats.uptimerobot.com/Lg8APTkMmW'>Météo des services</a>
        </li>
      </ul>
      <div className='p-[30px] text-center flex flex-col items-center'>
        <p className='mt-0 text-istcolor-grey font-opensans text-sm'>Plus sur Istex-DL : <a className='font-bold text-istcolor-grey-link cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html' target='_blank' rel='noreferrer'>Documentation</a> & <a className='font-bold text-istcolor-grey-link cursor-pointer' href='https://web-tutorials.delivery.istex.fr/ark:/67375/Q05-JGB4KZ75-8/index.html#/' target='_blank' rel='noreferrer'>Tutoriel</a></p>
      </div>
      <ul className='flex gap-[30px] flex-wrap justify-center items-center pt-5'>
        <li>
          <a href='https://www.enseignementsup-recherche.gouv.fr/'>
            <img src='/images/mesr.svg' alt="ministère de l'enseignement supérieur et de la recherche" />
          </a>
        </li>
        <li>
          <a href='https://www.cnrs.fr/'>
            <img src='/images/cnrs.svg' alt='cnrs' />
          </a>
        </li>
        <li>
          <a href='https://www.abes.fr/'>
            <img src='/images/abes.png' alt="abes : agence bibliographique de l'enseignement supérieur" />
          </a>
        </li>
        <li>
          <a href='https://www.couperin.org/'>
            <img src='/images/couperin.png' alt='couperin.org' />
          </a>
        </li>
        <li>
          <a href='https://franceuniversites.fr/'>
            <img className='w-[150px]' src='/images/france_universites_logo.svg' alt='France universités' />
          </a>
        </li>
        <li className='px-5'>
          <a href='http://www.univ-lorraine.fr/'>
            <img src='/images/ul.svg' alt='université de lorraine' />
          </a>
        </li>
      </ul>

      <div className='p-[30px] text-center flex flex-col items-center'>
        <img src='/images/investissement.png' alt="investissement d'avenir" />
        <p className='mt-0 text-istcolor-grey-light font-opensans text-sm'>Financement : ANR-10-IDEX-0004-02</p>
      </div>

    </footer>
  );
}
