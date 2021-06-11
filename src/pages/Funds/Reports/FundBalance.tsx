import {
  billNoColumns,
  bussTypeColumns,
  customerColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
} from '@/utils/columns';
import { patternMsg } from '@/utils/validator';
import { StatisticCard } from '@ant-design/pro-card';
import { useModel } from 'umi';
import FundReportTable from './components';
import _ from 'lodash';

export default function AccountsPayableDetail() {
  const { userEnum } = useModel('user', (model) => ({ userEnum: model.valueEnum }));
  return (
    <FundReportTable
      url="/report/fund/accountReceivableDetail"
      columns={[
        indexColumns,
        customerColumns(undefined, {
          formItemProps: {
            rules: patternMsg.select(''),
          },
        }),
        dateRangeColumns(),
        billNoColumns(),
        bussTypeColumns({
          search: false,
        }),
        moneyColumns({
          title: '增加应收款',
          dataIndex: 'income',
        }),
        moneyColumns({
          title: '增加预收款',
          dataIndex: 'expenditure',
        }),
        moneyColumns({
          title: '应收款余额',
          dataIndex: 'balance',
        }),
        {
          dataIndex: 'operId',
          title: '销售人员',
          valueType: 'select',
          fieldProps: {
            mode: 'multiple',
          },
          valueEnum: userEnum,
        },
        memoColumns(),
      ]}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '增加应收款',
                value: recordList.reduce((a, b) => _.add(a, b.income || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '增加预收款',
                value: recordList.reduce((a, b) => _.add(a, b.expenditure || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应收款余额',
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
