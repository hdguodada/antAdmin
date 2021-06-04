import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryException } from '@/services/Sys';

export default (): React.ReactNode => {
  const columns: ProColumnType<SYS.Exception>[] = [
    {
      title: '用户Id',
      dataIndex: 'userId',
    },
    {
      title: '客户端电脑名',
      dataIndex: 'client',
    },
    {
      title: '异常信息',
      dataIndex: 'message',
    },
    {
      title: '异常详细',
      dataIndex: 'detail',
    },
  ];
  return (
    <PageContainer
      content={
        <ProTable<SYS.Exception>
          search={false}
          rowKey="autoId"
          request={async (params) => {
            const response = await queryException({
              pageSize: params.pageSize,
              pageNumber: params.current,
            });
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          options={false}
          pagination={{
            pageSize: 10,
          }}
          columns={columns}
        />
      }
    ></PageContainer>
  );
};
