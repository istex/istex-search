import React from 'react';
import QuerySection from '../QuerySection/QuerySection';
import UsageSection from '../UsageSection/UsageSection';
import DownloadSection from '../DownloadSection/DownloadSection';

export default function Form() {
  return (
    <main className='form-istex container mx-auto'>
      <QuerySection />
      <UsageSection />
      <DownloadSection />
    </main>
  );
}
