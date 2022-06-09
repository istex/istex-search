import React from 'react';
import { resetFormat } from '../../lib/istexApi';
import { istexApiConfig, queryModes } from '../../config';
import eventEmitter, { events } from '../../lib/eventEmitter';

export function resetForm () {
  eventEmitter.emit(events.setQueryMode, queryModes.getDefault());
  eventEmitter.emit(events.setQueryString, '');
  eventEmitter.emit(events.setQId, '');
  eventEmitter.emit(events.setNumberOfDocuments, 0);
  eventEmitter.emit(events.setRankingMode, istexApiConfig.rankingModes.getDefault());
  eventEmitter.emit(events.setSelectedFormats, resetFormat());
  eventEmitter.emit(events.setCompressionLevel, istexApiConfig.compressionLevels.getDefault().value);
  eventEmitter.emit(events.setArchiveType, istexApiConfig.archiveTypes.getDefault());
  eventEmitter.emit(events.setUsage, '');
  eventEmitter.emit(events.resetResultPreview);

  eventEmitter.emit(events.resetUrlParams);
}

export default function ResetButton () {
  return (
    <div>
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
