import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import { setQueryString, setQId } from '../../store/istexApiSlice';
import {
  buildQueryStringFromArks,
  isArkQueryString,
  getArksFromArkQueryString,
  buildQueryStringFromCorpusFile,
  getQueryStringFromQId,
} from '../../lib/istexApi';
import eventEmitter, { events } from '../../lib/eventEmitter';
import { queryModes, istexApiConfig, catalogList } from '../../config';
import { RadioGroup } from '@headlessui/react';
import { CloudUploadIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';
import { useFocus } from '../../lib/hooks';
import './QueryInput.css';
import { resetForm } from '../ResetButton/ResetButton';

const infoText = {
  queryString:
  <p className='text-sm text-white'>
    Pour construire votre équation<br />
    booléenne, vous pouvez vous aider<br />
    de l'échantillon de requêtes<br />
    pédagogiques accessibles via le<br />
    bouton "Exemples", de la<br />
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>documentation ISTEX </a> ou bien du<br />
    mode de recherche avancée du<br />
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>démonstrateur ISTEX</a>.
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
    <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>documentation ISTEX</a>.
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
    Cliquez sur l’icône ci-dessous et<br />
    pour utiliser une recherche guidée<br />
    Pour plus d'informations,<br />
    consultez <a className='font-bold text-istcolor-blue cursor-pointer' href='https://doc.istex.fr/tdm/extraction/istex-dl.html#mode-demploi-'>documentation ISTEX</a>.
  </p>,
};

export default function QueryInput () {
  const dispatch = useDispatch();
  const [currentQueryMode, setCurrentQueryMode] = useState(queryModes.getDefault().value);
  const [focusAdvancedSearch, setFocusAdvancedSearch] = useState(false);
  const [queryStringInputValue, setQueryStringInputValue] = useState('');
  const [arkInputValue, setArkInputValue] = useState('');
  const [shouldDisplaySuccessMsg, setShouldDisplaySuccessMsg] = useState(false);
  const [fileInfo, setFileInfo] = useState({ fileName: '', numberOfIds: 0 });
  const [inputRef, setInputFocus] = useFocus();

  const startQueryAvancedSearch = (value) => {
    setFocusAdvancedSearch(value);
  };

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
      const resultWithoutSpace = result.replace(/[\s\n\r]/g, '');
      const index = resultWithoutSpace.indexOf('total') + 6;
      const total = resultWithoutSpace.substring(index, index + 1);
      const queryString = buildQueryStringFromCorpusFile(result);
      updateQueryString(queryString);

      setShouldDisplaySuccessMsg(true);
      setFileInfo({
        fileName: file.name,
        numberOfIds: total,
      });

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

  useEffect(() => {
    eventEmitter.addListener(events.setQueryMode, queryModeHandler);
    eventEmitter.addListener(events.setQueryString, queryStringHandler);
    eventEmitter.addListener(events.setQId, qIdHandler);
    eventEmitter.addListener(events.addFocusOnInput, handleFocusOnInput);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes.modes[0].value:
      queryInputUi = (
        <textarea
          rows='1'
          className='md:w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          name='queryInput'
          placeholder='brain AND language:fre'
          value={queryStringInputValue}
          onChange={event => queryInputHandler(event.target.value)}
          ref={inputRef}
        />
      );
      break;
    case queryModes.modes[1].value:
      queryInputUi = (
        <textarea
          className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          rows='2'
          cols='30'
          name='queryInput'
          placeholder='ark:/67375/0T8-JMF4G14B-2&#x0a;ark:/67375/0T8-RNCBH0VZ-8'
          value={arkInputValue}
          onChange={event => arkListHandler(event.target.value)}
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
              className='flex flex-col justify-center items-center rounded-lg border-2 text-istcolor-blue border-istcolor-blue border-dashed cursor-pointer hover:border-istcolor-green-light hover:text-black'
            >
              <div className='flex flex-col justify-center items-center pt-5 pb-6'>
                <CloudUploadIcon className='w-12 h-12 my-4' />
                <p className='mx-2 mb-2 text-sm'>Sélectionnez votre fichier</p>
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
      /* Avanced form case */
      queryInputUi = (
        <>
          <form>
            <div id='dropdownSearch' className=' z-10 rounded  dark:bg-gray-700'>
              <div className='pb-3 '>
                <label htmlFor='input-group-search' className='sr-only'>Search</label>
                <div className='relative'>
                  <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
                    <svg className='w-5 h-5 text-gray-500 dark:text-gray-400' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' /></svg>
                  </div>
                  <input type='text' id='input-group-search' onClick={() => { startQueryAvancedSearch(true); }} className='block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500' placeholder='Sélectionner un ou plusieurs champs dans le catalogue...' />
                </div>
              </div>
            </div>
            {/* catalog fields list with scroll */}
            <h2 id='accordion-collapse-heading' className={`${focusAdvancedSearch ? 'opacity-1' : 'hidden'}`}>
              <div className='catalog-title flex items-center justify-between w-full p-5  bg-black-200 font-medium text-left text-gray-500 border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' data-accordion-target='#accordion-collapse-body-1' aria-expanded='true' aria-controls='accordion-collapse-body-1'>
                <div className='grow '>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                </div>
                <span className='text-white grow-1 font-bold'>Champs Istex</span>
                <div className='grow opacity-0'>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                  <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
                </div>
              </div>
            </h2>

            <div id='dropdownUsers' className={`${focusAdvancedSearch ? 'opacity-1' : 'hidden'} z-10 w-120 bg-white rounded shadow dark:bg-gray-700 scroll`}>
              <ul className='catalog-container overflow-y-auto py-1 h-48 text-gray-700 pb-3 dark:text-gray-200 ml-4 scroll' aria-labelledby='dropdownUsersButton'>
                {catalogList.map((catalog, index) => (
                  <li className='pb-3 pl-5' key={index}>
                    <h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>{catalog.title} </h3>
                    {catalog.items.map((item, index) => (
                      <div className='flex pb-3' key={index}>
                        <div className='flex items-center h-5'>
                          <input id={`helper-radio-${index}`} name={item.dataTitle} type='checkbox' aria-describedby='helper-radio-text-{index}' className='cursor-pointer w-4 h-4 text-blue-istex bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
                        </div>
                        <div className='ml-2 text-sm'>
                          <label htmlFor='helper-radio' className='font-medium text-gray-900 dark:text-gray-300'>{item.dataTitle}</label>
                          <p id={`helper-radio-text-${index}`} className='text-xs font-normal text-gray-500 dark:text-gray-300'>{item.dataInfo}</p>
                        </div>
                      </div>
                    ))}
                  </li>
                ))}
              </ul>
            </div>
          </form>
          <br />
          <textarea
            className='w-full border-[1px] border-istcolor-green-dark p-2'
            rows='2'
            cols='30'
            name='queryInput'
            placeholder="Cliquez pour bénéficier de l'aide en ligne "
            value=''
            onChange={event => arkListHandler(event.target.value)}
          />
        </>
      );
      break;
  }

  return (
    <div>
      <div className='cursor-pointer w-full border-b-[2px] border-b-istcolor-green-dark flex items-end'>
        <RadioGroup
          className='flex flex-col md:flex-row'
          value={currentQueryMode}
          onChange={(value) => {
            resetForm();
            setCurrentQueryMode(value);
          }}
          name='queryMode'
        >
          {queryModes.modes.map(({ label, value }) => (
            <div key={label}>
              <RadioGroup.Option
                className='flex items-center font-medium mr-2'
                value={value}
              >
                {({ checked }) => (
                  <>
                    <span className={`flex items-center justify-center px-[30px] py-2 w-full border-[1px] font-bold ${checked ? 'bg-istcolor-green-dark hover:bg-istcolor-green-light text-white' : 'bg-istcolor-grey-extra-light text-istcolor-grey-dark'}`}>
                      {label}
                      <Tooltip
                        placement='top'
                        trigger='click'
                        content={infoText[value]}
                      >
                        <FontAwesomeIcon icon='circle-info' className='pl-2' />
                      </Tooltip>
                    </span>
                  </>
                )}
              </RadioGroup.Option>
            </div>
          ))}
        </RadioGroup>
      </div>
      <div className='my-2'>
        {queryInputUi}
      </div>
    </div>
  );
}
