import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import PropTypes from 'prop-types';

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

export default function ResetButton ({ className, sizeIcon, fontSizeText }) {
  return (
    <div
      className={className}
      onClick={resetForm}
    >
      <div>
        <FontAwesomeIcon icon='eraser' className={sizeIcon} />
      </div>
      <span className={fontSizeText}>Réinitialiser</span>
    </div>
  );
}

ResetButton.propTypes = {
  className: PropTypes.string,
  sizeIcon: PropTypes.string,
  fontSizeText: PropTypes.string,
};
