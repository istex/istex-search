import React from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

export default function SectionTitle ({ num, title, infoTextContent }) {
  return (
    <div className='flex justify-between items-center pb-[5px] text-istcolor-black mt-2 mb-2 border-b-2 border-istcolor-black'>
      <h3 className='flex title-3 text-center'>
        <span className='rounded-full bg-istcolor-green-dark w-10 h-10 mr-2'>
          {`${num}.`}
        </span>
        <span>{title}</span>
      </h3>
      <Tooltip
        trigger='click'
        content={infoTextContent}
      >
        <button>
          <FontAwesomeIcon icon='circle-info' size='2x' className='text-istcolor-blue cursor-pointer' />
        </button>
      </Tooltip>
    </div>
  );
}

SectionTitle.propTypes = {
  num: PropTypes.string,
  title: PropTypes.string,
  infoTextContent: PropTypes.node,
};
