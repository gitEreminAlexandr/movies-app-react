import React from 'react';
import { Layout } from 'antd';
import CardTabs from '../CardTabs';
import './app.scss';

const App = () => {
  const { Content } = Layout;

  return (
    <Content className="app-layout">
      <CardTabs />
    </Content>
  );
};

export default App;
