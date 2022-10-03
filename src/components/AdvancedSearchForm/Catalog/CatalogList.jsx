import React from 'react';
import PropTypes from 'prop-types';
import { Modal } from 'flowbite-react';
import CatalogListItem from './CatalogListItem';
import { catalogList } from '../../../config';

export default function CatalogList ({
  openCatalogList,
  togglePreference,
  setOpenCatalogList,
}) {
  return (
    <>
      {
      openCatalogList && (

        <Modal
          show
          onClose={() => { setOpenCatalogList(false); }}
          className='relative h-full w-full p-4 md:h-auto y max-w-2xl'
        >
          <div className='istex-modal__header'>
            <Modal.Header>
              <span className='istex-modal__text flex items-center'>
                Champs Istex
              </span>
            </Modal.Header>
          </div>
          <Modal.Body>
            <div>
              <ul className='w-full catalog-container overflow-y-auto h-48 text-gray-700 dark:text-gray-200 scroll' aria-labelledby='dropdownUsersButton'>
                {catalogList.map((catalog, index) => (
                  <CatalogListItem
                    key={index}
                    catalog={catalog}
                    togglePreference={togglePreference}
                  />
                ))}
              </ul>
            </div>
          </Modal.Body>
        </Modal>
      )
    }
    </>
  );
}

CatalogList.propTypes = {
  openCatalogList: PropTypes.bool,
  togglePreference: PropTypes.func,
  setOpenCatalogList: PropTypes.func,
};
