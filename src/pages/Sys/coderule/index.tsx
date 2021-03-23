import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space, Table, Button } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { queryCodeRule } from '@/services/Sys';

export default (): React.ReactNode => {
  const columns: ProColumnType<API.Log>[] = [
    {
      title: '编码标识',
      dataIndex: 'CodeId',
    },
    {
      title: '编码名称',
      dataIndex: 'CodeName',
    },
    {
      title: '编码前缀',
      dataIndex: 'Prefix',
    },
    {
      title: '编码长度',
      dataIndex: 'Len',
    },
    {
      title: '起始编号',
      dataIndex: 'StartNo',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () => {
        return new Map([
          [1, { text: '正常', status: 'Success' }],
          [0, { text: '禁用', status: 'Error' }],
        ]);
      },
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProTable<API.Log>
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
            const response = await queryCodeRule({
              ...params,
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
