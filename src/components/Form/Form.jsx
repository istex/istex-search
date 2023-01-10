import React from 'react';

import QuerySection from '@/sections/query/QuerySection';
import UsageSection from '@/sections/usage/UsageSection';
import DownloadSection from '../DownloadSection/DownloadSection';

export default function Form () {
  return (
    <main className='w-full container md:w-[1170px] mx-auto'>
      <QuerySection />
      <UsageSection />
      <DownloadSection />
    </main>
  );
}
