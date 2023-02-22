import React, { useState, useEffect, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Tooltip } from 'flowbite-react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import SectionTitle from '@/components/SectionTitle';
import QueryInput from '@/features/query/QueryInput';
import ResultPreview from '@/features/query/ResultPreview/ResultPreview';
import FeedbackMessage, { FeedbackMessageTypes } from '@/components/FeedbackMessage';

import { setNumberOfDocuments, setRankingMode } from '@/store/istexApiSlice';
import { sendResultPreviewApiRequest } from '@/lib/istexApi';
import { asyncDebounce } from '@/lib/utils';
import { istexApiConfig } from '@/config';
import usePrevious from '@/hooks/usePrevious';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

import './QuerySection.scss';

const sendDelayedResultPreviewApiRequest = asyncDebounce(sendResultPreviewApiRequest);

export default function QuerySection () {
  const dispatch = useDispatch();
  const queryString = useSelector(state => state.istexApi.queryString);
  const numberOfDocuments = useSelector(state => state.istexApi.numberOfDocuments);
  const rankingMode = useSelector(state => state.istexApi.rankingMode);
  const [currentRankingMode, setCurrentRankingMode] = useState(istexApiConfig.rankingModes.getDefault().value);
  const [resultPreviewResults, setResultPreviewResults] = useState([]);
  const [totalAmountOfDocuments, setTotalAmountOfDocuments] = useState(0);
  const [pageUrls, setPageUrls] = useState({ lastPageURI: '', nextPageURI: '', prevPageURI: '', firstPageURI: '' });
  const [currentPageURI, setCurrentPageURI] = useState('');
  const prevCurrentPageURI = usePrevious(currentPageURI);
  const [isLoading, setLoading] = useState(false);
  const [showTooltipContent, setShowTooltipContent] = useState(true);
  const docNumberToolTip = useRef(null);
  const docClassedToolTip = useRef(null);
  const [errorMessage, setErrorMessage] = useState('');
  const { eventEmitter, events } = useEventEmitterContext();

  const numberOfDocumentsHandler = newNumberOfDocuments => {
    if (!isNaN(newNumberOfDocuments)) {
      // If the number of results from the request is greater than istexApiConfig.maxAmountOfDocuments,
      // cap maxAmountOfDownloadableDocuments to istexApiConfig.maxAmountOfDocuments
      const maxValue = totalAmountOfDocuments > 0
        ? Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments)
        : istexApiConfig.maxAmountOfDocuments;

      newNumberOfDocuments = Math.min(newNumberOfDocuments, maxValue);

      dispatch(setNumberOfDocuments(newNumberOfDocuments));

      eventEmitter.emit(events.setNumberOfDocumentsUrlParam, newNumberOfDocuments);
      eventEmitter.emit(events.setNumberOfDocumentsInLastRequestOfHistory, newNumberOfDocuments);
    }
  };

  const rankingModeHandler = newRankingMode => {
    setCurrentRankingMode(newRankingMode);
    dispatch(setRankingMode(newRankingMode));

    eventEmitter.emit(events.setRankingModeUrlParam, newRankingMode);
    eventEmitter.emit(events.setRankingModeInLastRequestOfHistory, newRankingMode);
  };

  const resultPreviewResponseReceivedHandler = response => {
    const { data } = response;

    setResultPreviewResults(data.hits);
    setTotalAmountOfDocuments(data.total);
    setPageUrls({
      lastPageURI: data.lastPageURI,
      nextPageURI: data.nextPageURI,
      prevPageURI: data.prevPageURI,
      firstPageURI: data.firstPageURI,
    });
  };

  const resetResultPreviewHandler = () => {
    setResultPreviewResults([]);
    setTotalAmountOfDocuments(0);
    setLoading(false);
  };

  // If queryString or rankingMode change, update the results preview
  useEffect(() => {
    setLoading(true);
    setErrorMessage('');
    if (!queryString) {
      sendDelayedResultPreviewApiRequest.cancel();
      setLoading(false);
      return;
    }

    const paginationQueryString = prevCurrentPageURI !== currentPageURI ? currentPageURI : '';
    sendDelayedResultPreviewApiRequest(queryString, rankingMode, paginationQueryString).then(response => {
      eventEmitter.emit(events.resultPreviewResponseReceived, response);
    }).catch(error => {
      setErrorMessage(error.response.data?._error || `L'API Istex a renvoyé une erreur ${error.response.status}`);
      resetResultPreviewHandler();
    }).finally(() => setLoading(false));
  }, [queryString, rankingMode, currentPageURI]);

  useEffect(() => {
    eventEmitter.addListener(events.setNumberOfDocuments, numberOfDocumentsHandler);
    eventEmitter.addListener(events.setRankingMode, rankingModeHandler);
    eventEmitter.addListener(events.resultPreviewResponseReceived, resultPreviewResponseReceivedHandler);
    eventEmitter.addListener(events.resetResultPreview, resetResultPreviewHandler);
  }, []);

  const addClick = (value) => {
    value.current.click();
  };

  return (
    <div className='my-12'>
      <SectionTitle
        title='Requête'
        num='1'
        infoTextTitle=''
        infoTextContent={
          <>
            <div className='flex w-full justify-end relative left-1'>
              <button type='button' onClick={() => setShowTooltipContent(!showTooltipContent)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                <span className='sr-only'>Fermer l'info bulle</span>
                <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                </svg>
              </button>
            </div>
            <p className='text-sm text-white'>
              Pour interroger Istex, vous avez le<br />
              choix entre : un mode de recherche<br />
              classique par équation booléenne,<br />
              un mode de requêtage utilisant une<br />
              liste d’identifiants uniques pérennes<br />
              ou bien encore l’import d’un fichier<br />
              spécifiant un corpus de documents<br />
              au moyen d’identifiants uniques.<br />
              Le mode "Recherche assistée" vous<br />
              accompagne dans l'écriture d'une<br />
              équation booléenne.<br />
              Si vous avez besoin d'aide, consultez<br />
              la <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi--' rel='noreferrer'>documentation Istex</a> ou bien<br />
              contactez <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='mailto:contact@listes.istex.fr' rel='noreferrer'>l’équipe Istex</a>.
            </p>
          </>
        }
      />
      <p className='mb-4'>
        Explicitez le corpus souhaité en fonction de votre sélection parmi l’un des onglets ci-dessous :
      </p>
      <QueryInput />
      {errorMessage && (
        <div className='mb-2'>
          <FeedbackMessage type={FeedbackMessageTypes.Error} message={errorMessage} />
        </div>
      )}
      {queryString && !isLoading && !errorMessage && (
        <div className='my-4'>
          <span>L'équation saisie correspond à <strong>{totalAmountOfDocuments.toLocaleString()}</strong> document(s)</span>
          {totalAmountOfDocuments > istexApiConfig.maxAmountOfDocuments && (
            <div className='pl-4 text-sm inline-block align-middle'>
              <Tooltip
                placement='right'
                trigger='click'
                content={
                  <p className='text-sm text-white'>
                    Reformulez votre requête ou vous ne <br />
                    pourrez télécharger que les <span className='font-bold'>100 000</span> <br />
                    premiers documents sur <br />
                    <span className='font-bold'>{totalAmountOfDocuments.toLocaleString()}</span> de résultats potentiels.
                  </p>
                }
              >
                <button>
                  <FontAwesomeIcon icon='triangle-exclamation' className='text-istcolor-red' />
                </button>
              </Tooltip>
            </div>
          )}
        </div>
      )}
      {isLoading && (
        <div className='waiting-for-results-text'>
          Calcul en cours du nombre de résultats... &nbsp;
          <div className='waiting-for-results-icon-container'>
            <FontAwesomeIcon icon='magnifying-glass' className='text-istcolor-blue waiting-for-results-icon' />
          </div>
        </div>
      )}

      <div className='mb-4'>
        <label htmlFor='numberOfDocumentsInput pr-2'>
          Choisir le nombre de documents :
        </label>
        <div className='inline-block align-middle'>
          <Tooltip
            placement='right'
            trigger='click'
            content={
              <>
                <div className='flex w-full justify-end relative left-1'>
                  <button type='button' onClick={() => addClick(docNumberToolTip)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <p className='text-sm text-white'>
                  Actuellement, il n’est pas possible de<br />
                  télécharger plus de {istexApiConfig.maxAmountOfDocuments.toLocaleString()}<br />
                  documents. Cette valeur a été fixée <br />
                  arbitrairement, pour limiter le <br />
                  volume et la durée du <br />
                  téléchargement à des dimensions <br />
                  raisonnables.<br />
                  Si le nombre de documents à<br />
                  extraire est inférieur au nombre total<br />
                  des résultats correspondant à votre<br />
                  requête, le choix d’un mode de tri<br />
                  des documents peut vous intéresser<br />
                  (voir rubrique suivante).<br />
                </p>
              </>
            }
          >
            <button ref={docNumberToolTip}>
              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue pl-2 cursor-pointer' />
            </button>
          </Tooltip>
        </div>
        <input
          type='number'
          value={numberOfDocuments}
          min='0'
          max={Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments)}
          name='numberOfDocumentsInput'
          onChange={event => {
            const value = parseInt(event.target.value);
            numberOfDocumentsHandler(value);
          }}
          className='ml-5 border-[1px] border-istcolor-green-dark px-2 py-1 w-28 text-sm'
        />
        {!!totalAmountOfDocuments && (
          <div className='ml-2 inline-block'>
            <span> / {Math.min(totalAmountOfDocuments, istexApiConfig.maxAmountOfDocuments).toLocaleString()}</span>
            <button
              onClick={() => numberOfDocumentsHandler(totalAmountOfDocuments)}
              className='ml-2 px-2 py-1 bg-istcolor-green-dark hover:bg-istcolor-green-light text-white font-bold'
            >
              Tout
            </button>
          </div>
        )}
      </div>
      <div>
        <h4 className='mb-1 flex items-center'>
          Choisir les documents classés :
          <Tooltip
            placement='right'
            trigger='click'
            content={
              <>
                <div className='flex w-full justify-end relative left-1'>
                  <button type='button' onClick={() => addClick(docClassedToolTip)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                    <span className='sr-only'>Fermer l'info bulle</span>
                    <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                      <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                    </svg>
                  </button>
                </div>
                <p className='text-sm text-white'>
                  Dans le cas où vous ne téléchargez<br />
                  qu’un sous-ensemble de documents<br />
                  par rapport aux résultats de votre<br />
                  requête, les documents sélectionnés<br />
                  pour votre corpus seront extraits en<br />
                  fonction, soit d’un ordre de<br />
                  pertinence relevé par un score de<br />
                  qualité (choix privilégié par défaut),<br />
                  soit d’un ordre de pertinence seul,<br />
                  soit tirés de manière aléatoire, ce<br />
                  mode de tri étant plus représentatif<br />
                  de la diversité des résultats.<br />
                  Voir la <a className='font-bold text-istcolor-blue cursor-pointer' target='_blank' href='https://doc.istex.fr/api/results/scoring.html' rel='noreferrer'>documentation Istex</a>.
                </p>
              </>
            }
          >
            <button ref={docClassedToolTip}>
              <FontAwesomeIcon icon='circle-info' className='text-istcolor-blue pl-2 cursor-pointer' />
            </button>
          </Tooltip>
        </h4>
        <div className='flex flex-col md:flex-row'>
          {istexApiConfig.rankingModes.modes.map(({ label, value: rankingModeValue }) => (
            <div
              key={rankingModeValue}
              className='mr-4'
            >
              <input
                type='radio'
                checked={currentRankingMode === rankingModeValue}
                value={rankingModeValue}
                name='rankingMode'
                onChange={event => {
                  const { value } = event.target;
                  rankingModeHandler(value);
                }}
                className='mr-3'
              />
              <label htmlFor={rankingModeValue}>{label}</label>
            </div>
          ))}
        </div>
      </div>
      <div className='mt-4'>
        {resultPreviewResults.length > 0 && (
          <div>
            <ResultPreview
              results={resultPreviewResults}
              totalAmountOfDocuments={totalAmountOfDocuments}
              nextPageURI={pageUrls.nextPageURI}
              prevPageURI={pageUrls.prevPageURI}
              lastPageURI={pageUrls.lastPageURI}
              firstPageURI={pageUrls.firstPageURI}
              setCurrentPageURI={setCurrentPageURI}
              isLoading={isLoading}
              currentRankingMode={currentRankingMode}
              queryString={queryString}
            />
          </div>
        )}
      </div>
    </div>
  );
}
