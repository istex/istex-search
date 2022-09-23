import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { examples } from './examplesRequests';

export default function ExamplesList ({ onClickExample }) {
  return examples.map((example) =>
    <div
      className='flex mt-[20px]'
      key={example.text.toString()}
    >
      <Tooltip content='Essayez cette requête'>
        <button
          onClick={() => onClickExample(example)}
        >
          <FontAwesomeIcon icon='magnifying-glass' className='text-2xl' />
        </button>
      </Tooltip>
      <span className='ml-[20px]'>{example.text}</span>
    </div>,
  );
}

ExamplesList.propTypes = {
  onClickExample: PropTypes.func,
};
