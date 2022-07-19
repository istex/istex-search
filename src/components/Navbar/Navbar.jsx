import React from 'react';

import './Navbar.scss';
import ResetButton from '../ResetButton/ResetButton';
import FetchButton from '../FetchButton/FetchButton';
import ShareButton from '../ShareButton/ShareButton';
import HistoryButton from '../HistoryButton/HistoryButton';

export default function Navbar () {
  return (
    <div className='istex-footer flex justify-center'>
      <ResetButton />
      <FetchButton />
      <ShareButton />
      <HistoryButton />
    </div>
  );
}
