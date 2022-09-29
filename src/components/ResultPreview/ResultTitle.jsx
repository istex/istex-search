import React from 'react';
import PropTypes from 'prop-types';

export default function ResultTitle ({ shouldDisplayResultDetail, setShouldDisplayResultDetail }) {
  const handleClick = () => {
    if (!shouldDisplayResultDetail) {
      return;
    }

    setShouldDisplayResultDetail(false);
  };

  return (
    <h4 className='font-semibold border-[#303030] border-b-[1px] mb-4'>
      <span className={`${shouldDisplayResultDetail && 'cursor-pointer'}`} onClick={handleClick}>Parcourir les résultats</span>{' '}
      {shouldDisplayResultDetail && <span className='text-istcolor-grey-medium'>/ Document ISTEX</span>}
    </h4>
  );
}

ResultTitle.propTypes = {
  shouldDisplayResultDetail: PropTypes.bool,
  setShouldDisplayResultDetail: PropTypes.func,
};
