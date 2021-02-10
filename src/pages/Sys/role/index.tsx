import { queryRoleList } from '@/services/Sys/role';
import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import React from 'react';
import { history } from 'umi';

export type RoleDataType = {
  RoleId: string | number;
  RoleName: string;
  RoleDesc: string;
  SortNum: number;
  State: 0 | 1;
};

const columns: ProColumnType<RoleDataType>[] = [
  {
    title: 'RoleId',
    dataIndex: 'RoleId',
    hideInTable: true,
    search: false,
  },
  {
    title: '角色名称',
    dataIndex: 'RoleName',
  },
  {
    title: '角色描述',
    dataIndex: 'RoleDesc',
  },
  {
    title: '顺序',
    dataIndex: 'SortNum',
    search: false,
  },
  {
    title: '状态',
    dataIndex: 'State',
    valueType: 'select',
    valueEnum: () => {
      return {
        '0': {
          text: '正常',
          status: 'Success',
        },
        '1': {
          text: '禁用',
          status: 'Error',
        },
      };
    },
  },
  {
    title: '操作',
    key: 'action',
    valueType: 'option',
    render: (_, entity, _index, action) => {
      return [
        <Button
          type="link"
          key="editable"
          onClick={() => {
            action.startEditable?.(entity.RoleId as number);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          key="editable"
          onClick={() => {
            history.push(`/sys/dep/${entity.RoleId}`);
          }}
        >
          查看
        </Button>,
      ];
    },
  },
];

export default (): React.ReactNode => {
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProTable<RoleDataType>
          search={{ collapseRender: false, collapsed: false, span: 4 }}
          rowKey="RoleId"
          columns={columns}
          request={async (params) => {
            const response = await queryRoleList({
              ...params,
              pageNumber: params.current,
            });
            return {
              data: response.data.rows,
              success: response.msg === 'success',
              total: response.data.total,
            };
          }}
          pagination={{
            pageSize: 10,
          }}
        />
      </ProCard>
    </PageHeaderWrapper>
  );
};
