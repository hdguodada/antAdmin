import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Space, Button } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
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
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProTable<API.Ver>
          search={false}
          bordered
          rowKey="AutoId"
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
            const response = await queryVers({
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
