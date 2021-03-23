import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delStore } from '@/services/Bas';
import StoreForm from './form';

export default () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustArea>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Store>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
      width: 50,
      align: 'center',
    },
    {
      title: '仓库名称',
      dataIndex: 'storeName',
    },
    {
      title: '联系人',
      dataIndex: 'linkman',
      search: false,
    },
    {
      title: '手机号',
      dataIndex: 'mobile',
      search: false,
    },
    {
      title: '座机',
      dataIndex: 'tel',
      search: false,
    },
    {
      title: '地址',
      dataIndex: 'address',
      search: false,
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
            await delStore([entity.storeCd]);
            action.reload();
          }}
        />,
      ];
    },
  });
  const { list } = useModel('store', (model) => ({
    list: model.list,
  }));
  return (
    <>
      <StoreForm
        setVisible={setModalVisit}
        visible={modalVisit}
        initialValues={modalFormInit}
        action={formAction}
        actionRef={actionRef}
      />
      <ProTable<BAS.Store>
        size="small"
        rowKey="storeCd"
        actionRef={actionRef}
        bordered
        search={false}
        pagination={false}
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
    </>
  );
};
