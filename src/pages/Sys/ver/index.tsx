import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryVers } from '@/services/Sys';

export default (): React.ReactNode => {
  const columns: ProColumnType<API.Ver>[] = [
    {
      title: '平台',
      dataIndex: 'platform',
    },
    {
      title: '版本号',
      dataIndex: 'version',
    },
  ];
  return (
    <PageContainer
      content={
        <ProTable<API.Ver>
          search={false}
          rowKey="verId"
          postData={(dataSource) => {
            return dataSource.map((item) => ({
              ...item,
              State: String(item.State),
            }));
          }}
          request={async (params) => {
            const response = await queryVers(params);
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={false}
          options={false}
          columns={columns}
        />
      }
    />
  );
};
