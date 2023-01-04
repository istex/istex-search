import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { istexApiConfig, queryModes } from '../../config';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { noFormatSelected } from '../../lib/istexApi';

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
  eventEmitter.emit(events.resetMessageImportCorpus);

  eventEmitter.emit(events.resetUrlParams);
}

export default function ResetButton () {
  return (
    <div
      className='flex flex-col justify-between items-center cursor-pointer hover:bg-istcolor-white hover:rounded-md p-1.5 text-istcolor-black'
      onClick={resetForm}
    >
      <div>
        <FontAwesomeIcon icon='eraser' className='text-3xl md:text-4xl' />
      </div>
      <span className='text-center align-top'>Réinitialiser</span>
    </div>
  );
}
