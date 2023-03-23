import React, { useEffect, useState, useRef, useCallback } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import { RadioGroup } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';
import TextareaAutosize from 'react-textarea-autosize';

import AdvancedSearchForm from './AdvancedSearchForm/AdvancedSearchForm';
import ExamplesButton from './ExamplesButton';
import FeedbackMessage, { FeedbackMessageTypes } from '@/components/FeedbackMessage';

import {
  parseCorpusFileContent,
  getIdTypeInfoFromQueryString,
  buildQueryStringFromIds,
  getIdsFromIdQueryString,
  isQueryStringTooLong,
} from '@/lib/query';
import { getQueryStringFromQId } from '@/lib/istexApi';
import { queryModes, supportedIdTypes } from '@/config';
import { debounce } from '@/lib/utils';
import { setQueryString, setQId } from '@/store/istexApiSlice';
import useFocus from '@/hooks/useFocus';
import useResetForm from '@/features/resetForm/useResetForm';
import { useEventEmitterContext } from '@/contexts/EventEmitterContext';

import './QueryInput.scss';

const infoText = {
  [queryModes.modes[0].value]:
  <p className='text-sm text-white'>
    Pour construire votre équation booléenne, vous pouvez vous aider de l'échantillon de requêtes pédagogiques accessibles via le bouton "Exemples", de la <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/requetage/' target='_blank' rel='noreferrer'>documentation Istex</a> ou bien du mode de recherche avancée du <a className='font-bold text-istcolor-blue cursor-pointer' href='https://demo.istex.fr/' target='_blank' rel='noreferrer'>démonstrateur Istex</a>.
  </p>,
  [queryModes.modes[1].value]:
  <p className='text-sm text-white'>
    Copiez/collez une liste d'identifiants uniques pérennes ({Object.values(supportedIdTypes).map(idType => idType.label).join(', ')}) et le formulaire l'interprétera automatiquement. Testez l’échantillon disponible via le bouton "Exemples".<br />
    En savoir plus sur les identifiants ARK : voir la <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/api/ark/' target='_blank' rel='noreferrer'>documentation Istex</a>.
  </p>,
  [queryModes.modes[2].value]:
  <p className='text-sm text-white'>
    Cliquez sur l’icône ci-dessous et sélectionnez un fichier de type “.corpus” précisant les identifiants uniques (tels que des identifiants ARK) des documents qui composent votre corpus.<br />
    Pour disposer d’un fichier ".corpus", consultez la <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi--' target='_blank' rel='noreferrer'>documentation Istex</a>.
  </p>,
  [queryModes.modes[3].value]:
  <p className='text-sm text-white'>
    Cliquez sur la zone avec loupe pour démarrer votre recherche en choisissant dans la liste qui s'ouvre un premier champ à interroger, avant de saisir la valeur souhaitée. <br />Vous pourrez ensuite le combiner avec d’autres champs et construire ainsi pas à pas votre requête.
  </p>,
};

export default function QueryInput () {
  const dispatch = useDispatch();
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes.getDefault().value);
  const [queryStringInputValue, setQueryStringInputValue] = useState('');
  const [idsInputValue, setIdsInputValue] = useState('');
  const [shouldDisplaySuccessMsg, setShouldDisplaySuccessMsg] = useState(false);
  const [currentIdTypeName, setCurrentIdTypeName] = useState(Object.keys(supportedIdTypes)[0]);
  const [fileInfo, setFileInfo] = useState({ fileName: '', numberOfIds: 0 });
  const [errorMessage, setErrorMessage] = useState('');
  const [inputRef, setInputFocus] = useFocus();
  const resetForm = useResetForm();
  const { eventEmitter, events } = useEventEmitterContext();

  const queryStringHandler = newQueryString => {
    if (!newQueryString) {
      setIdsInputValue('');
    }

    const idTypeInfo = getIdTypeInfoFromQueryString(newQueryString);

    if (idTypeInfo != null) {
      const list = getIdsFromIdQueryString(idTypeInfo, newQueryString).join('\n');
      setIdsInputValue(list);
      setCurrentQueryMode(queryModes.modes.find(queryMode => queryMode.value === 'ids').value);
    } else {
      setCurrentQueryMode(queryModes.getDefault().value);
      setQueryStringInputValue(newQueryString);
    }

    updateQueryString(newQueryString);
  };

  const updateQueryString = newQueryString => {
    dispatch(setQueryString(newQueryString));

    eventEmitter.emit(events.setQueryStringUrlParam, newQueryString);
    eventEmitter.emit(events.setQueryStringInLastRequestOfHistory, newQueryString);

    if (!newQueryString) {
      eventEmitter.emit(events.resetResultPreview);
      setErrorMessage('');
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (isQueryStringTooLong(newQueryString)) {
      // Yes, the hashing has to be done on the client side, this is due to a questionable design of the /q_id
      // route of the API and might (hopefully) change in the future
      const hashedValue = md5(newQueryString).toString();
      qIdHandler(hashedValue, newQueryString);
    }
  };

  const qIdHandler = async (newQId, originalQueryString) => {
    dispatch(setQId(newQId));

    eventEmitter.emit(events.setQIdUrlParam, newQId);

    // newQId can be an empty string when the qId is reset, if that's the case, we don't want to send a request
    // to get the corresponding queryString so we just stop here
    if (!newQId) return;

    // If originalQueryString was not passed we need to fetch it from the API using the qId
    if (!originalQueryString) {
      try {
        const response = await getQueryStringFromQId(newQId);
        originalQueryString = response.data.req;
        dispatch(setQueryString(originalQueryString));
      } catch (err) {
        // TODO: print the error in a modal or something else
        console.error(err);
      }
    }
  };

  const queryModeHandler = newQueryMode => {
    setCurrentQueryMode(newQueryMode);
  };

  const queryInputHandler = newQueryStringInput => {
    eventEmitter.emit(events.setNumberOfDocuments, 0);

    setQueryStringInputValue(newQueryStringInput);
    updateQueryString(newQueryStringInput);
  };

  const buildQueryStringFromIdList = (idList, idTypeName) => {
    setErrorMessage('');

    const ids = idList.split('\n').filter(id => id.trim() !== '');
    let queryString;

    try {
      queryString = buildQueryStringFromIds(supportedIdTypes[idTypeName], ids);
    } catch (err) {
      setErrorMessage(generateErrorMessage(err));

      return;
    }

    updateQueryString(queryString);
  };

  const debouncedQueryStringBuilder = useCallback(debounce(buildQueryStringFromIdList, 500), []);

  const idListHandler = idList => {
    eventEmitter.emit(events.setNumberOfDocuments, 0);

    setIdsInputValue(idList);

    // If the ID list is empty, just pass it to updateQueryString and let this function handle the case
    if (!idList) {
      updateQueryString(idList);
      return;
    }

    debouncedQueryStringBuilder(idList, currentIdTypeName);
  };

  const idTypeChangedHandler = event => {
    setCurrentIdTypeName(event.target.value);
    idListHandler('');
    setErrorMessage('');
  };

  const corpusFileHandler = file => {
    eventEmitter.emit(events.setNumberOfDocuments, 0);

    if (!file) return;

    const reader = new window.FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = event => {
      const result = event.target.result;

      let parsingResult;
      try {
        parsingResult = parseCorpusFileContent(result);
      } catch (err) {
        setErrorMessage(generateErrorMessage(err));

        return;
      }

      const { numberOfIds, queryString } = parsingResult;
      updateQueryString(queryString);

      setShouldDisplaySuccessMsg(true);
      setFileInfo({
        fileName: file.name,
        numberOfIds,
      });

      eventEmitter.emit(events.displayNotification, {
        text: 'Import du fichier .corpus terminé',
      });
    };

    reader.onerror = () => {
      eventEmitter.emit(events.displayNotification, {
        text: `Impossible d'ouvrir le fichier ${file.name}`,
        type: 'error',
      });
    };
  };

  const handleFocusOnInput = () => {
    setInputFocus();
  };

  const handleResetMessageImportCorpus = () => {
    setShouldDisplaySuccessMsg(false);
  };

  const resetCurrentIdTypeName = () => {
    setCurrentIdTypeName(Object.keys(supportedIdTypes)[0]);
    setErrorMessage('');
  };

  useEffect(() => {
    eventEmitter.addListener(events.setQueryMode, queryModeHandler);
    eventEmitter.addListener(events.setQueryString, queryStringHandler);
    eventEmitter.addListener(events.setQId, qIdHandler);
    eventEmitter.addListener(events.resetMessageImportCorpus, handleResetMessageImportCorpus);
    eventEmitter.addListener(events.addFocusOnInput, handleFocusOnInput);
    eventEmitter.addListener(events.resetCurrentIdType, resetCurrentIdTypeName);

    return () => {
      eventEmitter.removeListener(events.setQueryMode, queryModeHandler);
      eventEmitter.removeListener(events.setQueryString, queryStringHandler);
      eventEmitter.removeListener(events.setQId, qIdHandler);
      eventEmitter.removeListener(events.resetMessageImportCorpus, handleResetMessageImportCorpus);
      eventEmitter.removeListener(events.addFocusOnInput, handleFocusOnInput);
      eventEmitter.removeListener(events.resetCurrentIdType, resetCurrentIdTypeName);
    };
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes.modes[0].value:
      queryInputUi = (
        <TextareaAutosize
          className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          name='queryInput'
          placeholder='brain AND language:fre'
          value={queryStringInputValue}
          onChange={event => queryInputHandler(event.target.value)}
          ref={inputRef}
          cols='40'
          maxRows={10}
        />
      );
      break;
    case queryModes.modes[1].value:
      queryInputUi = (
        <div className='flex gap-2'>
          <TextareaAutosize
            className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
            cols='40'
            name='queryInput'
            placeholder={supportedIdTypes[currentIdTypeName].examples.join('\n')}
            value={idsInputValue}
            onChange={event => idListHandler(event.target.value)}
            maxRows={12}
          />
          <select
            className='max-h-10 text-sm border border-istcolor-green-dark cursor-pointer'
            onChange={idTypeChangedHandler}
          >
            {Object.entries(supportedIdTypes).map(([idTypeName, idType]) => (
              <option
                key={idType.label}
                value={idTypeName}
              >
                {idType.label}
              </option>
            ))}
          </select>
        </div>
      );
      break;
    case queryModes.modes[2].value:
      // The value attribute is harcoded to '' so that React stops crying about this input being uncontrolled.
      // Meanwhile the docs say that file input can't be controlled for security reasons... (https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag)
      queryInputUi = (
        <>
          <div className='flex flex-col justify-center items-center w-full mb-5'>
            <label
              htmlFor='dropzone-file'
              className='flex flex-col items-center w-[8.75rem] mt-4 py-8 text-center border-[1px] cursor-pointer cta3'
            >
              <div className='flex flex-col justify-center items-center'>
                <FontAwesomeIcon icon='file-arrow-up' size='4x' className='mb-2' />
                <p className='text-sm'>
                  {shouldDisplaySuccessMsg ? 'Modifiez en sélectionnant un autre fichier' : 'Sélectionnez votre fichier'}
                </p>
              </div>
              <input
                id='dropzone-file'
                type='file'
                className='hidden'
                name='queryInput'
                accept='.corpus'
                value=''
                onChange={event => corpusFileHandler(event.target.files[0])}
              />
            </label>
            {shouldDisplaySuccessMsg && (
              <p className='mt-4 border-2 p-2 text-white bg-istcolor-green-dark border-istcolor-green-dark'>
                Fichier <span className='font-bold'>{fileInfo.fileName}</span> analysé. <span className='font-bold'>{fileInfo.numberOfIds}</span> identifiants ont été parcourus. (Attention, le nombre des documents disponibles au téléchargement peut être inférieur si
                certains identifiants ne sont pas trouvés par le moteur de recherche)
              </p>
            )}
          </div>
        </>
      );
      break;
    case queryModes.modes[3].value:
      /* Advanced form case */
      queryInputUi = (
        <>
          <div className='flex items-center mb-4'>
            <div className='flex items-center w-full'>
              <TextareaAutosize
                className={`flex-1 border-[1px] ${inputRef.current?.value?.length <= 180 ? '' : 'text-[0.9rem]'}  border-istcolor-green-dark mr-2 p-2 placeholder:text-istcolor-grey-medium`}
                name='queryInput'
                placeholder='brain AND language:fre'
                value={queryStringInputValue}
                onChange={event => queryInputHandler(event.target.value)}
                ref={inputRef}
                disabled
                style={{ resize: 'none' }}
                maxRows={3}
              />
              <Tooltip
                content={(
                  <div className='max-w-[13rem] text-center'>
                    Cliquez pour basculer en mode “Équation booléenne” et modifier votre requête en toute liberté
                  </div>
               )}
              >
                <button
                  type='button'
                  onClick={() => {
                    setCurrentQueryMode(queryModes.getDefault().value);
                  }}
                  className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
                >
                  <FontAwesomeIcon icon='pen-to-square' className='md:text-2xl' />
                </button>
              </Tooltip>
            </div>
          </div>
          <AdvancedSearchForm
            queryInputHandler={queryInputHandler}
          />
        </>
      );
      break;
  }
  const nodesRef = useRef([]);
  const onClick = (index) => {
    nodesRef.current[index].click();
  };

  return (
    <div>
      <div className='w-full border-b-[2px] border-b-istcolor-green-dark flex items-end'>
        <RadioGroup
          className='w-full flex flex-wrap text-sm md:flex-row items-center'
          value={currentQueryMode}
          onChange={(value) => {
            resetForm();
            setCurrentQueryMode(value);
          }}
          name='queryMode'
        >
          {queryModes.modes.map(({ label, value }, index) => (
            <div
              key={label}
              className='font-montserrat font-medium relative w-1/2 md:w-auto md:inline-block'
            >
              <RadioGroup.Option
                className='flex items-center justify-between md:mr-2'
                value={value}
              >
                {({ checked }) => (
                  <>
                    <div className={`cursor-pointer px-2 py-2 md:px-[30px] md:static ${checked ? 'bg-istcolor-green-dark hover:bg-istcolor-green-light text-white' : 'bg-istcolor-grey-extra-light text-istcolor-grey-dark'}`}>
                      <span className='lg:relative lg:right-2 md:static'>
                        {label}
                      </span>
                    </div>

                    <div className={` 'cursor-default lg:absolute lg:top-[0.9rem] lg:right-6 ${checked ? 'text-white' : ' text-istcolor-grey-dark'}`}>
                      <Tooltip
                        placement='top'
                        trigger='click'
                        content={
                          <div className='min-w-[12rem]'>
                            <div className='flex w-full justify-end relative left-1'>
                              <button type='button' onClick={() => onClick(index)} className='w-4 h-4 bg-white rounded-full  inline-flex items-center justify-center text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500'>
                                <span className='sr-only'>Fermer l'info bulle</span>
                                <svg className='h-6 w-6' xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 24 24' stroke='currentColor' aria-hidden='true'>
                                  <path strokeLinecap='round' strokeLinejoin='round' strokeWidth='2' d='M6 18L18 6M6 6l12 12' />
                                </svg>
                              </button>
                            </div>
                            {infoText[value]}
                          </div>
                        }
                      >
                        <button ref={(elem) => (nodesRef.current[index] = elem)}>
                          <FontAwesomeIcon icon='circle-info' />
                        </button>
                      </Tooltip>

                    </div>
                  </>
                )}
              </RadioGroup.Option>

            </div>
          ))}
        </RadioGroup>
        <ExamplesButton />
      </div>
      <div className='flex flex-col my-2'>
        {queryInputUi}
      </div>
      {errorMessage && (
        <div className='mb-2'>
          <FeedbackMessage type={FeedbackMessageTypes.Error} message={errorMessage} />
        </div>
      )}
    </div>
  );
}

/**
 * Create a well formatted error message from the errors reported by the identifier parser.
 * @param {Error} err The `Error` instance thrown by the parser.
 * @returns A JSX element
 */
function generateErrorMessage (err) {
  return (
    <>
      Erreurs de syntaxe détectées aux lignes :<br />
      {err.ids.map(({ id, line }) => <div key={line}>{line} : <span className='font-normal'>{id}</span></div>)}
    </>
  );
}
