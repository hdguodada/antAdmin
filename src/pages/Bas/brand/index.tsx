import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Avatar } from 'antd';
import { delBrand } from '@/services/Bas';
import ProductTypeForm from './form';
import { indexColumns, optionColumns, refreshAndNew, stateColumns } from '@/utils/columns';

export default () => {
  const { list, query } = useModel('brand', (model) => ({
    list: model.list,
    query: model.query,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.Brand>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Brand>[] = [
    indexColumns,
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
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit({
          ...record,
          logoMid: record.logo ? [{ url: BASE_URL + record.logo }] : [],
        });
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delBrand([record.brandId]);
        query();
      },
    }),
  ];
  return (
    <>
      <ProTable<BAS.Brand>
        expandable={{
          defaultExpandAllRows: true,
        }}
        pagination={false}
        search={false}
        toolBarRender={() =>
          refreshAndNew({
            fn: async () => {
              setFormAction('add');
              setModalFormInit({});
              setModalVisit(true);
            },
            refresh: query,
          })
        }
        rowKey="brandId"
        actionRef={actionRef}
        columns={columns}
        options={false}
        dataSource={list}
      />
      <ProductTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit as BAS.Brand}
      />
    </>
  );
};
