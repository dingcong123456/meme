'use client'

import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider, App } from 'antd';
import customTheme from './theme';

const AntdProvider = ({ children }) => {
  return (
    <StyleProvider layer>
      <ConfigProvider theme={customTheme}>
        <App className='h-full flex flex-col overflow-y-auto'>
          {children}
        </App>
      </ConfigProvider>
    </StyleProvider>
  );
};

export default AntdProvider;