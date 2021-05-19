import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import AccountsPayableDetail from './AccountsPayableDetail';
import CustomerBalance from './CustomerBalance';
import FundBalance from './FundBalance';

export type FundsReportItem = {
  suppId: K;
  suppName: string;
};
export default () => {
  return (
    <GlobalWrapper type="list">
      <PageContainer
        title={false}
        tabList={[
          {
            tab: '现金银行报表',
            key: 'xjyhbb',
          },
          {
            tab: '应付账款明细表',
            key: 'AccountsPayableDetail',
            children: <AccountsPayableDetail />,
          },
          {
            tab: '应收账单明细表',
            key: 'fundBalance',
            children: <FundBalance />,
          },
          {
            tab: '客户对账表',
            key: 'CustomerBalance',
            children: <CustomerBalance />,
          },
          {
            tab: '供应商对账表',
            key: 'Detail',
          },
          {
            tab: '其他收支明细表',
            key: 'Detail1',
          },
          {
            tab: '利润表',
            key: 'Detail2',
          },
        ]}
        tabProps={{
          type: 'card',
          defaultActiveKey: 'CustomerBalance',
        }}
      />
    </GlobalWrapper>
  );
};
