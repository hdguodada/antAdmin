import {
  billNoColumns,
  bussTypeColumns,
  cateIdColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
  skuCodeColumns,
  skuIdColumns,
  spuCodeColumns,
  srcOrderColumns,
  suppColumns,
  unitIdColumns,
} from '@/utils/columns';
import type { ProColumnType, ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import FundReportTable from './components';
import { BussType, BussTypeComponentUrl } from '@/pages/Purchase/components';
import { patternMsg } from '@/utils/validator';
import { StatisticCard } from '@ant-design/pro-card';
import _ from 'lodash';

type CustomerBalanceEntriesProps = { bussType: BussType } & ProTableProps<any, any>;
export const CustomerBalanceEntries: React.FC<CustomerBalanceEntriesProps> = ({
  bussType,
  ...rest
}) => {
  const columns: ProColumnType<any>[] = [
    cateIdColumns({ search: false }),
    spuCodeColumns,
    skuCodeColumns,
    skuIdColumns(),
    unitIdColumns,
    moneyColumns({
      title: '单价',
      dataIndex: 'price',
    }),
    moneyColumns({
      title: '含税单价',
      dataIndex: 'taxPrice',
    }),
    moneyColumns({
      title: '折扣额',
      dataIndex: 'deduction',
    }),
    moneyColumns({
      title: '折后金额',
      dataIndex: 'beforeDisAmount',
    }),
    moneyColumns({
      title: '不含税金额',
      dataIndex: 'amount',
    }),
    moneyColumns({
      title: '税额',
      dataIndex: 'tax',
    }),
    moneyColumns({
      title: '销售金额',
      dataIndex: 'taxAmount',
    }),
    memoColumns(),
    srcOrderColumns(
      {
        title: '源销货订单号',
      },
      'srcXhddBillNo',
      BussTypeComponentUrl[BussType[bussType]],
    ),
  ];
  return <ProTable options={false} pagination={false} search={false} columns={columns} {...rest} />;
};

export default function SuppBalance() {
  const columns: ProColumnType<any>[] = [
    indexColumns,
    dateRangeColumns(),
    suppColumns(
      { multiple: false },
      {
        hideInTable: true,
        formItemProps: {
          rules: patternMsg.select(''),
        },
      },
    ),
    billNoColumns(),
    bussTypeColumns({
      search: false,
    }),
    {
      title: '采购金额',
      dataIndex: 'totalAmount',
      search: false,
      valueType: 'money',
      width: 105,
    },
    {
      title: '优惠金额',
      dataIndex: 'disAmount',
      search: false,
      valueType: 'money',
      width: 105,
    },

    {
      title: '应付金额',
      dataIndex: 'amount',
      search: false,
      valueType: 'money',
      width: 105,
    },
    {
      title: '实际付款金额',
      dataIndex: 'rpAmount',
      search: false,
      valueType: 'money',
      width: 105,
    },
    {
      title: '应付款余额',
      dataIndex: 'inAmount',
      search: false,
      valueType: 'money',
      width: 105,
    },
    memoColumns(),
  ];
  return (
    <FundReportTable
      url="/report/fund/supplierBalance"
      columns={columns}
      form={{
        ignoreRules: false,
      }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '采购金额',
                value: recordList.reduce((a, b) => _.add(a, b.totalAmount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '优惠金额',
                value: recordList.reduce((a, b) => _.add(a, b.disAmount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应付金额',
                value: recordList.reduce((a, b) => _.add(a, b.amount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '实际付款金额',
                value: recordList.reduce((a, b) => _.add(a, b.rpAmount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应付款余额',
                value: recordList.reduce((a, b) => _.add(a, b.inAmount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
          </StatisticCard.Group>
        );
      }}
    />
  );
}
