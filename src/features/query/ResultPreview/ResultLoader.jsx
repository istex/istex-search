import React from 'react';

export default function ResultLoader () {
  return (
    <div className='grid grid-cols-1 gap-y-2 auto-rows-fr md:gap-x-8 md:gap-y-4 md:grid-cols-3 md:mr-4 w-full'>
      {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((result, index) => (
        <div
          key={index}
          className='flex flex-col justify-between text-istcolor-blue hover:text-istcolor-black border-[1px] py-2 border-l-[10px] border-istcolor-blue hover:border-istcolor-black px-2 cursor-pointer hover:bg-istcolor-green-light'
        >
          <div className='p-3 max-w-sm w-full mx-auto'>
            <div className='animate-pulse flex space-x-4'>
              <div className='flex-1 space-y-6 py-1'>
                <div className='h-2 bg-istcolor-blue rounded' />
                <div className='h-2 bg-istcolor-blue rounded' />
                <div className='space-y-3'>
                  <div className='grid grid-cols-3 gap-4'>
                    <div className='h-2 bg-istcolor-blue rounded col-span-2' />
                    <div className='h-2 bg-istcolor-blue rounded col-span-1' />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
