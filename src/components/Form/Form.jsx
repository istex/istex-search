import React from 'react';

import QuerySection from '../QuerySection/QuerySection';
import UsageSection from '../UsageSection/UsageSection';
import DownloadSection from '../DownloadSection/DownloadSection';

export default function Form () {
  return (
    <main className='w-full px-4 md:p-0 md:w-[1170px] md:mx-auto'>
      <QuerySection />
      <UsageSection />
      <DownloadSection />
    </main>
  );
}
