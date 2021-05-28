import React, { useRef, useState, forwardRef, useImperativeHandle } from 'react';
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
  memoColumns,
  stateColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import BatchDel from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { copyFilterObjWithWhiteList } from '@/utils/utils';

type CustomerTableProps = {
  selectParams?: { state: number };
  select?: boolean;
  onChange?: (value: BAS.Customer[]) => void;
  multiple?: boolean;
};
export const CustomerTable = forwardRef((props: CustomerTableProps, ref) => {
  const { selectParams, onChange, multiple, select } = props;
  const actionRef = useRef<ActionType>();
  useImperativeHandle(ref, () => ({
    clearSelected: () => {
      actionRef.current?.clearSelected?.();
    },
  }));
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
      fixed: 'left',
    },
    memoColumns(),
    stateColumns,
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    width: 120,
    fixed: 'right',
    render: (_, entity) => {
      return select && !multiple
        ? [
            <a
              key="editable"
              onClick={async () => {
                onChange?.([
                  copyFilterObjWithWhiteList(entity, ['custCd', 'custId', 'accountPayableSum']),
                ]);
              }}
            >
              选择
            </a>,
          ]
        : [
            <a
              key="editable"
              onClick={() => {
                history.push(`/bas/customer/${entity.custId}`);
              }}
            >
              视图
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
        params={selectParams}
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys, selectedRows }) => {
          return select
            ? tableAlertOptionRenderDom([
                <Button
                  type="dashed"
                  danger
                  key="select"
                  onClick={() => {
                    onChange?.(
                      selectedRows.map((i) =>
                        copyFilterObjWithWhiteList(i, ['custCd', 'custId', 'accountPayableSum']),
                      ),
                    );
                  }}
                >
                  选中并关闭
                </Button>,
              ])
            : tableAlertOptionRenderDom([
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
});

export default () => {
  return <PageContainer title={false} content={<CustomerTable />} />;
};
