import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SearchField from './SearchField/SearchField';
import CatalogList from '../Catalog/CatalogList';

function FormField ({ queryInputHandler, setFormFields }) {
  const [openCatalogList, setOpenCatalogList] = useState(false);
  const [disableCatalogInput, setDisableCatalogInput] = useState(false);
  const [openIntervalInput, setOpenIntervalInput] = useState(false);
  const [shoudDisplaySearch, setShoudDisplaySearch] = useState(true);
  const [selectField, setSelectField] = useState(({}));

  const startQueryAvancedSearch = (value) => {
    setOpenCatalogList(value);
  };

  const togglePreference = async (event, data) => {
    setShoudDisplaySearch(true);
    setOpenCatalogList(false);
    setSelectField({
      ...data,
      inputSearchValue: event.target.value,
    });

    setOpenIntervalInput(true);
    setDisableCatalogInput(true);
  };

  // Update the query with the interval search values and close the interval input box
  const updateQuery = (queryValue) => {
    queryInputHandler(queryValue);
    setDisableCatalogInput(true);
    setOpenIntervalInput(false);
  };

  return (
    <>
      <SearchField
        shoudDisplaySearch={shoudDisplaySearch}
        disableCatalogInput={disableCatalogInput}
        openIntervalInput={openIntervalInput}
        setOpenIntervalInput={setOpenIntervalInput}
        setDisableCatalogInput={setDisableCatalogInput}
        queryInputHandler={queryInputHandler}
        setShoudDisplaySearch={setShoudDisplaySearch}
        startQueryAvancedSearch={startQueryAvancedSearch}
        setFormFields={setFormFields}
        selectField={selectField}
        setSelectField={setSelectField}
        updateQuery={updateQuery}
      />
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
