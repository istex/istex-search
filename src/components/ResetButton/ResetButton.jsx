import React from 'react';
import { resetFormat } from '../../lib/istexApi';
import { istexApiConfig, queryModes } from '../../config';
import eventEmitter, { events } from '../../lib/eventEmitter';

export default function ResetButton () {
  const resetForm = () => {
    eventEmitter.emit(events.queryModeChanged, queryModes[0]);
    eventEmitter.emit(events.queryInputChanged, null);
    eventEmitter.emit(events.numberOfDocumentsChanged, 0);
    eventEmitter.emit(events.rankingModeChanged, istexApiConfig.rankingModes.getDefault());
    eventEmitter.emit(events.formatsChanged, resetFormat());
    eventEmitter.emit(events.compressionLevelChanged, istexApiConfig.compressionLevels.getDefault().value);
    eventEmitter.emit(events.archiveTypeChanged, istexApiConfig.archiveTypes.getDefault());
    eventEmitter.emit(events.resetResultPreview);

    eventEmitter.emit(events.resetSearchParams);
  };

  return (
    <div>
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
