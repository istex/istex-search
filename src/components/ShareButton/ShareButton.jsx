import React from 'react';
import { useSelector } from 'react-redux';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

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

  console.log({ isFormIncomplete });

  const copyLinkToClipboard = () => {
    navigator.clipboard.writeText(window.location.href)
      .then(() => window.alert(`${window.location.href} copied to clipboard!`))
      .catch(() => window.alert(`${window.location.href} failed to copy to clipboard!`));
  };

  return (
    <div
      className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white'
      onClick={copyLinkToClipboard}
    >
      <div className=''>
        <FontAwesomeIcon icon='link' size='3x' />
      </div>
      <button className='istex-footer__text pt-1' disabled={isFormIncomplete}>Partager</button>
    </div>
  );
}
