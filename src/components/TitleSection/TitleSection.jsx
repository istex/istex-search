import React from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import './TitleSection.scss';
import { Tooltip } from 'flowbite-react';

export default function TitleSection ({ num, title, infoTextContent }) {
  return (
    <div className='title-section flex justify-between items-center'>
      <h2 className='title-section__num-title flex'>
        <span className='bg-istcolor-green-dark title-section__num-title__num'>
          {`${num}.`}
        </span>
        <span className='title-section__num-title__title'>
          {title}
        </span>
      </h2>
      <div className='title-section__info cursor-pointer'>
        <Tooltip
          placement='left'
          trigger='click'
          content={infoTextContent}
        >
          <FontAwesomeIcon icon='circle-info' size='2x' className='text-istcolor-blue' />
        </Tooltip>
      </div>
    </div>
  );
}

TitleSection.propTypes = {
  num: PropTypes.string,
  title: PropTypes.string,
  infoTextContent: PropTypes.node,
};
