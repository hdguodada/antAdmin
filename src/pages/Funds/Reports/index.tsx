import GlobalWrapper from '@/components/GlobalWrapper';
import type { BussType } from '@/pages/Purchase/components';
import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import AccountsPayableDetail from './AccountsPayableDetail';
import CustomerBalance from './CustomerBalance';
import FundBalance from './FundBalance';
import OriDetail from './OriDetail';
import SuppBalance from './SuppBalance';

export type FundsReportItem = Partial<{
  suppId: K;
  suppName: string;
  bussType: BussType;
  entries: PUR.Entries[];
  income: number;
  expenditure: number;
  balance: number;
  [key: string]: any;
}>;
export default () => {
  return (
    <GlobalWrapper type="list">
      <PageContainer
        title={false}
        tabProps={{
          defaultActiveKey: 'OriDetail',
        }}
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
            key: 'SuppBalance',
            children: <SuppBalance />,
          },
          {
            tab: '其他收支明细表',
            key: 'OriDetail',
            children: <OriDetail />,
          },
          {
            tab: '利润表',
            key: 'Detail2',
          },
        ]}
      />
    </GlobalWrapper>
  );
};
