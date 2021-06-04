import { useModel } from '@/.umi/plugin-model/useModel';
import {
  billNoColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
} from '@/utils/columns';
import FundReportTable from './components';

export default function OriDetail() {
  const { PaccttypeEnum, RaccttypeEnum } = useModel('options', (model) => ({
    PaccttypeEnum: model.valueEnum('Paccttype'),
    RaccttypeEnum: model.valueEnum('Raccttype'),
  }));
  return (
    <FundReportTable
      url="/funds/reports/oriDetail"
      dev="funds"
      columns={[
        indexColumns,
        dateRangeColumns(),
        billNoColumns(),
        {
          dataIndex: 'type',
          valueType: 'select',
          title: '收支类别',
          valueEnum: new Map([
            [1, { text: '其他收入' }],
            [2, { text: '其他支出' }],
          ]),
        },
        {
          title: '收支项目',
          dataIndex: 'typeId',
          valueType: 'select',
          search: false,
          valueEnum: (r) => {
            return r?.type === 1 ? RaccttypeEnum : PaccttypeEnum;
          },
        },
        moneyColumns({
          dataIndex: 'amountIn',
          title: '收入',
        }),
        moneyColumns({
          dataIndex: 'amountOut',
          title: '支出',
        }),
        memoColumns(),
      ]}
    />
  );
}
