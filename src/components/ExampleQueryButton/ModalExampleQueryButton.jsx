import React, { Fragment, useState } from 'react';
import { Modal } from 'flowbite-react';
import { useNavigate } from 'react-router';
import PropTypes from 'prop-types';

import ExamplesList from './ExamplesList';
import { buildQueryStringFromArks } from '../../lib/istexApi';

export default function ModalExampleQueryButton ({
  show,
  setOpenModal,
  setQueryStringInputValue,
  updateQueryString,
  setNumberRowsInput,
  setCurrentQueryMode,
  setArkInputValue,
}) {
  if (!show) {
    return null;
  }

  const [open, setOpen] = useState(show);
  const navigate = useNavigate();

  const onClose = () => {
    setOpen(false);
    setOpenModal(false);
  };

  const onClickExample = params => {
    if (params.currentQueryMode === 'ark') {
      setArkInputValue(params.input);

      const arks = params.input.split('\n');
      const queryString = buildQueryStringFromArks(arks);
      updateQueryString(queryString);
    } else {
      setQueryStringInputValue(params.input);
      updateQueryString(params.input);
    }

    setNumberRowsInput(params.numberRowsInput);
    setCurrentQueryMode(params.currentQueryMode);
    navigate(`/${params.request}`);
    setOpenModal(false);
  };

  return (
    <>
      <Modal
        show={open}
        onClose={onClose}
      >
        <div className='istex-modal__header'>
          <Modal.Header>
            <span className='istex-modal__text'>
              Exemples de requêtes
            </span>
          </Modal.Header>
        </div>
        <Modal.Body>
          <div className='flex flex-col text-sm overflow-auto h-96 text-istcolor-grey-link'>
            Voici quelques exemples dont vous pouvez vous inspirer pour votre recherche. Cliquez sur l'une des loupes et la zone de requête sera remplie automatiquement par le contenu de l'exemple choisi. Cet échantillon illustre différentes façons d'interroger l'API ISTEX en utilisant :
            <ExamplesList onClickExample={onClickExample} />
          </div>
        </Modal.Body>
        <Modal.Footer>
          <div className='flex w-full justify-end'>
            <button
              type='button'
              onClick={onClose}
              className='p-2 text-white bg-istcolor-blue border border-istcolor-blue cta1 focus:ring-4 focus:outline-none'
            >
              Annuler
            </button>
          </div>
        </Modal.Footer>
      </Modal>
    </>
  );
}

ModalExampleQueryButton.propTypes = {
  show: PropTypes.bool,
  setOpenModal: PropTypes.func,
  setQueryStringInputValue: PropTypes.func,
  updateQueryString: PropTypes.func,
  setNumberRowsInput: PropTypes.func,
  setCurrentQueryMode: PropTypes.func,
  setArkInputValue: PropTypes.func,
};
