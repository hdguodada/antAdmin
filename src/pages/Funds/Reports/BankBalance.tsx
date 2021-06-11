import {
  billNoColumns,
  bussTypeColumns,
  customerColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
  suppColumns,
} from '@/utils/columns';
import type { ProColumnType } from '@ant-design/pro-table';
import React from 'react';
import FundReportTable from './components';
import { StatisticCard } from '@ant-design/pro-card';
import _ from 'lodash';
import { useModel } from 'umi';

export default function CustomerBalance() {
  const { userEnum } = useModel('user', (model) => ({ userEnum: model.valueEnum }));
  const columns: ProColumnType<any>[] = [
    indexColumns,
    customerColumns(
      undefined,
      {
        hideInTable: true,
      },
      { multiple: false },
    ),
    suppColumns(undefined, {
      hideInTable: true,
    }),
    dateRangeColumns(),
    billNoColumns(),
    bussTypeColumns({
      search: false,
    }),
    moneyColumns({
      title: '收入',
      dataIndex: 'income',
    }),
    moneyColumns({
      title: '支出',
      dataIndex: 'expenditure',
    }),
    moneyColumns({
      title: '余额',
      dataIndex: 'balance',
    }),
    {
      title: '往来单位',
      dataIndex: 'contactName',
      width: 155,
      search: false,
    },
    {
      dataIndex: 'operId',
      title: '收/付款人',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: userEnum,
    },
    memoColumns(),
  ];
  return (
    <FundReportTable
      url="/report/fund/bankBalance"
      columns={columns}
      form={{
        ignoreRules: false,
      }}
      scroll={{ y: 550 }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '收入',
                value: recordList.reduce((a, b) => _.add(a, b.income || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '支出',
                value: recordList.reduce((a, b) => _.add(a, b.expenditure || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '余额',
                value: recordList.reduce((a, b) => _.add(a, b.balance || 0), 0),
                suffix: '元',
              }}
            />
          </StatisticCard.Group>
        );
      }}
    />
  );
}
