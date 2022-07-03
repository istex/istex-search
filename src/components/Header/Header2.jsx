import React, { useState } from 'react';
import { Transition } from '@headlessui/react';

import './Header.scss';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className='istex-header lg:px-16 px-6 bg-white flex flex-wrap items-center lg:py-0 py-2'>
      <div className='flex-1 flex justify-between items-center'>
        <label htmlFor='menu-toggle' className='cursor-pointer block lg:hidden'>
          {/* Mobile menu button */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            type='button'
            className='inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white'
            aria-controls='mobile-menu'
            aria-expanded='false'
          >
            <span className='sr-only'>Open main menu</span>
            {!isOpen
              ? (
                <svg className='block h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M4 6h16M4 12h16M4 18h16' />
                </svg>
              )
              : (
                <svg className='hidden h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' strokeWidth='2' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' d='M6 18L18 6M6 6l12 12' />
                </svg>
              )}
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
                <a href='#' className='font-bold lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  La base
                </a>
              </li>
              <li>
                <a href='#' className='font-bold lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  Fouille de textes
                </a>
              </li>
              <li>
                <a href='#' className='font-bold lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  Actualités
                </a>
              </li>
              <li>
                <a href='#' className='font-bold lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  A propos
                </a>
              </li>
              <li>
                <a href='#' className='font-bold lg:p-4 py-3 px-0 block border-b-2 border-transparent hover:border-indigo-500'>
                  Institutions adhérentes
                </a>
              </li>
            </ul>
          </nav>
        </div>

        <Transition
          show={isOpen}
          enter='transition ease-out duration-100 transform'
          enterFrom='opacity-0 scale-95'
          enterTo='opacity-100 scale-100'
          leave='transition ease-in duration-75 transform'
          leaveFrom='opacity-100 scale-100'
          leaveTo='opacity-0 scale-95'
        >
          {(ref) => (
            <div className='md:hidden' id='mobile-menu'>
              <div ref={ref} className='px-2 pt-2 pb-3 space-y-1 sm:px-3'>
                <a
                  href='#'
                  className='hover:bg-gray-700 text-white block px-3 py-2 rounded-md text-base font-medium'
                >
                  Dashboard
                </a>

                <a
                  href='#'
                  className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                >
                  Team
                </a>

                <a
                  href='#'
                  className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                >
                  Projects
                </a>

                <a
                  href='#'
                  className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                >
                  Calendar
                </a>

                <a
                  href='#'
                  className='text-gray-300 hover:bg-gray-700 hover:text-white block px-3 py-2 rounded-md text-base font-medium'
                >
                  Reports
                </a>
              </div>
            </div>
          )}
        </Transition>
      </div>
    </header>
  );
}
