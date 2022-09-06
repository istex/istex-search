/* eslint-disable react/jsx-indent */
import { Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import SubMenu from '../SubMenu/SubMenu';

import './Header.scss';

export default function Header () {
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });
  const setDimension = () => {
    getDimension({
      dynamicWidth: window.innerWidth,
      dynamicHeight: window.innerHeight,
    });
  };
  useEffect(() => {
    window.addEventListener('resize', setDimension);
    return () => {
      window.removeEventListener('resize', setDimension);
    };
  }, [screenSize]);

  return (
    <nav className='istex-header bg-white fixed w-full z-[1000]'>
      <div className='mx-auto'>
        <div style={{ paddingLeft: '215px', paddingRight: '215px' }} className='relative flex items-center justify-between px-10 py-10 md:pt-[22px] md:pb-[11px]'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>

            {/* Mobile menu button */}
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu </span>
              {/*
                Icon when menu is closed.
                Heroicon name: outline/menu
                Menu open: 'hidden', Menu closed: 'block'
              */}
              <svg className='block h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
              </svg>
              {/*
                Icon when menu is open.
                Heroicon name: outline/x
                Menu open: 'block', Menu closed: 'hidden'
              */}
              <svg className='hidden h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' aria-hidden='true'>
                <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
              </svg>
            </button>
          </div>
          <div className='flex w-full justify-around'>
            <div>
              <a className='logo flex flex-col justify-around' href='https://www.istex.fr'>
                <img className='logo-istex w-[184px]' src='/images/istex_logo.svg' alt='ISTEX' />
                <span className='baseline block leading-tight pt-4 font-montserrat-extrabold italic text-[10.200px] font-extrabold text-istcolor-blue'>Le socle de la bibliothèque<br /> scientifique numérique nationale</span>
              </a>
            </div>
            <div className='flex flex-col justify-between'>
              <div className='istex-social-network pb-7 interactions'>
                <ul className='flex justify-end gap-5'> {screenSize.dynamicWidth}
                  {screenSize.dynamicWidth >= 760
                    ? <>
                      <li className='cursor-pointer'>
                        <a href='https://twitter.com/ISTEX_Platform'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={
                              <p className='text-sm'>
                                Nous suivre sur Twitter
                              </p>
                            }
                          >
                            <svg width='21' height='21' xmlns='http://www.w3.org/2000/svg' className='fill-[#8f8f8f] hover:fill-[#00acee]' aria-labelledby='titletw'>
                              <title id='titletw'>Nous suivre sur Twitter</title>
                              <path d='M6.79 18.764c7.547 0 11.675-6.157 11.675-11.495 0-.175 0-.35-.012-.523a8.265 8.265 0 0 0 2.047-2.09 8.273 8.273 0 0 1-2.356.635 4.07 4.07 0 0 0 1.804-2.235 8.303 8.303 0 0 1-2.606.98 4.153 4.153 0 0 0-5.806-.174 4.006 4.006 0 0 0-1.187 3.86 11.717 11.717 0 0 1-8.457-4.22 4.005 4.005 0 0 0 1.271 5.392A4.122 4.122 0 0 1 1.3 8.389v.05c.001 1.924 1.378 3.58 3.292 3.96a4.144 4.144 0 0 1-1.852.07c.537 1.646 2.078 2.773 3.833 2.805A8.315 8.315 0 0 1 .5 16.95a11.754 11.754 0 0 0 6.29 1.812' fillRule='evenodd' />
                            </svg>
                          </Tooltip>
                        </a>
                        </li>
                        <li className='cursor-pointer'>
                        <a href='https://github.com/istex'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={
                              <p className='text-sm'>
                                Code source
                              </p>
                            }
                          >
                            <svg width='21' height='21' xmlns='http://www.w3.org/2000/svg' className='fill-[#8f8f8f] hover:fill-istcolor-black' aria-labelledby='titlegb'>
                              <title id='titlegb'>Code source</title>
                              <path d='M10.499 1.18C4.977 1.18.5 5.675.5 11.22c0 4.435 2.865 8.198 6.84 9.526.5.093.683-.217.683-.483 0-.24-.01-.87-.014-1.708-2.782.606-3.369-1.346-3.369-1.346-.454-1.16-1.11-1.469-1.11-1.469-.909-.622.068-.61.068-.61 1.003.071 1.53 1.035 1.53 1.035.893 1.534 2.342 1.091 2.912.834.09-.649.349-1.091.635-1.343-2.22-.253-4.555-1.115-4.555-4.961 0-1.096.39-1.992 1.03-2.695-.104-.254-.446-1.275.097-2.656 0 0 .84-.27 2.75 1.029a9.54 9.54 0 0 1 2.504-.338 9.563 9.563 0 0 1 2.504.339c1.909-1.299 2.747-1.029 2.747-1.029.545 1.383.203 2.403.1 2.656.642.703 1.028 1.599 1.028 2.695 0 3.857-2.337 4.705-4.565 4.954.359.31.679.923.679 1.859 0 1.342-.013 2.425-.013 2.754 0 .268.18.58.688.482A10.04 10.04 0 0 0 20.5 11.22c0-5.545-4.477-10.04-10.001-10.04z' fillRule='nonzero' />
                            </svg>
                          </Tooltip>
                        </a>
                      </li>
                      <li className='cursor-pointer'>
                        <a href='https://www.youtube.com/channel/UCyow0tVlCRcjwRfk9p7q8Uw'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={
                              <p className='text-sm'>
                                Chaîne ISTEX
                              </p>
                            }
                          >
                            <svg width='21' height='21' xmlns='http://www.w3.org/2000/svg' className='fill-[#8f8f8f] hover:fill-[#cf2e2e]'>
                              <title id='titleyt'>Chaîne ISTEX</title>
                              <path d='M8.488 13.35V7.738c1.993.937 3.536 1.843 5.36 2.82-1.505.834-3.367 1.77-5.36 2.792m11.103-8.403c-.344-.453-.93-.805-1.553-.922-1.833-.348-13.267-.349-15.099 0-.5.094-.945.32-1.328.672C0 6.193.505 14.215.893 15.515c.164.562.375.968.64 1.234.343.352.812.595 1.351.703 1.51.312 9.284.487 15.122.047a2.62 2.62 0 0 0 1.39-.71c1.49-1.49 1.388-9.964.195-11.842' fillRule='evenodd' />
                            </svg>
                          </Tooltip>
                        </a>
                      </li>
                    </>
                    : null}
                  <li className='cursor-pointer'>
                    <a href='https://www.istex.fr/contactez-nous/'>
                      <Tooltip
                        placement='bottom'
                        animation={false}
                        content={
                          <p className='text-sm'>
                            Contact
                          </p>
                        }
                      >
                        <svg width='21' height='21' xmlns='http://www.w3.org/2000/svg' className='fill-[#8f8f8f] hover:fill-istcolor-blue' aria-labelledby='titlect'>
                          <title id='titlect'>Contact</title>
                          <path d='M10.5 15.738.5 6.913v11.35h20V6.914l-10 8.825zm.001-2.662L.5 4.245v-.981h20v.98l-9.999 8.832z' fillRule='evenodd' />
                        </svg>
                      </Tooltip>
                    </a>
                  </li>
                </ul>
              </div>

              <nav id="navigation-main" class="navigation-main is-closed" role="navigation" aria-label="menu-principal">
                <ul class="menu">
                  <li>
                    <span class="active">La base</span>
                    </li>
                  <li>
                    <a href="https://www.istex.fr/fouille-de-texte/">Fouille de textes</a>
                    </li>
                  <li>
                    <a href="https://www.istex.fr/category/actualites/">Actualités</a>
                    </li>
                  <li>
                    <a href="https://www.istex.fr/a-propos/">À propos</a>
                    </li>
                  <li>
                    <a href="https://www.istex.fr/institutions-adherentes/">Institutions  adhérentes</a>
                    </li>
                </ul>
              </nav>
              <div className='mt-4'>
                <SubMenu />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on menu state */}
      <div className='sm:hidden' id='mobile-menu'>
        <div className='px-2 pt-2 pb-3 space-y-1'>
          {/* Current: 'bg-gray-900 text-white', Default: 'text-gray-300 hover:bg-gray-700 hover:text-white' */}
          <SubMenu />
        </div>
      </div>
    </nav>
  );
}
