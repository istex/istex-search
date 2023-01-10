import React from 'react';
import PropTypes from 'prop-types';

import Format from './Format';
import { formats as formatInfoText } from './infoTooltip';

export default function NoCategoryFormat ({
  formatCategory,
  formats,
}) {
  return (
    <div className='font-semibold mx-5 md:mx-0'>
      <Format
        isSubCategory={false}
        className='font-bold '
        name={formats[formatCategory].label}
        value={formats[formatCategory].value}
        infoText={formatInfoText[formatCategory].infoText}
      />
    </div>
  );
}

NoCategoryFormat.propTypes = {
  formatCategory: PropTypes.string,
  formats: PropTypes.object,
};
