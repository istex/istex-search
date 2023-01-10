import React from 'react';
import PropTypes from 'prop-types';

import './FeedbackMessage.scss';

export const FeedbackMessageTypes = {
  Success: 'success',
  Error: 'error',
  Warning: 'warning',
  Information: 'information',
};

export default function FeedbackMessage ({ type, message }) {
  return (
    <div className={`px-12 font-bold feedback-message-${type}`}>
      {message}
    </div>
  );
}

FeedbackMessage.propTypes = {
  type: PropTypes.oneOf(Object.values(FeedbackMessageTypes)).isRequired,
  message: PropTypes.oneOfType([PropTypes.node, PropTypes.string]).isRequired,
};
