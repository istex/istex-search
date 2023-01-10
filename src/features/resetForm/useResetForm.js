import { istexApiConfig, queryModes } from '@/config';
import { noFormatSelected } from '@/lib/istexApi';
import { useUrlSearchParamsContext } from '@/contexts/UrlSearchParamsContext';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

export default function useResetForm () {
  const { resetUrlSearchParams } = useUrlSearchParamsContext();
  const { eventEmitter, events } = useEventEmitterContext();

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
