import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import Product from './product';
import SuppType from '../suppType';
import Cust from './cust';

export default () => {
  return (
    <PageContainer
      tabList={[
        {
          tab: '客户辅助资料',
          key: 'Cust',
          children: <Cust />,
        },
        {
          tab: '商品辅助资料',
          key: 'Brand',
          children: <Product />,
        },
        {
          tab: '供应商类别',
          key: 'SuppType',
          children: <SuppType />,
        },
      ]}
    />
  );
};
