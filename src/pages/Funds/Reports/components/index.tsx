import type { ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { useRequest } from 'umi';
import type { FundsReportItem } from '../index';

const FundReportTable: React.FC<
  {
    url: string;
  } & ProTableProps<FundsReportItem, any>
> = ({ url, ...rest }) => {
  const { run, data } = useRequest<RowResponse<FundsReportItem>>(
    (params: any) => ({
      url,
      data: {
        queryFilter: params,
        dev: 'funds',
      },
    }),
    { manual: true },
  );
  const formRef = useRef<FormInstance>();
  return (
    <ProTable
      rowKey="autoId"
      options={false}
      formRef={formRef}
      pagination={false}
      dataSource={data?.rows}
      onSubmit={(params) => run(params)}
      {...rest}
    />
  );
};

export default FundReportTable;
