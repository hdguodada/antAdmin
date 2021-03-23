import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Avatar, Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delBrand } from '@/services/Bas';
import ProductTypeForm from './form';

export default () => {
  const { brandList, query } = useModel('brand', (model) => ({
    brandList: model.list,
    query: model.query,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Brand>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
    },
    {
      title: '品牌名称',
      dataIndex: 'brandName',
      search: false,
    },
    {
      title: 'letter',
      dataIndex: 'letter',
      search: false,
    },
    {
      title: 'Logo',
      dataIndex: 'logo',
      search: false,
      render: (_, record) => (record.logo ? <Avatar src={BASE_URL + _} /> : '-'),
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
            await delBrand([entity.brandId]);
            query({ pageNumber: -1 });
          }}
        />,
      ];
    },
  });
  return (
    <>
      {brandList.length > 0 ? (
        <ProTable<BAS.Brand>
          size="small"
          expandable={{
            defaultExpandAllRows: true,
          }}
          pagination={false}
          search={false}
          rowKey="brandId"
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
          dataSource={brandList}
          postData={(values) => values[0].children}
        />
      ) : (
        ''
      )}

      <ProductTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </>
  );
};
