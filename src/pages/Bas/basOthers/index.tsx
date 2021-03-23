import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import Cust from './cust';
import Store from '@/pages/Bas/store';
import Product from './product';

export default () => {
  return (
    <PageContainer
      title={false}
      tabList={[
        {
          tab: '客戶',
          key: 'level',
          children: <Cust />,
        },
        {
          tab: '产品',
          key: 'product',
          children: <Product />,
        },
        {
          tab: '仓库',
          key: 'store',
          children: <Store />,
        },
      ]}
      tabProps={{
        defaultActiveKey: 'product',
      }}
    />
  );
};
