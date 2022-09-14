import React, { useState, useRef } from 'react';
import PropTypes from 'prop-types';
import AdvancedSearchIntervalInput from '../AdvancedSearchIntervalInput/AdvancedSearchIntervalInput';

function AdvancedSearchForm ({ catalogList, queryInputHandler }) {
  const [request, setRequest] = useState('');
  const [openCatalogList, setOpenCatalogList] = useState(false);
  const [disableCatalogInput, setDisableCatalogInput] = useState(false);
  const [openIntervalInput, setOpenIntervalInput] = useState(false);
  const [intervalInputMaxValue, setIntervalInputMaxValue] = useState(2020);
  const [intervalInputMinValue, setIntervalInputMinValue] = useState(1600);
  const [intervalInputData, setIntervalInputData] = useState('');
  const searchInput = useRef(null);
  const startQueryAvancedSearch = (value) => {
    setOpenCatalogList(value);
  };

  function togglePreference (field, data) {
    // Update the advanced search input request with selected field
    let newRequest = request;
    newRequest += ' ' + field.target.value;
    setRequest(newRequest);
    searchInput.current.value = newRequest;

    // close the catalog box and get the search input focus at the end line automatically
    setTimeout(() => {
      field.target.checked = !field.target.checked;
      const endlineFocus = newRequest.length;
      searchInput.current.setSelectionRange(endlineFocus, endlineFocus, 'forward');
      searchInput.current.focus();
      setOpenCatalogList(false);
      isInterval(data);
    }, 500);
  }

  function isInterval (data) {
    const intervalList = [
      'Date de publication',
      'Date de copyright',
      'Score',
      'Nombre de mots du PDF',
      'Nombre de caractères du PDF',
      'Nombre de mots du résumé',
      'Nombre de caractères du résumé',
      'Nombre de pages du PDF',
      'Nombre de mots par page du PDF',
    ];

    if (intervalList.includes(data.dataTitle)) {
      fetch(`https://api.istex.fr/document/?q=*&facet=${data.dataValue}`)
        .then(response => response.json())
      // Whe make an update of the dataMax and dataMin value with the api istex request on the facet
        .then(res => {
          setIntervalInputData(data);
          setIntervalInputMinValue(parseInt(res.aggregations[data.dataValue].buckets[0].fromAsString ||
            res.aggregations[data.dataValue].buckets[0].from));
          setIntervalInputMaxValue(parseInt(res.aggregations[data.dataValue].buckets[0].toAsString ||
            res.aggregations[data.dataValue].buckets[0].to));
          setTimeout(() => {
            setOpenIntervalInput(true);
            setDisableCatalogInput(true);
          }, 1000);
        });
    }
  }

  function updateIntervalRequest (min, max) {
    searchInput.current.value = `${intervalInputData.dataTitle} de  ${min} à ${max}`;
  }

  return (
    <form>
      <div id='dropdownSearch' className=' z-10 rounded  dark:bg-gray-700'>
        <div className='pb-3 '>
          <label htmlFor='input-group-search' className='sr-only'>Search</label>
          <div className='relative'>
            <div className='flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none'>
              <svg className='w-5 h-5 text-gray-500 dark:text-gray-400' aria-hidden='true' fill='currentColor' viewBox='0 0 20 20' xmlns='http://www.w3.org/2000/svg'><path fillRule='evenodd' d='M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z' clipRule='evenodd' /></svg>
            </div>
            <input
              type='text' id='input-group-search' ref={searchInput}
              onChange={event => setRequest(event.target.value)}
              defaultValue={request} onClick={() => { startQueryAvancedSearch(true); }}
              className='block p-2 pl-10 w-full text-sm text-gray-900 bg-gray-50 rounded-full border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-600 dark:border-gray-500 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500'
              placeholder='Sélectionner un ou plusieurs champs dans le catalogue...'
              disabled={disableCatalogInput}
            />
          </div>
        </div>
      </div>
      {
        openIntervalInput
          ? <AdvancedSearchIntervalInput
              intervalInputData={intervalInputData}
              setOpenIntervalInput={setOpenIntervalInput}
              setRequest={setRequest}
              min={intervalInputMinValue}
              max={intervalInputMaxValue}
              searchInput={searchInput}
              setDisableCatalogInput={setDisableCatalogInput}
              queryInputHandler={queryInputHandler}
              onChange={({ min, max }) => { updateIntervalRequest(min, max); }}
            />
          : null
      }

      {/* catalog fields list with scroll */}
      <h2 id='accordion-collapse-heading' className={`${openCatalogList ? 'opacity-1' : 'hidden'}`}>
        <div className='catalog-title flex items-center justify-between w-full p-5  bg-black-200 font-medium text-left text-gray-500 border-b-0 border-gray-200 rounded-t-xl focus:ring-4 focus:ring-gray-200 dark:focus:ring-gray-800 dark:border-gray-700 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-800' data-accordion-target='#accordion-collapse-body-1' aria-expanded='true' aria-controls='accordion-collapse-body-1'>
          <div className='grow opacity-0'>
            <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
          </div>
          <span className='text-white grow-1 font-bold'>Champs Istex</span>
          <div className='grow opacity-0'>
            <span className='inline-flex justify-center items-center p-3 ml-3 w-3 h-3 text-sm font-medium  bg-gray-600 rounded-full dark:bg-blue-900 dark:text-blue-200'> </span>
          </div>
        </div>
      </h2>

      <div id='dropdownUsers' className={`${openCatalogList ? 'opacity-1' : 'hidden'} z-10 w-120 bg-white rounded shadow dark:bg-gray-700 scroll`}>
        <ul className='catalog-container overflow-y-auto py-1 h-48 text-gray-700 pb-3 dark:text-gray-200 ml-4 scroll' aria-labelledby='dropdownUsersButton'>
          {catalogList.map((catalog, index) => (
            <li className='pb-3 pl-5' key={index}>
              <h3 className='mb-4 font-semibold text-gray-900 dark:text-white'>{catalog.title} </h3>
              {catalog.items.map((item, index) => (
                <div className='flex pb-3' key={index}>
                  <div className='flex items-center h-5'>
                    <input id={`helper-radio-${index}`} name={item.dataTitle} type='checkbox' onChange={(e) => { togglePreference(e, item); }} value={item.dataTitle} aria-describedby='helper-radio-text-{index}' className='cursor-pointer w-4 h-4 text-blue-istex bg-gray-100 border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600' />
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
  );
}

AdvancedSearchForm.propTypes = {
  catalogList: PropTypes.array.isRequired,
  queryInputHandler: PropTypes.func,
};

AdvancedSearchForm.defaultProps = {};

export default AdvancedSearchForm;
