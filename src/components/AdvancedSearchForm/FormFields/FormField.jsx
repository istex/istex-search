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
  groupIndex,
  updateFields,
  handleQueryAdvancedSearch,
  numberOfFields,
}) {
  const [openCatalogList, setOpenCatalogList] = useState(false);
  const [disableCatalogInput, setDisableCatalogInput] = useState(false);
  const [openIntervalInput, setOpenIntervalInput] = useState(false);
  const [shoudDisplaySearch, setShoudDisplaySearch] = useState(true);

  const startQueryAvancedSearch = (value) => {
    setOpenCatalogList(value);
  };

  const togglePreference = async (event, data) => {
    setShoudDisplaySearch(true);
    setOpenCatalogList(false);
    setSelectField({
      ...data,
      inputSearchValue: event.target.value,
    }, index, groupIndex);

    setOpenIntervalInput(true);
    setDisableCatalogInput(true);

    /** Remove check on the field after the catalog is hidden */
    event.target.checked = !event.target.checked;
  };

  // Update the query with the interval search values and close the interval input box
  const updateQuery = (queryValue, value) => {
    setSelectField({
      ...selectField,
      queryValue,
      value,
      enabledDeleteButton: true,
    }, index, groupIndex);
    setDisableCatalogInput(true);
    setOpenIntervalInput(false);
    setShouldDisplayAddButton(true);
    handleQueryAdvancedSearch();
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
        removeFields={removeFields}
        updateFields={updateFields}
        index={index}
        groupIndex={groupIndex}
        numberOfFields={numberOfFields}
        setOpenCatalogList={setOpenCatalogList}
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
  updateFields: PropTypes.func,
  selectField: PropTypes.object,
  setSelectField: PropTypes.func,
  index: PropTypes.number,
  groupIndex: PropTypes.number,
  handleQueryAdvancedSearch: PropTypes.func,
  numberOfFields: PropTypes.number,
};

export default FormField;
