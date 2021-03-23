import type { DepFilters } from '@/services/Sys/dep';
import { queryDepTreelist, updDep, delDep } from '@/services/Sys/dep';
import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import type { DepDataType } from '../user';
import DelPopconfirm from '@/components/DelPopconfirm';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import DepForm from './form';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const { queryDepList } = useModel('dep', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    queryDepList: model.queryDepList,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dep>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const depColumns: ProColumnType<DepDataType>[] = [
    {
      title: 'depId',
      dataIndex: 'depId',
      hideInTable: true,
      search: false,
    },
    {
      title: '部门名称',
      dataIndex: 'depName',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      search: false,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      search: false,
      valueEnum: () => {
        return new Map([
          [1, { text: '正常', status: 'Success' }],
          [0, { text: '禁用', status: 'Error' }],
        ]);
      },
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      width: 150,
      render: (_, entity, _index, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              setFormAction('upd');
              setModalFormInit(entity);
              setModalVisit(true);
            }}
          >
            修改
          </a>,
          <DelPopconfirm
            key="del"
            onConfirm={async () => {
              await delDep([entity.depId]);
              action.reload();
            }}
          />,
        ];
      },
    },
  ];
  return (
    <PageHeaderWrapper title={false}>
      <ProCard split="vertical">
        <ProTable<DepDataType, DepFilters>
          bordered
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setFormAction('add');
                setModalFormInit({});
                setModalVisit(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ]}
          editable={{
            onSave: async (_, row) => {
              await updDep(row);
              message.success('修改部门成功。');
            },
          }}
          expandable={{
            defaultExpandedRowKeys: [1],
          }}
          search={{ collapseRender: false, collapsed: false, span: 4 }}
          rowKey="depId"
          columns={depColumns}
          request={async (params) => {
            queryDepList({ pageSize: -1 });
            const response = await queryDepTreelist(params);
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={false}
        />
      </ProCard>
      <DepForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </PageHeaderWrapper>
  );
};
