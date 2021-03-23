import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Avatar, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delBrand, delUnit } from '@/services/Bas';
import UnitForm from './form';

export default () => {
  const { list, query } = useModel('unit', (model) => ({
    list: model.list,
    query: model.query,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Unit>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 75,
    },
    {
      title: '计量单位',
      dataIndex: 'unitName',
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
    render: (_, entity) => {
      return [
        <DelPopconfirm
          key="del"
          onConfirm={async () => {
            await delUnit([entity.unitId]);
            query({ pageNumber: -1 });
          }}
        />,
      ];
    },
  });
  return (
    <>
      {list.length > 0 ? (
        <ProTable<BAS.Brand>
          size="small"
          expandable={{
            defaultExpandAllRows: true,
          }}
          pagination={false}
          search={false}
          rowKey="unitId"
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
          dataSource={list}
        />
      ) : (
        ''
      )}

      <UnitForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </>
  );
};
