import React from 'react';

import Form from '../Form/Form';
import Header from '../Header/Header';
import UrlSearchParamsManager from '../UrlSearchParamsManager/UrlSearchParamsManager';

export default function App() {
  return (
    <>
      <Header />
      <Form />
      <UrlSearchParamsManager />
    </>
  );
}
