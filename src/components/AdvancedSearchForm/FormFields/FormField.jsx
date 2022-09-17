import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SearchField from './SearchField/SearchField';
import CatalogList from '../Catalog/CatalogList';

function FormField ({ queryInputHandler, setFormFields }) {
  const [request, setRequest] = useState('');
  const [openCatalogList, setOpenCatalogList] = useState(false);
  const [disableCatalogInput, setDisableCatalogInput] = useState(false);
  const [openIntervalInput, setOpenIntervalInput] = useState(false);
  const [intervalInputMaxValue, setIntervalInputMaxValue] = useState(2020);
  const [intervalInputMinValue, setIntervalInputMinValue] = useState(1600);
  const [intervalInputData, setIntervalInputData] = useState('');
  const [shoudDisplaySearch, setShoudDisplaySearch] = useState(true);
  const [typeField, setTypeField] = useState((''));
  const [selectField, setSelectField] = useState(({}));

  const startQueryAvancedSearch = (value) => {
    setOpenCatalogList(value);
  };

  const togglePreference = async (event, data) => {
    // Update the advanced search input request with selected field
    let newRequest = request;
    newRequest += ' ' + event.target.value;
    setRequest(newRequest);
    setShoudDisplaySearch(true);

    // close the catalog box and get the search input focus at the end line automatically
    event.target.checked = !event.target.checked;

    setOpenCatalogList(false);
    setTypeField(data.type);
    setSelectField(data);
    await isInterval(data);
  };

  const isInterval = async (data) => {
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
      const response = await fetch(`https://api.istex.fr/document/?q=*&facet=${data.dataValue}`);
      const jsonResponse = await response.json();

      setIntervalInputData(data);
      setIntervalInputMinValue(parseInt(
        jsonResponse.aggregations[data.dataValue].buckets[0].fromAsString ||
        jsonResponse.aggregations[data.dataValue].buckets[0].from,
      ));
      setIntervalInputMaxValue(parseInt(
        jsonResponse.aggregations[data.dataValue].buckets[0].toAsString ||
        jsonResponse.aggregations[data.dataValue].buckets[0].to,
      ));

      setOpenIntervalInput(true);
      setDisableCatalogInput(true);
    }
  };

  return (
    <>
      <SearchField
        shoudDisplaySearch={shoudDisplaySearch}
        request={request}
        disableCatalogInput={disableCatalogInput}
        openIntervalInput={openIntervalInput}
        setOpenIntervalInput={setOpenIntervalInput}
        intervalInputMinValue={intervalInputMinValue}
        intervalInputMaxValue={intervalInputMaxValue}
        setDisableCatalogInput={setDisableCatalogInput}
        queryInputHandler={queryInputHandler}
        setRequest={setRequest}
        intervalInputData={intervalInputData}
        setShoudDisplaySearch={setShoudDisplaySearch}
        startQueryAvancedSearch={startQueryAvancedSearch}
        typeField={typeField}
        setFormFields={setFormFields}
        selectField={selectField}
      />

      {/* catalog fields list with scroll */}
      <CatalogList
        openCatalogList={openCatalogList}
        togglePreference={togglePreference}
      />
    </>
  );
}

FormField.propTypes = {
  queryInputHandler: PropTypes.func,
  setFormFields: PropTypes.func,
};

FormField.defaultProps = {};

export default FormField;
