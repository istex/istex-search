import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import eventEmitter from '../../lib/eventEmitter';
import { parseExtractParams } from '../../lib/istexApi';
import { isValidMd5 } from '../../lib/utils';
import { istexApiConfig, compressionLevels } from '../../config';

export default function UrlSearchParamsManager () {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = searchParams.get('q');
  const qId = searchParams.get('q_id');
  const extractParamsAsString = searchParams.get('extract');
  const numberOfDocumentsAsString = searchParams.get('size');
  const rankingMode = searchParams.get('rankBy');
  const compressionLevelAsString = searchParams.get('compressionLevel');
  const archiveType = searchParams.get('archiveType');

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
      eventEmitter.emit('queryInputChanged', queryString);
    } else if (isValidMd5(qId)) {
      eventEmitter.emit('qIdChanged', qId);
    }

    if (extractParamsAsString != null) {
      const selectedFormats = parseExtractParams(decodeURIComponent(extractParamsAsString));
      eventEmitter.emit('formatsChanged', selectedFormats);
    }

    if (numberOfDocumentsAsString != null) {
      let numberOfDocuments = parseInt(numberOfDocumentsAsString);

      if (isNaN(numberOfDocuments) || numberOfDocuments < 0) {
        numberOfDocuments = 0;
      }

      eventEmitter.emit('numberOfDocumentsChanged', numberOfDocuments);
    }

    if (rankingMode != null) {
      let rankingModeToUse = rankingMode;

      if (!istexApiConfig.rankingModes.includes(rankingModeToUse)) {
        rankingModeToUse = istexApiConfig.rankingModes[0];
      }

      eventEmitter.emit('rankingModeChanged', rankingModeToUse);
    }

    if (compressionLevelAsString != null) {
      let compressionLevel = parseInt(compressionLevelAsString);

      if (isNaN(compressionLevel) || !compressionLevels.find(({ value }) => compressionLevel === value)) {
        compressionLevel = compressionLevels[0].value;
      }

      eventEmitter.emit('compressionLevelChanged', compressionLevel);
    }

    if (archiveType != null) {
      let archiveTypeToUse = archiveType;

      if (!istexApiConfig.archiveTypes.includes(archiveType)) {
        archiveTypeToUse = istexApiConfig.archiveTypes[0];
      }

      eventEmitter.emit('archiveTypeChanged', archiveTypeToUse);
    }
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

    eventEmitter.addListener('updateQueryStringParam', setQueryStringParam);
    eventEmitter.addListener('updateQIdParam', setQIdParam);
    eventEmitter.addListener('updateNumberOfDocumentsParam', newSize => setUrlSearchParam('size', newSize));
    eventEmitter.addListener('updateRankingModeParam', newRankingMode => setUrlSearchParam('rankBy', newRankingMode));
    eventEmitter.addListener('updateExtractParam', newExtractParam => setUrlSearchParam('extract', newExtractParam));
    eventEmitter.addListener('updateCompressionLevelParam', newCompressionLevel => setUrlSearchParam('compressionLevel', newCompressionLevel));
    eventEmitter.addListener('updateArchiveTypeParam', newArchiveType => setUrlSearchParam('archiveType', newArchiveType));
    eventEmitter.addListener('resetSearchParams', resetSearchParams);
  }, []);

  return null;
}
