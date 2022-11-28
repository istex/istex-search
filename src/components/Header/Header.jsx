import { Tooltip } from 'flowbite-react';
import React, { useEffect, useState } from 'react';
import SubMenu from '../SubMenu/SubMenu';
import { ReactComponent as TwitterIcon } from '../../assets/img/head-ico-twitter.svg';
import { ReactComponent as GithubIcon } from '../../assets/img/head-ico-github.svg';
import { ReactComponent as YoutubeIcon } from '../../assets/img/head-ico-youtube.svg';
import { ReactComponent as ContactIcon } from '../../assets/img/head-ico-contact.svg';

import './Header.scss';

export default function Header () {
  const [screenSize, getDimension] = useState({
    dynamicWidth: window.innerWidth,
    dynamicHeight: window.innerHeight,
  });
  const [mobileMenuIsOpened, setMobileMenuIsOpened] = useState(true);
  const toggleMobileMenu = () => {
    mobileMenuIsOpened ? setMobileMenuIsOpened(false) : setMobileMenuIsOpened(true);
  };
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
      <div className={`${screenSize.dynamicWidth <= 1230 ? 'w-[' + screenSize.dynamicWidth + 'px]' : 'w-header'} mx-auto`}>
        <div className={`${screenSize.dynamicWidth <= 1200 ? 'px-2 py-2' : 'px-10 py-10'} relative flex items-center justify-between  md:pt-[22px] md:pb-[11px]`}>
          <div className='justify-between flex w-full xd'>
            {
              screenSize.dynamicWidth <= 900
                ? (
                  <div id='navigation-main' className={`navigation-main ${mobileMenuIsOpened ? 'is-closed' : ''}`} onClick={toggleMobileMenu} role='navigation' aria-label='menu-principal'>
                    <button id='toggle-nav' title='afficher le menu' className='nav-button' />

                    <ul className='menu font-montserrat-bold flex gap-12 font-[14px]'>
                      <li className='text-sm mobile-menu-text text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
                        <a className='block pb-[8px]' href='https://www.istex.fr/la-base/'>La base</a>
                      </li>
                      <li className='text-sm mobile-menu-text text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
                        <a className='block pb-[8px]' href='https://www.istex.fr/fouille-de-texte/'>Fouille de textes</a>
                      </li>
                      <li className='text-sm mobile-menu-text text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
                        <a className='block pb-[8px]' href='https://www.istex.fr/category/actualites/'>Actualités</a>
                      </li>
                      <li className='text-sm mobile-menu-text text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
                        <a className='block pb-[8px]' href='https://www.istex.fr/a-propos/'>À propos</a>
                      </li>
                      <li className='text-sm mobile-menu-text text-istcolor-grey-light border-b-[3px] border-b-transparent hover:text-istcolor-black hover:border-b-istcolor-green-light'>
                        <a className='block pb-[8px]' href='https://www.istex.fr/institutions-adherentes/'>Institutions  adhérentes</a>
                      </li>

                      <li className='new cursor-pointer'>
                        <a href='https://twitter.com/ISTEX_Platform' className='ttipContainer twitter-logo' target='_blank' rel='noreferrer'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={<p className='text-sm'>Nous suivre sur twitter</p>}
                          >
                            <TwitterIcon className='header-icon twitter-icon' />
                          </Tooltip>
                        </a>
                        <a href='https://github.com/istex' className='ttipContainer' target='_blank' rel='noreferrer'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={<p className='text-sm'>Code source</p>}
                          >
                            <GithubIcon className='header-icon github-icon' />
                          </Tooltip>
                        </a>
                        <a href='https://www.youtube.com/channel/UCyow0tVlCRcjwRfk9p7q8Uw' className='ttipContainer' target='_blank' rel='noreferrer'>
                          <Tooltip
                            placement='bottom'
                            animation={false}
                            content={<p className='text-sm'>Chaîne ISTEX</p>}
                          >
                            <YoutubeIcon className='header-icon youtube-icon' />
                          </Tooltip>
                        </a>
                      </li>
                    </ul>
                  </div>
                  )
                : null
            }
            <a className={`${screenSize.dynamicWidth >= 900 ? 'justify-between' : 'justify-center'} logo flex flex-col `} href='https://www.istex.fr'>
              <img className='logo-istex w-[184px]' src='/images/istex_logo.svg' alt='ISTEX' />
              <span className='baseline relative bottom-3 block leading-tight font-montserrat-bold italic text-[10.200px] text-istcolor-blue'>Le socle de la bibliothèque<br /> scientifique numérique nationale</span>
            </a>
            <div className='flex flex-col justify-between'>
              <div className='istex-social-network pb-7 interactions'>
                <ul className='flex justify-end gap-5'>
                  {screenSize.dynamicWidth >= 900
                    ? (
                      <>
                        <li className='cursor-pointer'>
                          <a href='https://twitter.com/ISTEX_Platform' className='twitter-logo' target='_blank' rel='noreferrer'>
                            <Tooltip
                              placement='bottom'
                              animation={false}
                              content={<p className='text-sm'>Nous suivre sur twitter</p>}
                            >
                              <TwitterIcon className='header-icon twitter-icon' />
                            </Tooltip>
                          </a>
                        </li>
                        <li className='cursor-pointer'>
                          <a href='https://github.com/istex' target='_blank' rel='noreferrer'>
                            <Tooltip
                              placement='bottom'
                              animation={false}
                              content={<p className='text-sm'>Code source</p>}
                            >
                              <GithubIcon className='header-icon github-icon' />
                            </Tooltip>
                          </a>
                        </li>
                        <li className='cursor-pointer'>
                          <a href='https://www.youtube.com/channel/UCyow0tVlCRcjwRfk9p7q8Uw' target='_blank' rel='noreferrer'>
                            <Tooltip
                              placement='bottom'
                              animation={false}
                              content={<p className='text-sm'>Chaîne ISTEX</p>}
                            >
                              <YoutubeIcon className='header-icon youtube-icon' />
                            </Tooltip>
                          </a>
                        </li>
                      </>
                      )
                    : null}
                  <li className='cursor-pointer mobile-contact'>
                    <a href='https://www.istex.fr/contactez-nous/' target='_blank' rel='noreferrer'>
                      <Tooltip
                        placement='bottom'
                        animation={false}
                        content={<p className='text-sm'>Contact</p>}
                      >
                        <ContactIcon className='header-icon contact-icon' />
                      </Tooltip>
                    </a>
                  </li>
                </ul>
              </div>
              <div className='mt-4'>
                <SubMenu screenSize={screenSize} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
