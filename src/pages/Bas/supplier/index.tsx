import React, { useRef } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { delSupplier, querySuppliers } from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import {
  baseSearch,
  checkStatusColumns,
  indexColumns,
  keywordColumns,
  stateColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import { history } from 'umi';
import BatchDel from '@/components/DelPopconfirm';
import { useState } from 'react';
import AddSuppForm from './addForm';
import { Button, message } from 'antd';
import { check } from '@/services';
import { mapModId } from '@/utils/utils';
import GlobalWrapper from '@/components/GlobalWrapper';

export const Supplier: React.FC<{
  select: boolean;
  onChange?: (value: BAS.Supplier[]) => void;
  multiple?: boolean;
  selectParams?: { state: number; checkStatus: number };
}> = ({ select, onChange, selectParams, multiple }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Supplier>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Supplier>[] = [
    keywordColumns({
      placeholder: '按供应商编号,供应商名称,等查询',
    }),

    indexColumns,
    {
      dataIndex: 'suppId',
      title: '供应商类别',
      valueType: 'select',
      hideInTable: true,
      render: (_, record) => <div>{record.suppTypeName}</div>,
      search: false,
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
      render: (_, record) => <div>{record.relName}</div>,
    },
    {
      key: 'relMobile',
      dataIndex: 'relMobile',
      title: '手机',
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
    checkStatusColumns(undefined),
    stateColumns,
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    fixed: 'right',
    width: 120,
    render: (_, record) => {
      return !select
        ? [
            <a
              key="editable"
              onClick={() => {
                history.push(`/bas/supplier/${record.suppId}`);
              }}
            >
              视图
            </a>,
          ]
        : [
            <a
              key="editable"
              onClick={async () => {
                onChange?.([record]);
              }}
            >
              选择
            </a>,
          ];
    },
  });
  return (
    <>
      <AddSuppForm
        visible={modalVisit}
        initialValues={modalFormInit}
        action={formAction}
        setVisible={setModalVisit}
      />
      <ProTable<BAS.Supplier, { state: number; checkStatus?: number }>
        rowKey="suppId"
        actionRef={actionRef}
        options={false}
        search={baseSearch({
          fn: () => {
            setFormAction('add');
            setModalFormInit(undefined);
            setModalVisit(true);
          },
        })}
        pagination={{ pageSize: 10 }}
        columns={columns}
        params={selectParams}
        request={async (params) => {
          const response = await querySuppliers({
            ...params,
            pageNumber: params.current,
            queryFilter: params,
          });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        rowSelection={select && !multiple ? false : {}}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => {
          if (select && multiple) {
            return tableAlertOptionRenderDom([
              <Button
                type="dashed"
                key="select"
                onClick={() => {
                  onChange?.(selectedRows);
                }}
              >
                选中并关闭
              </Button>,
            ]);
          }
          return tableAlertOptionRenderDom([
            <BatchDel
              key="del"
              onConfirm={async () => {
                await delSupplier(selectedRowKeys);
                actionRef.current?.reload();
              }}
            />,
            <Button
              key="check"
              onClick={async () => {
                const ids: React.Key[] = [];
                selectedRows.forEach((i) => {
                  if (i.checkStatus !== 2) {
                    ids.push(i.suppId);
                  }
                });
                await check({
                  url: '/bas/supplier/check',
                  data: {
                    ids,
                    checkStatus: 2,
                  },
                  headers: { modId: mapModId.supplier },
                });
                message.success('审核成功');
                actionRef.current?.reload();
              }}
            >
              审核
            </Button>,
            <Button
              key="uncheck"
              type="dashed"
              onClick={async () => {
                await check({
                  url: '/bas/supplier/check',
                  data: {
                    ids: selectedRowKeys,
                    checkStatus: 3,
                  },
                  headers: { modId: mapModId.supplier },
                });
                message.success('反审核成功');
                actionRef.current?.reload();
              }}
            >
              反审核
            </Button>,
          ]);
        }}
      />
    </>
  );
};

export default () => {
  return (
    <GlobalWrapper type="list">
      <PageContainer content={<Supplier select={false} />} />;
    </GlobalWrapper>
  );
};
