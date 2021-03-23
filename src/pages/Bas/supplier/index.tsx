import React, { useState, useRef } from 'react';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { querySuppliers, querySuppliersInfo } from '@/services/Bas';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import SupplierForm from './form';
import { transformRegionCd } from '@/utils/utils';
import { useModel } from '@/.umi/plugin-model/useModel';

export const Supplier: React.FC<{
  select: boolean;
  onChange?: (value: { label: string; value: React.Key }) => void;
}> = ({ select, onChange }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.Supplier>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const { options } = useModel('suppType', (model) => ({ options: model.options }));
  const columns: ProColumns<BAS.Supplier>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      dataIndex: 'suppId',
      title: '供应商类别',
      valueType: 'select',
      hideInTable: true,
      request: async () => options,
    },
    {
      dataIndex: 'keyword',
      title: '关键字',
      hideInTable: true,
    },
    {
      dataIndex: 'suppCd',
      title: '供应商编号',
      copyable: true,
      search: false,
    },
    {
      dataIndex: 'suppName',
      title: '供应商名称',
      search: false,
    },
    {
      dataIndex: 'mainRelId',
      title: '首要联系人',
      search: false,
    },
    {
      key: 'relMobile',
      dataIndex: 'relMobile',
      title: '手机',
      search: false,
      hideInTable: select,
    },
    {
      key: 'tel',
      dataIndex: 'tel',
      title: '座机',
      search: false,
      hideInTable: select,
    },
    {
      key: 'email',
      dataIndex: 'email',
      title: 'Email',
      search: false,
      hideInTable: select,
    },
    {
      key: 'address',
      dataIndex: 'address',
      title: '联系地址',
      search: false,
      hideInTable: select,
    },
    {
      key: 'memo',
      dataIndex: 'memo',
      title: '备注',
      search: false,
      hideInTable: select,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      search: false,
      hideInTable: select,
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
    width: 150,
    render: (_, entity) => {
      return !select
        ? [
            <a
              key="editable"
              onClick={async () => {
                setFormAction('upd');
                const res = (await querySuppliersInfo(entity.suppId)).data;
                res.regioncdMid = transformRegionCd(res.regioncd);
                setModalFormInit(res);
                setModalVisit(true);
              }}
            >
              修改
            </a>,
            <a key="del" className="error-color">
              删除
            </a>,
          ]
        : [
            <a
              key="editable"
              onClick={async () => {
                onChange?.({
                  label: entity.suppName,
                  value: entity.suppId,
                });
              }}
            >
              选择
            </a>,
          ];
    },
  });
  return (
    <>
      <SupplierForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
      <ProTable<BAS.Supplier>
        pagination={{
          pageSize: 10,
        }}
        rowKey="suppId"
        actionRef={actionRef}
        bordered
        columns={columns}
        request={async (params) => {
          const response = await querySuppliers({
            ...params,
            pageNumber: params.current,
            queryFilter: {
              ...params,
            },
          });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
      />
    </>
  );
};

export default () => {
  return (
    <PageHeaderWrapper title={false}>
      <ProCard split="vertical">
        <Supplier select={false} />
      </ProCard>
    </PageHeaderWrapper>
  );
};
