import React, { useState } from 'react';
import './App.css';

function TextField () {
  const [vaue, setValue] = useState('');

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <input
      name='name'
      placeholder='Name'
      onChange={event => handleChange(event)}
      value={vaue}
    />
  );
}

export default TextField;
