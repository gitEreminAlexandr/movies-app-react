import React from 'react';
import { Spin } from 'antd';
// eslint-disable-next-line import/no-extraneous-dependencies
import { LoadingOutlined } from '@ant-design/icons';
import './Spinner.scss';

const Spinner = () => {
  const antIcon = <LoadingOutlined style={{ fontSize: 80 }} spin />;

  return <Spin style={{ width: '100%', height: '500px', paddingTop: '90px' }} indicator={antIcon} />;
};

export default Spinner;
