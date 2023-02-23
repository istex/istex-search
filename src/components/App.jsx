import React, { useEffect } from 'react';
import { ToastContainer, toast } from 'react-toastify';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import Footer from './Footer';
import Form from './Form';
import Header from './Header';
import BottomMenu from './BottomMenu';
import Banner from './Banner';
import UrlSearchParamsManager from './UrlSearchParamsManager';

import { useEventEmitterContext } from '@/contexts/EventEmitterContext';
import HistoryProvider from '@/contexts/HistoryContext';

export default function App () {
  const { eventEmitter, events } = useEventEmitterContext();

  const contextClass = {
    warning: 'bg-istcolor-blue',
    success: 'bg-istcolor-green-dark',
    error: 'bg-red-600',
  };

  const displayNotificationHandler = ({ text, type }) => {
    if (type === 'warn') {
      toast.warn(text, {
        icon: () => <FontAwesomeIcon icon='circle-info' />,
      });
    } else if (type === 'error') {
      toast.error(text, {
        icon: () => <FontAwesomeIcon icon='circle-exclamation' />,
      });
    } else {
      toast.success(text, {
        icon: () => <FontAwesomeIcon icon='circle-check' />,
      });
    }
  };

  useEffect(() => {
    eventEmitter.addListener(events.displayNotification, displayNotificationHandler);

    return () => {
      eventEmitter.removeListener(events.displayNotification, displayNotificationHandler);
    };
  }, []);

  return (
    <div className='text-istcolor-black'>
      <Header />
      <Banner />
      <HistoryProvider>
        <Form />
        <BottomMenu />
      </HistoryProvider>
      <UrlSearchParamsManager />
      <Footer />
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
