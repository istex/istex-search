import React from 'react';

import Form from '../Form/Form';
import Header from '../Header/Header';
import TextHeaderIstexDL from '../TextHeaderIstexDL/TextHeaderIstexDL';
import UrlSearchParamsManager from '../UrlSearchParamsManager/UrlSearchParamsManager';

export default function App() {
  return (
    <>
      <Header />
      <TextHeaderIstexDL />
      <Form />
      <UrlSearchParamsManager />
    </>
  );
}
