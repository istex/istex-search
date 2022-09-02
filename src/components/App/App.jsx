import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import eventEmitter, { events } from '../../lib/eventEmitter';
import Footer from '../Footer/Footer';
import Form from '../Form/Form';
import Header from '../Header/Header';
import Navbar from '../Navbar/Navbar';
import TextHeaderIstexDL from '../TextHeaderIstexDL/TextHeaderIstexDL';
import UrlSearchParamsManager from '../UrlSearchParamsManager/UrlSearchParamsManager';

export default function App () {
  const contextClass = {
    success: 'bg-istcolor-blue',
    error: 'bg-red-600',
    warning: 'bg-orange-400',
  };

  const displayNotificationHandler = ({ text, type }) => {
    if (type === 'warn') {
      toast.warn(text, {
        icon: () => <FontAwesomeIcon icon='triangle-exclamation' />,
      });
    } else if (type === 'error') {
      toast.error(text, {
        icon: () => <FontAwesomeIcon icon='circle-exclamation' />,
      });
    } else {
      toast.success(text, {
        icon: () => <FontAwesomeIcon icon='circle-info' />,
      });
    }
  };

  useEffect(() => {
    eventEmitter.addListener(events.displayNotification, displayNotificationHandler);
  }, []);

  return (
    <div className='text-istcolor-black'>
      <Header />
      <TextHeaderIstexDL />
      <Form />
      <UrlSearchParamsManager />
      <Footer />
      <Navbar />
      <ToastContainer
        hideProgressBar
        closeButton={false}
        limit={1}
        toastClassName={({ type }) => `${contextClass[type || 'default']} text-white text-sm relative flex p-1 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer`}
        autoClose={3000}
      />
    </div>
  );
}
