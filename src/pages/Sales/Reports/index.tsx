import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';

export default () => {
  return (
    <PageContainer
      tabList={[
        {
          tab: '销售订单追踪表',
          key: 'ghdd',
        },
        {
          tab: '销售付款一览表',
          key: 'Pay',
        },
        {
          tab: '销售汇总表(按商品)',
          key: 'Sku',
        },
        {
          tab: '销售汇总表(按供应商)',
          key: 'Supp',
        },
        {
          tab: '销售明细表',
          key: 'Detail',
        },
      ]}
    />
  );
};
