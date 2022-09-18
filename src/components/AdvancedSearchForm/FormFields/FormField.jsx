import React, { useState } from 'react';
import PropTypes from 'prop-types';

import SearchField from './SearchField/SearchField';
import CatalogList from '../Catalog/CatalogList';

function FormField ({
  queryInputHandler,
  setFormFields,
  setShouldDisplayAddButton,
  removeFields,
  selectField,
  setSelectField,
  index,
}) {
  console.log('FormField', { selectField });

  const [openCatalogList, setOpenCatalogList] = useState(false);
  const [disableCatalogInput, setDisableCatalogInput] = useState(false);
  const [openIntervalInput, setOpenIntervalInput] = useState(false);
  const [shoudDisplaySearch, setShoudDisplaySearch] = useState(true);
  const [enabledDeleteButton, setEnabledDeleteButton] = useState((false));

  const startQueryAvancedSearch = (value) => {
    setOpenCatalogList(value);
  };

  const togglePreference = async (event, data) => {
    setShoudDisplaySearch(true);
    setOpenCatalogList(false);
    setSelectField({
      ...data,
      inputSearchValue: event.target.value,
    }, index);

    setOpenIntervalInput(true);
    setDisableCatalogInput(true);

    /** Remove check on the field after the catalog is hidden */
    event.target.checked = !event.target.checked;
  };

  // Update the query with the interval search values and close the interval input box
  const updateQuery = (queryValue) => {
    queryInputHandler(queryValue);
    setDisableCatalogInput(true);
    setOpenIntervalInput(false);

    setEnabledDeleteButton(true);
    setShouldDisplayAddButton(true);
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
        enabledDeleteButton={enabledDeleteButton}
        removeFields={removeFields}
        index={index}
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
  setShouldDisplayAddButton: PropTypes.func,
  removeFields: PropTypes.func,
  selectField: PropTypes.object,
  setSelectField: PropTypes.func,
  index: PropTypes.number,
};

export default FormField;
