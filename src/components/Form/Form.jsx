import React from 'react';
import QuerySection from '../QuerySection';
import UsageSection from '../UsageSection';
import DownloadSection from '../DownloadSection';
import Navbar from '../Navbar';

export default function Form () {
  return (
    <>
      <QuerySection />
      <UsageSection />
      <DownloadSection />
      <Navbar />
    </>
  );
}
