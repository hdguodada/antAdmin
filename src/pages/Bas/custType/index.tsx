import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustTypeForm from './form';
import { delCusttype } from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import SuppType from '../suppType';
import ProductType from '../productType';

const CustTypeTable: React.FC<{
  columns?: ProColumns<BAS.CustType>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustType>[] = [
    {
      title: '类型名称',
      dataIndex: 'custTypeName',
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
            await delCusttype([entity.custTypeId]);
            action.reload();
          }}
        />,
      ];
    },
  });
  const { queryCustTypeTree, queryCustType } = useModel('custType', (model) => ({
    queryCustTypeTree: model.queryCustTypeTree,
    queryCustType: model.queryCustType,
  }));
  return (
    <>
      <ProTable<BAS.CustType>
        size="small"
        expandable={{
          defaultExpandAllRows: true,
        }}
        pagination={false}
        search={false}
        rowKey="custTypeId"
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
          queryCustType({ pageNumber: -1 });
          const response = await queryCustTypeTree();
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
  return (
    <ProCard>
      <PageContainer
        title={false}
        tabList={[
          {
            tab: '客户',
            key: 'custType',
            children: <CustTypeTable />,
          },
          {
            tab: '供应商',
            key: 'supplierType',
            children: <SuppType />,
          },
          {
            tab: '产品',
            key: 'productType',
            children: <ProductType />,
          },
        ]}
        tabProps={{
          defaultActiveKey: 'productType',
        }}
      />
    </ProCard>
  );
};
