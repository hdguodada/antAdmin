import {
  billNoColumns,
  bussTypeColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  suppColumns,
} from '@/utils/columns';
import FundReportTable from './components';
import { StatisticCard } from '@ant-design/pro-card';
import _ from 'lodash';

export default function AccountsPayableDetail() {
  return (
    <FundReportTable
      url="/report/fund/accountPayableDetail"
      columns={[
        indexColumns,
        suppColumns({
          renderName: 'contactName',
        }),
        dateRangeColumns(),
        billNoColumns(),
        bussTypeColumns({
          search: false,
        }),
        {
          title: '增加应付款',
          dataIndex: 'income',
          search: false,
          valueType: 'money',
          width: 105,
        },
        {
          title: '增加预付款',
          dataIndex: 'expenditure',
          search: false,
          valueType: 'money',
          width: 105,
        },
        {
          title: '应付款余额',
          dataIndex: 'balance',
          search: false,
          valueType: 'money',
          width: 105,
        },
        memoColumns(),
      ]}
      scroll={{ y: 500 }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '增加应付款',
                value: recordList.reduce((a, b) => _.add(a, b.income || 0), 0),
                status: 'default',
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '增加预付款',
                value: recordList.reduce((a, b) => _.add(a, b.expenditure || 0), 0),
                status: 'processing',
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应付款余额',
                value: recordList.reduce((a, b) => _.add(a, b.balance || 0), 0),
                status: 'success',
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
