import React from 'react';
import { resetFormat } from '../../lib/istexApi';
import { istexApiConfig, queryModes, compressionLevels } from '../../config';
import eventEmitter from '../../lib/eventEmitter';

export default function ResetButton () {
  const resetForm = () => {
    eventEmitter.emit('queryModeChanged', queryModes[0]);
    eventEmitter.emit('queryInputChanged', null);
    eventEmitter.emit('numberOfDocumentsChanged', 0);
    eventEmitter.emit('rankingModeChanged', istexApiConfig.rankingModes[0]);
    eventEmitter.emit('formatsChanged', resetFormat());
    eventEmitter.emit('compressionLevelChanged', compressionLevels[0].value);
    eventEmitter.emit('archiveTypeChanged', istexApiConfig.archiveTypes[0]);
    eventEmitter.emit('fullUrlChanged', '');
    eventEmitter.emit('resetResultPreview');

    eventEmitter.emit('resetSearchParams');
  };

  return (
    <div>
      <button onClick={resetForm}>Reset Form</button>
    </div>
  );
}
