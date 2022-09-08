import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { noFormatSelected } from '../../lib/istexApi';
import { istexApiConfig, queryModes } from '../../config';
import eventEmitter, { events } from '../../lib/eventEmitter';

export function resetForm () {
  eventEmitter.emit(events.setQueryMode, queryModes.getDefault().value);
  eventEmitter.emit(events.setQueryString, '');
  eventEmitter.emit(events.setQId, '');
  eventEmitter.emit(events.setNumberOfDocuments, 0);
  eventEmitter.emit(events.setRankingMode, istexApiConfig.rankingModes.getDefault().value);
  eventEmitter.emit(events.setSelectedFormats, noFormatSelected());
  eventEmitter.emit(events.setCompressionLevel, istexApiConfig.compressionLevels.getDefault().value);
  eventEmitter.emit(events.setArchiveType, istexApiConfig.archiveTypes.getDefault().value);
  eventEmitter.emit(events.setUsage, '');
  eventEmitter.emit(events.resetResultPreview);

  eventEmitter.emit(events.resetUrlParams);
}

export default function ResetButton () {
  return (
    <div
      className='flex flex-col justify-between istex-footer__link items-center mx-5 cursor-pointer hover:text-white istex-footer__icon'
      onClick={resetForm}
    >
      <div className='pb-2'>
        <FontAwesomeIcon icon='eraser' size='3x' />
      </div>
      <button className='istex-footer__text pt-1'>Réinitialiser</button>
    </div>
  );
}
