import { billNoColumns, bussTypeColumns, dateRangeColumns, memoColumns } from '@/utils/columns';
import FundReportTable from './components';

export default function CustomerBalance() {
  return (
    <FundReportTable
      url="/funds/reports/customerBalance"
      columns={[
        dateRangeColumns(),
        billNoColumns(),
        bussTypeColumns(),
        {
          title: '增加应付款',
          dataIndex: 'totalAmount',
          search: false,
          valueType: 'money',
        },
        {
          title: '优惠金额',
          dataIndex: 'disAmount',
          search: false,
          valueType: 'money',
        },
        {
          title: '客户承担费用',
          dataIndex: 'postfee',
          search: false,
          valueType: 'money',
        },
        {
          title: '应收金额',
          dataIndex: 'amount',
          search: false,
          valueType: 'money',
        },
        {
          title: '实际收款金额',
          dataIndex: 'rpAmount',
          search: false,
          valueType: 'money',
        },
        {
          title: '应收款余额',
          dataIndex: 'inAmount',
          search: false,
          valueType: 'money',
        },
        memoColumns(),
      ]}
    />
  );
}
