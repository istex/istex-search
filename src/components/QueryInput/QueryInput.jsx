import React, { useEffect, useState, useRef } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { RadioGroup } from '@headlessui/react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Spinner, Tooltip } from 'flowbite-react';
import TextareaAutosize from 'react-textarea-autosize';

import { setQueryString, setQId } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  isArkQueryString,
  getArksFromArkQueryString,
  buildQueryStringFromCorpusFile,
  getQueryStringFromQId,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { queryModes, istexApiConfig } from '../../config';
import { useFocus } from '../../lib/hooks';
import { resetForm } from '../ResetButton/ResetButton';
import AdvancedSearchForm from '../AdvancedSearchForm/AdvancedSearchForm';
import ModalExampleQueryButton from '../ExampleQueryButton/ModalExampleQueryButton';

import './QueryInput.scss';

const infoText = {
  queryString:
  <p className='text-sm text-white'>
    Pour construire votre équation<br />
    booléenne, vous pouvez vous aider<br />
    de l'échantillon de requêtes<br />
    pédagogiques accessibles via le<br />
    bouton "Exemples", de la<br />
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/requetage/'>documentation ISTEX </a> ou bien du<br />
    mode de recherche avancée du<br />
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://demo.istex.fr/'>démonstrateur ISTEX</a>.
  </p>,
  ark:
  <p className='text-sm text-white'>
    Copiez/collez dans cet onglet une<br />
    liste d'identifiants de type ARK et le<br />
    formulaire l'interprétera<br />
    automatiquement. Explorez ce mode<br />
    l’exemple disponible via le bouton<br />
    "Exemples".<br />
    Pour en savoir plus sur les<br />
    identifiants ARK, reportez vous à la<br />
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/api/ark/'>documentation ISTEX</a>.
  </p>,
  fileImport:
  <p className='text-sm text-white'>
    Cliquez sur l’icône ci-dessous et<br />
    sélectionnez un fichier de type<br />
    “.corpus” précisant les identifiants<br />
    uniques (tels que des identifiants<br />
    ARK) des documents qui composent<br />
    votre corpus.<br />
    Pour disposer d’un fichier .corpus,<br />
    consultez <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>documentation ISTEX</a>.
  </p>,
  queryAssist:
  <p className='text-sm text-white'>
    Cliquez sur la zone de recherche avec loupe pour choisir dans la liste qui s'ouvre le champ à interroger, avant de sélectionner la valeur souhaitée. <br />
  </p>,
};

export default function QueryInput ({ totalAmountOfDocuments }) {
  const dispatch = useDispatch();
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes.getDefault().value);
  const [queryStringInputValue, setQueryStringInputValue] = useState('');
  const [arkInputValue, setArkInputValue] = useState('');
  const [shouldDisplaySuccessMsg, setShouldDisplaySuccessMsg] = useState(false);
  const [fileInfo, setFileInfo] = useState({ fileName: '', numberOfIds: 0 });
  const [inputRef, setInputFocus] = useFocus();
  const [openModalExampleQuery, setOpenModalExampleQuery] = useState(false);

  const queryStringHandler = newQueryString => {
    if (!newQueryString) {
      setArkInputValue('');
    }

    if (isArkQueryString(newQueryString)) {
      const arkList = getArksFromArkQueryString(newQueryString).join('\n');
      setArkInputValue(arkList);
      setCurrentQueryMode(queryModes.modes.find(queryMode => queryMode.value === 'ark').value);
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
      return;
    }

    // If the query string is too long to be set in a URL search parameter, we replace it with a q_id instead
    if (newQueryString.length > istexApiConfig.queryStringMaxLength) {
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

  const arkListHandler = arkList => {
    eventEmitter.emit(events.setNumberOfDocuments, 0);

    setArkInputValue(arkList);

    // If the ark list is empty, just pass it to updateQueryString and let this function handle the case
    if (!arkList) {
      updateQueryString(arkList);
      return;
    }

    const arks = arkList.split('\n');
    const queryString = buildQueryStringFromArks(arks);
    updateQueryString(queryString);
  };

  const corpusFileHandler = file => {
    eventEmitter.emit(events.setNumberOfDocuments, 0);

    if (!file) return;

    const reader = new window.FileReader();
    reader.readAsText(file, 'utf-8');
    reader.onload = event => {
      const result = event.target.result;
      const queryString = buildQueryStringFromCorpusFile(result);
      updateQueryString(queryString);

      setShouldDisplaySuccessMsg(true);
      setFileInfo(prev => ({
        ...prev,
        fileName: file.name,
      }));

      eventEmitter.emit(events.displayNotification, {
        text: `import du fichier ${file.name} terminé`,
      });
    };

    // TODO: print the error in a modal or something else
    reader.onerror = console.error;
  };

  const handleFocusOnInput = () => {
    setInputFocus();
  };

  const handleResetMessageImportCorpus = () => {
    setShouldDisplaySuccessMsg(false);
  };

  useEffect(() => {
    eventEmitter.addListener(events.setQueryMode, queryModeHandler);
    eventEmitter.addListener(events.setQueryString, queryStringHandler);
    eventEmitter.addListener(events.setQId, qIdHandler);
    eventEmitter.addListener(events.resetMessageImportCorpus, handleResetMessageImportCorpus);
    eventEmitter.addListener(events.addFocusOnInput, handleFocusOnInput);
  }, []);

  useEffect(() => {
    setFileInfo(prev => ({
      ...prev,
      numberOfIds: totalAmountOfDocuments,
    }));
  }, [totalAmountOfDocuments]);

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
        <TextareaAutosize
          className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          cols='40'
          name='queryInput'
          placeholder='ark:/67375/0T8-JMF4G14B-2&#x0a;ark:/67375/0T8-RNCBH0VZ-8'
          value={arkInputValue}
          onChange={event => arkListHandler(event.target.value)}
          maxRows={12}
        />
      );
      break;
    case queryModes.modes[2].value:
      // The value attribute is harcoded to '' so that React stop crying about this input being uncontrolled.
      // Meanwhile the docs say that file input can't be controlled for security reasons... (https://reactjs.org/docs/uncontrolled-components.html#the-file-input-tag)
      queryInputUi = (
        <>
          <div className='flex flex-col justify-center items-center w-full mb-5'>
            <label
              htmlFor='dropzone-file'
              className='wrapper-file-import flex flex-col justify-center items-center border-[1px] mt-4 p-[6px] w-[140px] h-[170px] pt-[30px] font-opensans text-[16px] text-center text-istcolor-blue border-istcolor-blue cursor-pointer hover:border-istcolor-green-light hover:text-istcolor-black hover:bg-istcolor-green-light'
            >
              <div className='flex flex-col justify-center items-center'>
                <div className='file-import w-[48px] h-[64px] mb-[10px]' />
                <p className='mx-2 mb-2 text-sm'>
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
                Fichier <span className='font-bold'>{fileInfo.fileName}</span> analysé. {fileInfo.numberOfIds ? <span className='font-bold'>{fileInfo.numberOfIds}</span> : <Spinner size='xs' color='warning' />} identifiants ont été parcourus. (Attention, le nombre des documents disponibles au téléchargement peut être inférieur si
                certains identifiants ne sont pas trouvés par le moteur de recherche)
              </p>
            )}
          </div>
        </>
      );
      break;
    case queryModes.modes[3].value:
      /* Avanced form case */
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
              <button
                type='button'
                onClick={() => {
                  setCurrentQueryMode(queryModes.getDefault().value);
                }}
                className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 !focus:outline-none'
              >
                <FontAwesomeIcon icon='pen-to-square' className='md:text-2xl' />
              </button>
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
          className='w-full flex flex-wrap text-sm md:text-base md:flex-row items-center'
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
              className='relative w-1/2 text-xs md:text-base md:w-auto md:inline-block'
            >
              <RadioGroup.Option
                className='flex items-center justify-between font-medium md:mr-2'
                value={value}
              >
                {({ checked }) => (
                  <>
                    <div className={`cursor-pointer px-2 py-2 md:px-[30px] md:static font-bold ${checked ? 'bg-istcolor-green-dark hover:bg-istcolor-green-light text-white' : 'bg-istcolor-grey-extra-light text-istcolor-grey-dark'}`}>
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
        <div
          className='flex justify-around items-center px-2 py-2 md:px-[30px] text-istcolor-blue hover:text-istcolor-white border-[1px] border-istcolor-blue mb-2 font-bold cta1 font-montserrat-regular'
          onClick={() => setOpenModalExampleQuery(true)}
        >
          <span>Exemples</span>
          <div className='pl-2'>
            <Tooltip
              content={<div className='min-w-[12rem]'>Testez des exemples de requête</div>}
            >
              <button>
                <FontAwesomeIcon icon='circle-info' />
              </button>
            </Tooltip>
          </div>
        </div>
      </div>
      <div className='flex flex-col my-2'>
        {queryInputUi}
      </div>
      <ModalExampleQueryButton
        setOpenModal={setOpenModalExampleQuery}
        show={openModalExampleQuery}
        setQueryStringInputValue={setQueryStringInputValue}
        updateQueryString={updateQueryString}
        setCurrentQueryMode={setCurrentQueryMode}
        setArkInputValue={setArkInputValue}
      />
    </div>
  );
}

QueryInput.propTypes = {
  totalAmountOfDocuments: PropTypes.number,
};
