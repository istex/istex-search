import React from 'react';

import QuerySection from '@/sections/QuerySection';
import UsageSection from '@/sections/UsageSection';
import DownloadSection from '@/sections/DownloadSection';

export default function Form () {
  return (
    <main className='w-full container md:w-[1170px] mx-auto'>
      <QuerySection />
      <UsageSection />
      <DownloadSection />
    </main>
  );
}
