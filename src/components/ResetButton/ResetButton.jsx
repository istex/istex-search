import React from 'react';
import { resetFormat } from '../../lib/istexApi';
import { istexApiConfig, queryModes, compressionLevels } from '../../config';
import eventEmitter, { events } from '../../lib/eventEmitter';

export default function ResetButton () {
  const resetForm = () => {
    eventEmitter.emit(events.queryModeChanged, queryModes[0]);
    eventEmitter.emit(events.queryInputChanged, null);
    eventEmitter.emit(events.numberOfDocumentsChanged, 0);
    eventEmitter.emit(events.rankingModeChanged, istexApiConfig.rankingModes[0]);
    eventEmitter.emit(events.formatsChanged, resetFormat());
    eventEmitter.emit(events.compressionLevelChanged, compressionLevels[0].value);
    eventEmitter.emit(events.archiveTypeChanged, istexApiConfig.archiveTypes[0]);
    eventEmitter.emit(events.resetResultPreview);

    eventEmitter.emit(events.resetSearchParams);
  };

  return (
    <div>
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
