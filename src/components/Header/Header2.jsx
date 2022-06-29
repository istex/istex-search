import React from 'react';
import SubMenu from '../SubMenu/SUbMenu';

import './Header.scss';

export default function Header() {
  return (
    <header className='istex-header lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2'>
      <div className='flex-1 flex justify-between items-center'>
        <label htmlFor='menu-toggle' className='cursor-pointer block lg:hidden'>
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
        </label>
        <input type='checkbox' className='hidden' id='menu-toggle' />
        <a href='/'>
          <img alt='logo istex' src='/images/logo-istex.svg' />
        </a>

        <div className='hidden lg:flex lg:items-center lg:w-auto w-full' id='menu'>
          <nav>
            <ul className='lg:flex items-center justify-between text-base text-gray-700 pt-4 lg:pt-0'>
              <li>
                <a href='#' className='lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  La base
                </a>
              </li>
              <li>
                <a href='#' className='lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  La base
                </a>
              </li>
              <li>
                <a href='#' className='lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  La base
                </a>
              </li>
              <li>
                <a href='#' className='lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  La base
                </a>
              </li>
            </ul>
          </nav>
        </div>
      </div>
    </header>
  );
}
