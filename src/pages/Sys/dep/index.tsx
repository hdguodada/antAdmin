import type { DepFilters } from '@/services/Sys/dep';
import { queryDepTreelist } from '@/services/Sys/dep';
import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import React from 'react';
import type { DepDataType } from '../user';
import { history } from 'umi';

const depColumns: ProColumnType<DepDataType>[] = [
  {
    title: 'DepId',
    dataIndex: 'DepId',
    hideInTable: true,
    search: false,
  },
  {
    title: '部门名称',
    dataIndex: 'DepName',
  },
  {
    title: '负责人',
    dataIndex: 'Leader',
  },
  {
    title: '联系电话',
    dataIndex: 'Phone',
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
          type="primary"
          key="editable"
          onClick={() => {
            action.startEditable?.(entity.DepId as number);
          }}
        >
          编辑
        </Button>,
        <Button
          type="link"
          key="editable"
          onClick={() => {
            history.push(`/sys/dep/${entity.DepId}`);
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
        <ProTable<DepDataType, DepFilters>
          expandable={{
            defaultExpandedRowKeys: [1],
          }}
          search={{ collapseRender: false, collapsed: false, span: 4 }}
          rowKey="DepId"
          columns={depColumns}
          request={async (params) => {
            const response = await queryDepTreelist(params);
            return {
              data: response.data.rows,
              success: response.msg === 'success',
              total: response.data.total,
            };
          }}
          pagination={false}
        />
      </ProCard>
    </PageHeaderWrapper>
  );
};
