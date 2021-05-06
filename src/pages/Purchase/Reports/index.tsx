import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import Ghdd from './purchaseGhdd';
import Pay from './purchaseDetailByPay';
import Sku from './purchaseDetailBySku';
import Supp from './purchaseDetailBySupp';
import Detail from './purchaseOrderListByDetail';

export default () => {
  return (
    <PageContainer
      tabList={[
        {
          tab: '采购订单追踪表',
          key: 'ghdd',
          children: <Ghdd />,
        },
        {
          tab: '采购付款一览表',
          key: 'Pay',
          children: <Pay />,
        },
        {
          tab: '采购汇总表(按商品)',
          key: 'Sku',
          children: <Sku />,
        },
        {
          tab: '采购汇总表(按供应商)',
          key: 'Supp',
          children: <Supp />,
        },
        {
          tab: '采购明细表',
          key: 'Detail',
          children: <Detail />,
        },
      ]}
    />
  );
};
