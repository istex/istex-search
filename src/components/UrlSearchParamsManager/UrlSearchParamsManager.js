import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import eventEmitter from '../../lib/eventEmitter';
import { parseExtractParams } from '../../lib/istexApi';
import { istexApiConfig, compressionLevels } from '../../config';

export default function UrlSearchParamsManager () {
  const [searchParams, setSearchParams] = useSearchParams();

  const queryString = searchParams.get('q');
  const extractParamsAsString = searchParams.get('extract');
  const numberOfDocumentsAsString = searchParams.get('size');
  const rankingMode = searchParams.get('rankBy');
  const compressionLevelAsString = searchParams.get('compressionLevel');
  const archiveType = searchParams.get('archiveType');

  const fillFormFromUrlSearchParams = () => {
    // For each URL search parameter, we check if it's defined (it might still be an empty string).
    // We need to make sure it's defined to avoid force setting an URL parameter when it was not defined
    // in the first place. We just want to correct them when they're defined but have an invalid value.

    if (queryString) {
      eventEmitter.emit('queryInputChanged', queryString);
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

  const resetSearchParams = () => {
    setSearchParams({});
  };

  useEffect(() => {
    fillFormFromUrlSearchParams();

    eventEmitter.addListener('updateQueryStringParam', value => setUrlSearchParam('q', value));
    eventEmitter.addListener('updateNumberOfDocumentsParam', value => setUrlSearchParam('size', value));
    eventEmitter.addListener('updateRankingModeParam', value => setUrlSearchParam('rankBy', value));
    eventEmitter.addListener('updateExtractParam', value => setUrlSearchParam('extract', value));
    eventEmitter.addListener('updateCompressionLevelParam', value => setUrlSearchParam('compressionLevel', value));
    eventEmitter.addListener('updateArchiveTypeParam', value => setUrlSearchParam('archiveType', value));
    eventEmitter.addListener('resetSearchParams', resetSearchParams);
  }, []);

  return null;
}
