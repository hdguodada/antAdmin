import { toDecimal2 } from '@/utils/utils';
import type { ProColumnType } from '@ant-design/pro-table';
import { Table, Typography } from 'antd';

export type EntriesSummaryProps<T> = {
  columns: ProColumnType<T>[];
  calFields: ProColumnType<T>['dataIndex'][];
  data: readonly T[];
};
export function EntriesSummary<T>(props: EntriesSummaryProps<T>) {
  const { columns, calFields, data } = props;
  return (
    <Table.Summary.Row>
      {columns
        .filter((i) => !i.hideInTable)
        .map((item, index) => {
          if (index === 0) {
            return (
              <Table.Summary.Cell index={index} key={+index}>
                合计
              </Table.Summary.Cell>
            );
          }
          if (calFields.indexOf(item.dataIndex) > -1) {
            if (item.dataIndex === 'qtyMid') {
              return (
                <Table.Summary.Cell
                  index={index}
                  key={+index}
                  children={
                    <Typography.Text type="danger">
                      {toDecimal2(data.reduce((a, b) => a + (b['qty'] || 0), 0))}
                    </Typography.Text>
                  }
                />
              );
            }
            return (
              <Table.Summary.Cell
                index={index}
                key={+index}
                children={
                  <Typography.Text type="danger">
                    {toDecimal2(data.reduce((a, b) => a + b[item.dataIndex as string], 0))}
                  </Typography.Text>
                }
              />
            );
          }
          return <Table.Summary.Cell index={index} key={+index} />;
        })}
    </Table.Summary.Row>
  );
}
