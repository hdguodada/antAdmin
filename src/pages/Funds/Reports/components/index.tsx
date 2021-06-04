import type { ProTableProps } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { useRequest } from 'umi';
import type { FundsReportItem } from '../index';
import { transProTableParamsToMyRequest } from '@/utils/utils';

type FundReportTableProps = {
  url: string;
  dev?: string;
} & ProTableProps<FundsReportItem, any>;
export default function FundReportTable({ url, ...rest }: FundReportTableProps) {
  const { run, error } = useRequest<RowResponse<FundsReportItem>>(
    (params: any) => ({
      url,
      data: {
        ...params,
        dev: rest.dev,
      },
      method: 'POST',
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
      request={async (params) => {
        const res = await run(transProTableParamsToMyRequest(params));
        return {
          data: res.rows,
          success: !error,
        };
      }}
      manualRequest
      bordered
      {...rest}
    />
  );
}
