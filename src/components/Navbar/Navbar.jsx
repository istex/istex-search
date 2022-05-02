import React from 'react';
import ResetButton from '../ResetButton';
import FetchButton from '../FetchButton';
import ShareButton from '../ShareButton';
import HistoryButton from '../HistoryButton';

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
