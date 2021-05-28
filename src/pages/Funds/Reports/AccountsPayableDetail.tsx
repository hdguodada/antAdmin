import {
  billNoColumns,
  bussTypeColumns,
  dateRangeColumns,
  memoColumns,
  suppColumns,
} from '@/utils/columns';
import FundReportTable from './components';

export default function AccountsPayableDetail() {
  return (
    <FundReportTable
      url="/funds/reports/accountsPayableDetail"
      columns={[
        suppColumns(),
        dateRangeColumns(),
        billNoColumns(),
        bussTypeColumns(),
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
    />
  );
}
