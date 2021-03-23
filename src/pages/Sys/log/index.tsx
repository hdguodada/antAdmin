import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space, Table, Button } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { queryLogList } from '@/services/Init';

export default (): React.ReactNode => {
  const columns: ProColumnType<API.Log>[] = [
    {
      title: '操作内容',
      dataIndex: 'content',
      ellipsis: true,
      search: false,
    },
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
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProTable<API.Log>
          search={false}
          bordered
          rowKey="AutoId"
          rowSelection={{
            selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
          }}
          tableAlertOptionRender={() => {
            return (
              <Space size={16}>
                <a>批量删除</a>
                <a>导出数据</a>
              </Space>
            );
          }}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                history.push('/sys/user/new');
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ]}
          editable={{}}
          postData={(dataSource) => {
            return dataSource.map((item) => ({
              ...item,
              State: String(item.State),
            }));
          }}
          request={async (params) => {
            const response = await queryLogList({
              pageSize: params.pageSize,
              pageNumber: params.current,
            });
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={{
            pageSize: 5,
          }}
          columns={columns}
        />
      </ProCard>
    </PageHeaderWrapper>
  );
};
