import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import Product from './product';
import SuppType from '../suppType';
import Cust from './cust';
import { useQuery } from '@/utils/utils';

export default () => {
  const query = useQuery();
  return (
    <PageContainer
      tabProps={{
        defaultActiveKey: query.get('tab') || undefined,
      }}
      tabList={[
        {
          tab: '客户辅助资料',
          key: 'customer',
          children: <Cust />,
        },
        {
          tab: '商品辅助资料',
          key: 'product',
          children: <Product />,
        },
        {
          tab: '供应商辅助资料',
          key: 'supplier',
          children: <SuppType />,
        },
      ]}
    />
  );
};
