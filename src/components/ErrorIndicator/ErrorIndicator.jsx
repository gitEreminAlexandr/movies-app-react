import React from 'react';
import { Alert } from 'antd';
import './ErrorIndicator.scss';

const ErrorIndicator = () => (
  <Alert
    className="error-indicator"
    message="Oops!"
    description="What have you done? Everything broke, the planet stopped!!! Okay, now we will fix everything :)"
    type="error"
    showIcon
  />
);

export default ErrorIndicator;
