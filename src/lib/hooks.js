import { useState, useRef } from 'react';

export const useFocus = () => {
  const htmlElRef = useRef(null);
  const setFocus = () => { htmlElRef.current && htmlElRef.current.focus(); };

  return [htmlElRef, setFocus];
};

export const useStateWithCallback = (initialValue) => {
  const [value, setValue] = useState(initialValue);

  const setValueAndCallback = (newValue, callback) => {
    setValue(prevValue => {
      if (callback) {
        callback(prevValue, newValue);
      }

      return newValue;
    });
  };

  return [value, setValueAndCallback];
};
