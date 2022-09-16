import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import md5 from 'crypto-js/md5';
import PropTypes from 'prop-types';
import { RadioGroup } from '@headlessui/react';
import { CloudUploadIcon } from '@heroicons/react/solid';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Tooltip } from 'flowbite-react';

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
import { useFocus } from '../../lib/hooks';
import './QueryInput.css';
import { resetForm } from '../ResetButton/ResetButton';
import AdvancedSearchForm from '../AdvancedSearchForm/AdvancedSearchForm';
import ModalExampleQueryButton from '../ExampleQueryButton/ModalExampleQueryButton';

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
    Cliquez sur l’icône ci-dessous et<br />
    pour utiliser une recherche guidée.
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
  const [numberRowsInput, setNumberRowsInput] = useState(0);

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

  const handleNumberRowsInput = (number) => {
    setNumberRowsInput(number);
  };

  const handleResetMessageImportCorpus = () => {
    setShouldDisplaySuccessMsg(false);
  };

  const displayNumberRows = () => {
    if (totalAmountOfDocuments > 0 && totalAmountOfDocuments <= 10000) {
      return totalAmountOfDocuments;
    } else if (numberRowsInput === 0) {
      return '2';
    } else {
      return numberRowsInput;
    }
  };

  useEffect(() => {
    eventEmitter.addListener(events.setQueryMode, queryModeHandler);
    eventEmitter.addListener(events.setQueryString, queryStringHandler);
    eventEmitter.addListener(events.setQId, qIdHandler);
    eventEmitter.addListener(events.resetMessageImportCorpus, handleResetMessageImportCorpus);
    eventEmitter.addListener(events.addFocusOnInput, handleFocusOnInput);
    eventEmitter.addListener(events.setNumberRowsInput, handleNumberRowsInput);
  }, []);

  let queryInputUi;
  switch (currentQueryMode) {
    case queryModes.modes[0].value:
      queryInputUi = (
        <textarea
          rows={`${numberRowsInput === 0 ? '1' : numberRowsInput}`}
          className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          name='queryInput'
          placeholder='brain AND language:fre'
          value={queryStringInputValue}
          onChange={event => queryInputHandler(event.target.value)}
          ref={inputRef}
          cols='40'
        />
      );
      break;
    case queryModes.modes[1].value:
      queryInputUi = (
        <textarea
          className='w-full border-[1px] border-istcolor-green-dark p-2 placeholder:text-istcolor-grey-medium'
          rows={displayNumberRows(numberRowsInput, totalAmountOfDocuments)}
          cols='40'
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
          <textarea
            rows='1'
            className='w-full border-[1px] bg-gray-200 border-istcolor-green-dark mb-3 p-2 placeholder:text-istcolor-grey-medium'
            name='queryInput'
            placeholder='Requête Api'
            style={{ resize: 'none' }}
            autoComplete='off'
            value={queryStringInputValue}
            onChange={event => queryInputHandler(event.target.value)}
            ref={inputRef}
            disabled
          />
          <AdvancedSearchForm
            updateQueryString={updateQueryString}
            catalogList={catalogList}
            queryInputHandler={queryInputHandler}
            inputRef={inputRef}
          />
        </>
      );
      break;
  }

  return (
    <div>
      <div className='cursor-pointer w-full border-b-[2px] border-b-istcolor-green-dark flex items-end'>
        <RadioGroup
          className='w-full flex flex-wrap text-sm md:text-base md:flex-row items-center'
          value={currentQueryMode}
          onChange={(value) => {
            resetForm();
            setCurrentQueryMode(value);
          }}
          name='queryMode'
        >
          {queryModes.modes.map(({ label, value }) => (
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
                    <span className={`px-2 py-2 md:px-[30px] border-[1px] font-bold ${checked ? 'bg-istcolor-green-dark hover:bg-istcolor-green-light text-white' : 'bg-istcolor-grey-extra-light text-istcolor-grey-dark'}`}>
                      {label}
                    </span>
                  </>
                )}
              </RadioGroup.Option>
              <div className='absolute top-[14px] right-4'>
                <Tooltip
                  placement='top'
                  trigger='click'
                  content={<div className='min-w-[12rem]'>{infoText[value]}</div>}
                >
                  <button>
                    <FontAwesomeIcon icon='circle-info' />
                  </button>
                </Tooltip>
              </div>
            </div>
          ))}
        </RadioGroup>
        <div
          className='flex justify-around items-center px-2 py-2 md:px-[30px] text-istcolor-blue hover:text-istcolor-white border-[1px] border-istcolor-blue mb-2 font-bold cta1 font-montserrat-bold'
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
        setNumberRowsInput={setNumberRowsInput}
        setCurrentQueryMode={setCurrentQueryMode}
        setArkInputValue={setArkInputValue}
      />
    </div>
  );
}

QueryInput.propTypes = {
  totalAmountOfDocuments: PropTypes.number,
};
