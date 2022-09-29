import React, { useRef, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

import { formats as formatInfoText } from '../Format/infoTooltip';
import Format from '../Format/Format';
import IndeterminateCheckbox from './IndeterminateCheckbox';

export const CHECKBOX_STATES = {
  Checked: 'Checked',
  Indeterminate: 'Indeterminate',
  Empty: 'Empty',
};

export default function CategoryFormat ({
  formatCategory,
  toggleWholeCategory,
  isWholeCategorySelected,
  formats,
}) {
  const [indeterminate, setIndeterminate] = useState(false);
  const [selectedFormatInsideCategory, setSelectedFormatInsideCategory] = useState([]);
  const nodeRef = useRef();
  const isChecked = isWholeCategorySelected(formatCategory);
  const subFormats = Object.keys(formats[formatCategory].formats);

  const handleChange = (event) => {
    toggleWholeCategory(event);
    setIndeterminate(false);
    setSelectedFormatInsideCategory(subFormats.map(formatName => formats[formatCategory]?.formats[formatName]?.label));
  };

  const onCloseClick = () => {
    nodeRef.current.click();
  };

  useEffect(() => {
    if (selectedFormatInsideCategory.length > 0 && selectedFormatInsideCategory.length < subFormats.length) {
      setIndeterminate(true);
    } else {
      setIndeterminate(false);
    }
  }, [selectedFormatInsideCategory]);

  return (
    <div
      className='mx-5'
    >
      <div className='flex items-center mb-4'>
        <IndeterminateCheckbox
          formatCategory={formatCategory}
          onChange={handleChange}
          checked={isChecked}
          indeterminate={indeterminate}
        />
        <label
          htmlFor={`checkbox-${formatCategory}`}
          className='flex items-center font-bold capitalize pl-2'
        >
          <span className='text-sm'>{formats[formatCategory].label}</span>
          <Tooltip
            trigger='click'
            content={
              <>
                <div className='flex w-full justify-end relative left-1'>
                  <button type='button' onClick={() => onCloseClick()} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                {formatInfoText[formatCategory].infoText}
              </>
            }
          >
            <button ref={(ref) => { nodeRef.current = ref; }}>
              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue pl-2 cursor-pointer' />
            </button>
          </Tooltip>
        </label>
      </div>
      {subFormats.map(formatName => (
        <Format
          key={formats[formatCategory]?.formats[formatName]?.label}
          name={formats[formatCategory]?.formats[formatName]?.label}
          value={formats[formatCategory]?.formats[formatName]?.value}
          infoText={formatInfoText[formatCategory]?.formats[formatName]?.infoText}
          className='pl-5'
          handleChange={handleChange}
          setSelectedFormatInsideCategory={setSelectedFormatInsideCategory}
          selectedFormatInsideCategory={selectedFormatInsideCategory}
        />
      ))}
    </div>
  );
}

CategoryFormat.propTypes = {
  formatCategory: PropTypes.string,
  toggleWholeCategory: PropTypes.func,
  isWholeCategorySelected: PropTypes.func,
  formats: PropTypes.object,
};
