import { PageContainer } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { withRouter } from 'umi';
import { queryLogList } from '@/services/Init';
import { indexColumns } from '@/utils/columns';

export default withRouter(() => {
  const columns: ProColumnType<SYS.Log>[] = [
    indexColumns,

    {
      title: '操作模块',
      dataIndex: 'modName',
      search: false,
    },
    {
      title: '用户名',
      dataIndex: 'userName',
      search: false,
    },
  ];
  const modId = '12';
  return (
    <PageContainer
      content={
        <ProTable<SYS.Log>
          search={false}
          rowKey="autoId"
          expandable={{
            expandedRowRender: (record) => <p style={{ margin: 0 }}>{record.content}</p>,
          }}
          options={false}
          postData={(dataSource) => {
            return dataSource.map((item) => ({
              ...item,
              State: String(item.State),
            }));
          }}
          request={async (params) => {
            const response = await queryLogList(
              {
                pageSize: params.pageSize,
                pageNumber: params.current,
              },
              {
                modId,
              },
            );
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={{
            pageSize: 10,
          }}
          columns={columns}
        />
      }
    />
  );
});
