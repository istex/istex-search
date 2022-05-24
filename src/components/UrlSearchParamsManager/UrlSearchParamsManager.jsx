import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { parseExtractParams } from '../../lib/istexApi';
import { isValidMd5 } from '../../lib/utils';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { istexApiConfig, usages } from '../../config';

export default function UrlSearchParamsManager () {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = searchParams.get('q');
  const qId = searchParams.get('q_id');
  const extractParamsAsString = searchParams.get('extract');
  const numberOfDocumentsAsString = searchParams.get('size');
  const rankingMode = searchParams.get('rankBy');
  const compressionLevelAsString = searchParams.get('compressionLevel');
  const archiveType = searchParams.get('archiveType');
  const usage = searchParams.get('usage');

  const fillFormFromUrlSearchParams = () => {
    // For each URL search parameter, we check if it's defined (it might still be an empty string).
    // We need to make sure it's defined to avoid force setting an URL parameter when it was not defined
    // in the first place. We just want to correct them when they're defined but have an invalid value.

    if (queryString && qId) {
      // The 'q' and 'q_id' URL search parameters cannot be set at the same time so, if it's the case,
      // we removed them from the URL and an error message is displayed in UI
      searchParams.delete('q');
      searchParams.delete('q_id');

      // TODO: display an error modal or something else that says that 'q' and 'q_id' cannot be set at
      // the same time
    } else if (queryString) {
      eventEmitter.emit(events.queryInputChanged, queryString);
    } else if (isValidMd5(qId)) {
      eventEmitter.emit(events.qIdChanged, qId);
    }

    if (extractParamsAsString != null) {
      const selectedFormats = parseExtractParams(decodeURIComponent(extractParamsAsString));
      eventEmitter.emit(events.formatsChanged, selectedFormats);
    }

    if (numberOfDocumentsAsString != null) {
      let numberOfDocuments = parseInt(numberOfDocumentsAsString);

      if (isNaN(numberOfDocuments) || numberOfDocuments < 0) {
        numberOfDocuments = 0;
      }

      eventEmitter.emit(events.numberOfDocumentsChanged, numberOfDocuments);
    }

    if (rankingMode != null) {
      let rankingModeToUse = rankingMode;

      if (!istexApiConfig.rankingModes.modes.includes(rankingModeToUse)) {
        rankingModeToUse = istexApiConfig.rankingModes.getDefault();
      }

      eventEmitter.emit(events.rankingModeChanged, rankingModeToUse);
    }

    if (compressionLevelAsString != null) {
      let compressionLevel = parseInt(compressionLevelAsString);

      if (isNaN(compressionLevel) || !istexApiConfig.compressionLevels.levels.find(({ value }) => compressionLevel === value)) {
        compressionLevel = istexApiConfig.compressionLevels.getDefault().value;
      }

      eventEmitter.emit(events.compressionLevelChanged, compressionLevel);
    }

    if (archiveType != null) {
      let archiveTypeToUse = archiveType;

      if (!istexApiConfig.archiveTypes.types.includes(archiveType)) {
        archiveTypeToUse = istexApiConfig.archiveTypes.getDefault();
      }

      eventEmitter.emit(events.archiveTypeChanged, archiveTypeToUse);
    }

    if (usage != null) {
      if (Object.keys(usages).includes(usage)) {
        eventEmitter.emit(events.usageChanged, usage);
      } else {
        searchParams.delete('usage');
      }
    }

    setSearchParams(searchParams);
  };

  const setUrlSearchParam = (name, value) => {
    if (!value) {
      searchParams.delete(name);
    } else {
      searchParams.set(name, value);
    }

    setSearchParams(searchParams);
  };

  const setQueryStringParam = queryStringParam => {
    if (searchParams.has('q_id')) searchParams.delete('q_id');

    setUrlSearchParam('q', queryStringParam);
  };

  const setQIdParam = qIdParam => {
    if (searchParams.has('q')) searchParams.delete('q');

    setUrlSearchParam('q_id', qIdParam);
  };

  const resetSearchParams = () => {
    setSearchParams({});
  };

  useEffect(() => {
    fillFormFromUrlSearchParams();

    eventEmitter.addListener(events.updateQueryStringParam, setQueryStringParam);
    eventEmitter.addListener(events.updateQIdParam, setQIdParam);
    eventEmitter.addListener(events.updateNumberOfDocumentsParam, newSize => setUrlSearchParam('size', newSize));
    eventEmitter.addListener(events.updateRankingModeParam, newRankingMode => setUrlSearchParam('rankBy', newRankingMode));
    eventEmitter.addListener(events.updateExtractParam, newExtractParam => setUrlSearchParam('extract', newExtractParam));
    eventEmitter.addListener(events.updateCompressionLevelParam, newCompressionLevel => setUrlSearchParam('compressionLevel', newCompressionLevel));
    eventEmitter.addListener(events.updateArchiveTypeParam, newArchiveType => setUrlSearchParam('archiveType', newArchiveType));
    eventEmitter.addListener(events.updateUsageParam, newUsage => setUrlSearchParam('usage', newUsage));
    eventEmitter.addListener(events.resetSearchParams, resetSearchParams);
  }, []);

  return null;
}
