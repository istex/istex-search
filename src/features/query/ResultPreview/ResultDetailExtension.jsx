import React from 'react';
import PropTypes from 'prop-types';

export default function ResultDetailExtension ({
  extension,
}) {
  const {
    title,
    documentFormats,
    isArray,
  } = extension;
  let list;

  if (!documentFormats) {
    return null;
  }

  if (isArray) {
    list = documentFormats.map((item, index) => (
      <div className='inline-block relative' key={index}>
        <a href={item.uri} target='_blank' rel='noreferrer'>
          <img src={`/images/extensions/${item.extension === 'cleaned' ? 'txt' : item.extension}.png`} alt='icone extension' />
        </a>
        {item.extension === 'cleaned' && (
          <span
            className='absolute italic rotate-[17deg] scale-[0.8] skew-x-[1deg] skew-y-[1deg] translate-x-0 translate-y-0 bg-[#F1DB32] text-istcolor-black text-xs left-0 top-0 -ml-2'
          >
            cleaned
          </span>
        )}
      </div>
    ));
  } else {
    list = Object.entries(documentFormats).map(([itemName, item], index) => (
      <div className='inline-block relative' key={index}>
        <a href={item[0].uri} target='_blank' rel='noreferrer'>
          <img src={`/images/extensions/${item[0].extension}.png`} alt='icone extension' />
        </a>
        <span
          className='absolute italic rotate-[17deg] scale-[0.8] skew-x-[1deg] skew-y-[1deg] translate-x-0 translate-y-0 bg-[#F1DB32] text-istcolor-black text-xs left-0 top-0 -ml-2'
        >
          {itemName}
        </span>
      </div>
    ));
  }

  return (
    <div>
      <h5 className='text-istcolor-grey-dark mb-2 capitalize text-sm'>{title}</h5>
      <div className='grid grid-cols-2 gap-2 w-4/5'>
        {list}
      </div>
    </div>
  );
}

ResultDetailExtension.propTypes = {
  extension: PropTypes.object,
};
