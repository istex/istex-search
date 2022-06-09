import React from 'react';
import QuerySection from '../QuerySection/QuerySection';
import UsageSection from '../UsageSection/UsageSection';
import DownloadSection from '../DownloadSection/DownloadSection';
import Navbar from '../Navbar/Navbar';

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
