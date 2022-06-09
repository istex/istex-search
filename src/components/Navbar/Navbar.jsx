import React from 'react';
import ResetButton from '../ResetButton/ResetButton';
import FetchButton from '../FetchButton/FetchButton';
import ShareButton from '../ShareButton/ShareButton';
import HistoryButton from '../HistoryButton/HistoryButton';

export default function Navbar () {
  return (
    <>
      <h2>Navbar</h2>
      <ResetButton />
      <FetchButton />
      <ShareButton />
      <HistoryButton />
    </>
  );
}
