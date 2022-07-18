import React from 'react';
import { useSelector } from 'react-redux';
import { LinkIcon } from '@heroicons/react/solid';

export default function ShareButton () {
  const queryString = useSelector(state => state.istexApi.queryString);
  const selectedFormats = useSelector(state => state.istexApi.selectedFormats);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const compressionLevel = useSelector(state => state.istexApi.compressionLevel);
  const archiveType = useSelector(state => state.istexApi.archiveType);

  const isFormIncomplete = queryString === '' ||
    !selectedFormats ||
    !rankingMode ||
    !numberOfDocuments ||
    compressionLevel == null || // We can't just do !compressionLevel because 0 is a valid value
    !archiveType;

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => window.alert(`${window.location.href} copied to clipboard!`))
      .catch(() => window.alert(`${window.location.href} failed to copy to clipboard!`));
  };

  return (
    <div className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white'>
      <div className=''>
        <LinkIcon className='h-12 w-12' />
      </div>
      <button className='istex-footer__text' onClick={copyLinkToClipboard} disabled={isFormIncomplete}>Partager</button>
    </div>
  );
}
