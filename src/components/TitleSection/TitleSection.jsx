import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

export default function TitleSection ({ num, title, infoTextContent, showTooltipContent }) {
  const toolTipButton = useRef(null);
  const simulateClick = () => {
    toolTipButton.current.click();
  };
  const firstUpdate = useRef(true);
  useEffect(() => {
    if (!firstUpdate.current) simulateClick();
    firstUpdate.current = false;
  }, [showTooltipContent]);

  return (
    <div className='flex justify-between items-center pb-[5px] text-istcolor-black mt-2 mb-2 border-b-2 border-istcolor-black'>
      <h2 className='flex font-montserrat-bold text-center'>
        <span className='rounded-full bg-istcolor-green-dark h-auto w-[3rem] text-[20px] md:text-[30px] mr-2'>
          {`${num}.`}
        </span>
        <span className='text-[30px]'>
          {title}
        </span>
      </h2>
      <Tooltip
        trigger='click'
        content={infoTextContent}
      >
        <button ref={toolTipButton}>
          <FontAwesomeIcon icon='circle-info' size='2x' className='text-istcolor-blue cursor-pointer' />
        </button>
      </Tooltip>
    </div>
  );
}

TitleSection.propTypes = {
  num: PropTypes.string,
  title: PropTypes.string,
  showTooltipContent: PropTypes.bool,
  infoTextContent: PropTypes.node,
};
