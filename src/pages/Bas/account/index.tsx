import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import AccountForm from './form';
import {
  baseSearch,
  dateColumns,
  indexColumns,
  isDeafultColumns,
  moneyColumns,
  optionColumns,
  stateColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import { delAccount, queryAccount } from '@/services/Bas/account';
import BatchDel from '@/components/DelPopconfirm';
import { PageContainer } from '@ant-design/pro-layout';

export default () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Account>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const { valueEnum } = useModel('options', (model) => ({
    valueEnum: model.valueEnum,
  }));
  const columns: ProColumns<BAS.Account>[] = [
    indexColumns,
    {
      title: '账户编号',
      dataIndex: 'accountNo',
      search: false,
    },
    {
      title: '账户名称',
      dataIndex: 'accountName',
      search: false,
    },
    isDeafultColumns(),
    dateColumns({ title: '余额日期', dataIndex: 'balanceDate' }),
    moneyColumns({
      title: '期初余额',
      dataIndex: 'initBalance',
    }),
    moneyColumns({
      title: '当前余额',
      dataIndex: 'currentBalance',
    }),
    moneyColumns({
      title: '上次结账后余额',
      dataIndex: 'lastSettBalance',
    }),
    {
      title: '结算账户类别',
      dataIndex: 'accountTypeId',
      search: false,
      valueType: 'select',
      valueEnum: valueEnum('AccountType'),
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delAccount([record.accountId]);
      },
    }),
  ];
  return (
    <PageContainer
      content={
        <>
          <ProTable<BAS.Account>
            search={baseSearch({
              fn: async () => {
                setFormAction('add');
                setModalFormInit(undefined);
                setModalVisit(true);
              },
            })}
            rowSelection={{}}
            tableAlertOptionRender={({ selectedRowKeys }) => {
              return tableAlertOptionRenderDom([
                <BatchDel
                  key="del"
                  onConfirm={async () => {
                    await delAccount(selectedRowKeys);
                    actionRef.current?.reload();
                  }}
                />,
              ]);
            }}
            rowKey="accountId"
            actionRef={actionRef}
            options={false}
            columns={columns}
            pagination={false}
            request={async (params) => {
              const res = await queryAccount({
                ...params,
                pageNumber: params.current,
                queryFilter: params,
              });
              return {
                data: res.data.rows,
                success: res.code === 0,
              };
            }}
          />
          <AccountForm
            action={formAction}
            visible={modalVisit}
            actionRef={actionRef}
            setVisible={setModalVisit}
            initialValues={modalFormInit}
          />
        </>
      }
    />
  );
};
