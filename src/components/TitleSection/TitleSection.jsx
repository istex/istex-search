import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { InformationCircleIcon } from '@heroicons/react/solid';
import { Popover, Transition } from '@headlessui/react';
import { usePopper } from 'react-popper';

import './TitleSection.scss';

export default function TitleSection ({ num, title, infoTextTitle, infoTextContent }) {
  const [referenceElement, setReferenceElement] = useState();
  const [popperElement, setPopperElement] = useState();
  const { styles, attributes } = usePopper(referenceElement, popperElement);

  return (
    <div className='title-section flex justify-between items-center'>
      <h2 className='title-section__num-title flex'>
        <span className='bg-istcolor-green-dark title-section__num-title__num'>
          {num}
        </span>
        <span className='title-section__num-title__title'>
          {title}
        </span>
      </h2>
      <div className='title-section__info cursor-pointer'>
        <Popover className='relative'>
          {({ open }) => (
            <>
              <Popover.Button
                className={`${open ? '' : 'text-opacity-90'}`}
                ref={setReferenceElement}
              >
                <InformationCircleIcon className='h-9 w-9 text-blue-500' />
              </Popover.Button>
              <Transition
                as={Fragment}
                enter='transition ease-out duration-200'
                enterFrom='opacity-0 translate-y-1'
                enterTo='opacity-100 translate-y-0'
                leave='transition ease-in duration-150'
                leaveFrom='opacity-100 translate-y-0'
                leaveTo='opacity-0 translate-y-1'
              >
                <Popover.Panel
                  className='title-section__info__content right-1 absolute z-10 mt-3 w-screen max-w-sm transform -translate-x-2'
                  ref={setPopperElement}
                  style={styles.popper}
                  {...attributes.popper}
                >
                  <div className='overflow-hidden rounded-lg shadow-lg ring-1 ring-black ring-opacity-5'>
                    <div className='bg-gray-50 p-4'>
                      <span className='flex items-center'>
                        <span className='text-sm font-medium text-gray-900'>
                          {infoTextTitle}
                        </span>
                      </span>
                      <span className='block text-sm text-gray-500'>
                        {infoTextContent}
                      </span>
                    </div>
                  </div>
                </Popover.Panel>
              </Transition>
            </>
          )}
        </Popover>
      </div>
    </div>
  );
}

TitleSection.propTypes = {
  num: PropTypes.string,
  title: PropTypes.string,
  infoTextTitle: PropTypes.string,
  infoTextContent: PropTypes.string,
};
