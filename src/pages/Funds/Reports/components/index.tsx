import { baseSearch } from '@/utils/columns';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useRequest } from 'umi';
import type { FundsReportItem } from '../index';

const FundReportTable: React.FC<{
  columns: ProColumns<FundsReportItem>[];
  url: string;
}> = ({ columns, url }) => {
  const { run, error } = useRequest<RowResponse<FundsReportItem>>(
    (params: any) => ({
      url,
      data: {
        queryFilter: params,
        dev: 'funds',
      },
    }),
    { manual: true },
  );
  return (
    <ProTable<FundsReportItem>
      rowKey="autoId"
      options={false}
      pagination={false}
      request={async (params) => {
        return {
          data: await (await run({ queryFilter: params })).rows,
          success: !error,
        };
      }}
      columns={columns}
      search={baseSearch({})}
    />
  );
};

export default FundReportTable;
