import React from 'react';
import PropTypes from 'prop-types';
import ResultDetailExtension from './ResultDetailExtension';

export default function ResultDetail ({ data = {} }) {
  const extensions = [
    {
      id: 'fulltext',
      title: 'texte integral',
      customUsage: data.fulltext,
      isArray: true,
    },
    {
      id: 'metadata',
      title: 'métadonnées',
      customUsage: data.metadata,
      isArray: true,
    },
    {
      id: 'enrichments',
      title: 'enrichissements',
      customUsage: data.enrichments,
      isArray: false,
    },
    {
      id: 'annexes',
      title: 'annexes',
      customUsage: data.annexes,
      isArray: true,
    },
    {
      id: 'covers',
      title: 'couverture',
      customUsage: data.covers,
      isArray: true,
    },
  ];

  return (
    <div className='flex flex-col mb-8'>
      <div className='bg-istcolor-green-dark mb-4'>
        <h5 className='text-istcolor-white font-montserrat-semibold p-2'>{data.title}</h5>
      </div>
      <div className='px-[20px]'>
        <div className='flex justify-between'>
          <div className='flex flex-col w-3/5'>
            <div className='mb-4 line-clamp-6'>
              {data?.abstract || 'Pas de résumé pour ce résultat.'}
            </div>
            <div className='flex gap-8'>
              {extensions.map(ext => (
                <ResultDetailExtension
                  key={ext.id}
                  extension={ext}
                />
              ))}
            </div>
          </div>
          <div className='flex flex-col ml-[15px]'>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-[#337ab7] text-istcolor-white py-1 px-2 rounded'
              >
                {data?.corpusName}
              </span>
              <span
                className='inline-block text-xs bg-[#337ab7] text-istcolor-white py-1 px-2 rounded ml-2'
              >
                {data?.genre && data.genre[0]}
              </span>
            </div>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-[#337ab7] text-istcolor-white py-1 px-2 rounded line-clamp-1'
              >
                {data?.host?.title}
              </span>
            </div>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-istcolor-green-dark text-istcolor-white py-1 px-2 rounded mb-1'
              >
                {data?.arkIstex}
              </span>
            </div>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-istcolor-blue text-istcolor-white py-1 px-2 rounded'
              >
                Score : {data?.score}
              </span>
            </div>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-istcolor-blue text-istcolor-white py-1 px-2 rounded'
              >
                Mots : {data?.qualityIndicators?.pdfWordCount}
              </span>
            </div>
            <div className='flex justify-end mb-1'>
              <span
                className='inline-block text-xs bg-istcolor-blue text-istcolor-white py-1 px-2 rounded'
              >
                Publication : {data?.publicationDate}
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

ResultDetail.propTypes = {
  data: PropTypes.object,
};
