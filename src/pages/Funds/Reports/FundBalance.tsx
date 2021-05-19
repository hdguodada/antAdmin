import {
  billNoColumns,
  bussTypeColumns,
  customerColumns,
  dateRangeColumns,
  memoColumns,
} from '@/utils/columns';
import FundReportTable from './components';

export default function AccountsPayableDetail() {
  return (
    <FundReportTable
      url="/funds/reports/fundBalance"
      columns={[
        customerColumns(),
        dateRangeColumns(),
        billNoColumns(),
        bussTypeColumns(),
        {
          title: '增加应付款',
          dataIndex: 'income',
          search: false,
          valueType: 'money',
        },
        {
          title: '增加预付款',
          dataIndex: 'expenditure',
          search: false,
          valueType: 'money',
        },
        {
          title: '应付款余额',
          dataIndex: 'balance',
          search: false,
          valueType: 'money',
        },
        {
          title: '销售人员',
          dataIndex: 'operName',
        },
        memoColumns(),
      ]}
    />
  );
}
