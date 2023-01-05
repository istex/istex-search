import { useState, useRef, useEffect } from 'react';

import eventEmitter, { events } from '@/lib/eventEmitter';
import { istexApiConfig, queryModes } from '@/config';
import { noFormatSelected } from '@/lib/istexApi';
import { useUrlSearchParamsContext } from '@/contexts/UrlSearchParamsContext';

export const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => { htmlElRef.current && htmlElRef.current.focus(); };

  return [htmlElRef, setFocus];
};

export const useStateWithCallback = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const setValueAndCallback = (newValue, callback) => {
    setValue(prevValue => {
      if (callback) {
        callback(prevValue, newValue);
      }

      return newValue;
    });
  };

  return [value, setValueAndCallback];
};

// custom hook for getting previous value
export const usePrevious = value => {
  const ref = useRef();
  useEffect(() => {
    ref.current = value;
  }, [value]);
  return ref.current;
};

export function useResetForm () {
  const { resetUrlSearchParams } = useUrlSearchParamsContext();

  return () => {
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

    resetUrlSearchParams();
  };
}
