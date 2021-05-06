import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { delCustomer, queryCustomers } from '@/services/Bas';
import { history } from 'umi';
import CustomerForm from './form';
import { PageContainer } from '@ant-design/pro-layout';
import {
  baseSearch,
  indexColumns,
  keywordColumns,
  stateColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import BatchDel from '@/components/DelPopconfirm';

export const CustomerTable: React.FC<{
  select?: { state: number };
  onChange?: (value: { label: string; value: React.Key }) => void;
}> = ({ select, onChange }) => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const columns: ProColumns<BAS.Customer>[] = [
    indexColumns,
    keywordColumns({ placeholder: '请输入编号或者客户名称查询' }),
    {
      dataIndex: 'custTypeId',
      title: '客户类别',
      search: false,
      render: (_, record) => <div>{record.custTypeName}</div>,
    },
    {
      key: 'custLevelId',
      dataIndex: 'custLevelId',
      title: '客户等级',
      render: (_, record) => <div>{record.custLevelName}</div>,
      search: false,
    },

    {
      dataIndex: 'custCd',
      title: '客户编号',
      search: false,
    },
    {
      dataIndex: 'custName',
      title: '客户名称',
      search: false,
      ellipsis: true,
      copyable: true,
    },
    {
      key: 'memo',
      dataIndex: 'memo',
      title: '备注',
      search: false,
      hideInTable: !!select,
    },
    stateColumns,
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    width: 120,
    render: (_, entity) => {
      return !select
        ? [
            <a
              key="editable"
              onClick={() => {
                history.push(`/bas/customer/${entity.custId}`);
              }}
            >
              视图
            </a>,
          ]
        : [
            <a
              key="editable"
              onClick={async () => {
                onChange?.({
                  label: entity.custName,
                  value: entity.custId,
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
      <CustomerForm visible={modalVisit} setVisible={setModalVisit} action={'add'} />
      <ProTable<BAS.Customer>
        pagination={{
          pageSize: 10,
        }}
        rowKey="custId"
        actionRef={actionRef}
        options={false}
        search={baseSearch({
          fn: () => {
            setModalVisit(true);
          },
        })}
        columns={columns}
        params={select}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return tableAlertOptionRenderDom([
            <BatchDel
              key="del"
              onConfirm={async () => {
                await delCustomer(selectedRowKeys);
                actionRef.current?.reload();
              }}
            />,
          ]);
        }}
        request={async (params) => {
          const response = await queryCustomers({
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
      />
    </>
  );
};

export default () => {
  return <PageContainer content={<CustomerTable />} />;
};
