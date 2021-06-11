import {
  billNoColumns,
  bussTypeColumns,
  customerColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
} from '@/utils/columns';
import type { ProColumnType } from '@ant-design/pro-table';
import React from 'react';
import FundReportTable from './components';
import { patternMsg } from '@/utils/validator';
import { StatisticCard } from '@ant-design/pro-card';
import _ from 'lodash';

export default function CustomerBalance() {
  const columns: ProColumnType<any>[] = [
    indexColumns,
    customerColumns(
      undefined,
      {
        hideInTable: true,
        formItemProps: {
          rules: patternMsg.select(''),
        },
      },
      { multiple: false },
    ),
    dateRangeColumns(),
    billNoColumns(),
    bussTypeColumns({
      search: false,
    }),
    moneyColumns({
      title: '增加应付款',
      dataIndex: 'totalAmount',
    }),
    moneyColumns({
      title: '优惠金额',
      dataIndex: 'disAmount',
    }),
    moneyColumns({
      title: '客户承担费用',
      dataIndex: 'postfee',
    }),
    moneyColumns({
      title: '应收金额',
      dataIndex: 'amount',
    }),
    moneyColumns({
      title: '实际收款金额',
      dataIndex: 'rpAmount',
    }),
    moneyColumns({
      title: '应收款余额',
      dataIndex: 'inAmount',
    }),
    memoColumns(),
  ];
  return (
    <FundReportTable
      url="/report/fund/customerBalance"
      columns={columns}
      form={{
        ignoreRules: false,
      }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '应付款',
                value: recordList.reduce((a, b) => _.add(a, b.totalAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '优惠金额',
                value: recordList.reduce((a, b) => _.add(a, b.disAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '客户承担费用',
                value: recordList.reduce((a, b) => _.add(a, b.postfee || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应收金额',
                value: recordList.reduce((a, b) => _.add(a, b.amount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '实际收款金额',
                value: recordList.reduce((a, b) => _.add(a, b.rpAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应收款余额',
                value: recordList.reduce((a, b) => _.add(a, b.inAmount || 0), 0),
                suffix: '元',
              }}
            />
          </StatisticCard.Group>
        );
      }}
    />
  );
}
