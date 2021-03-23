import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustTypeForm from './form';
import { delSuppType } from '@/services/Bas';

const SuppType: React.FC<{
  columns?: ProColumns<BAS.SuppType>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.SuppType>[] = [
    {
      title: '供应商类别',
      dataIndex: 'suppTypeName',
      search: false,
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
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
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
            await delSuppType([entity.suppTypeId]);
            action.reload();
          }}
        />,
      ];
    },
  });
  const { query, queryTree } = useModel('suppType', (model) => ({
    query: model.query,
    queryTree: model.queryTree,
  }));
  return (
    <>
      <ProTable<BAS.SuppType>
        size="small"
        expandable={{
          defaultExpandAllRows: true,
        }}
        pagination={false}
        search={false}
        rowKey="suppTypeId"
        actionRef={actionRef}
        bordered
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
        columns={columns}
        request={async () => {
          query({ pageNumber: -1 });
          const response = await queryTree();
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        postData={(values) => values[0].children}
      />
      <CustTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </>
  );
};
export default () => {
  return <SuppType />;
};
