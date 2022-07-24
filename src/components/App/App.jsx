import React from 'react';

import Footer from '../Footer/Footer';
import Form from '../Form/Form';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import TextHeaderIstexDL from '../TextHeaderIstexDL/TextHeaderIstexDL';
import UrlSearchParamsManager from '../UrlSearchParamsManager/UrlSearchParamsManager';

export default function App () {
  return (
    <div className='text-istcolor-black'>
      <Header />
      <TextHeaderIstexDL />
      <Form />
      <UrlSearchParamsManager />
      <Footer />
      <Navbar />
    </div>
  );
}
