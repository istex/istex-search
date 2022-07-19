import React from 'react';
import SubMenu from '../SubMenu/SubMenu';

import './Header.scss';

export default function Header () {
  return (
    <nav className='istex-header bg-white p-8'>
      <div className='max-w-7xl mx-auto px-2 sm:px-6 lg:px-8'>
        <div className='relative flex items-center justify-between h-16'>
          <div className='absolute inset-y-0 left-0 flex items-center sm:hidden'>

            {/* Mobile menu button */}
            <button
              type='button'
              className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
              aria-controls='mobile-menu'
              aria-expanded='false'
            >
              <span className='sr-only'>Open main menu</span>
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
          <div className='flex w-full sm:items-stretch justify-between'>
            <div className='flex-shrink-0 flex items-center'>
              <img className='block w-auto' src='/images/logo-istex.svg' alt='logo istex' />
            </div>
            <div className='flex flex-col justify-between sm:ml-6'>
              <div className='istex-social-network'>
                <ul className='flex justify-end'>
                  <li className='pl-1O cursor-pointer'>
                    <a href='https://twitter.com/ISTEX_Platform'>
                      <img className='block w-auto' src='/images/head-ico-twitter.svg' alt='logo twitter' />
                    </a>
                  </li>
                  <li className='pl-10 cursor-pointer'>
                    <a href='https://github.com/istex'>
                      <img className='block w-auto' src='/images/head-ico-github.svg' alt='logo github' />
                    </a>
                  </li>
                  <li className='pl-10 cursor-pointer'>
                    <a href='https://www.youtube.com/channel/UCyow0tVlCRcjwRfk9p7q8Uw'>
                      <img className='block w-auto' src='/images/head-ico-youtube.svg' alt='logo youtube' />
                    </a>
                  </li>
                  <li className='pl-10 cursor-pointer'>
                    <a href='https://www.istex.fr/contactez-nous/'>
                      <img className='block w-auto' src='/images/head-ico-contact.svg' alt='logo contact' />
                    </a>
                  </li>
                </ul>
              </div>
              <div className='flex space-x-4 items-center w-full'>
                {/* Current: 'bg-gray-900 text-white', Default: 'text-gray-300 hover:bg-gray-700 hover:text-white' */}
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
