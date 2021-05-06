import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { delStore, queryStore } from '@/services/Bas';
import StoreForm from './form';
import {
  baseSearch,
  indexColumns,
  optionColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import { PageContainer } from '@ant-design/pro-layout';
import BatchDel from '@/components/DelPopconfirm';

export default () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Store>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.Store>[] = [
    indexColumns,
    {
      dataIndex: 'keyword',
      title: '快速查询',
      fieldProps: {
        placeholder: '请输入仓库编号或名称',
      },
      hideInTable: true,
    },
    {
      title: '仓库编号',
      dataIndex: 'storeCd',
      search: false,
    },
    {
      title: '仓库名称',
      dataIndex: 'storeName',
      search: false,
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
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delStore([record.storeCd]);
      },
    }),
  ];

  return (
    <PageContainer
      content={
        <>
          <ProTable<BAS.Store>
            rowKey="storeCd"
            actionRef={actionRef}
            options={false}
            search={baseSearch({
              fn: () => {
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
                    await delStore(selectedRowKeys);
                    actionRef.current?.reload();
                  }}
                />,
              ]);
            }}
            columns={columns}
            request={async (params) => {
              const response = await queryStore({
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
          <StoreForm
            setVisible={setModalVisit}
            visible={modalVisit}
            initialValues={modalFormInit}
            action={formAction}
            actionRef={actionRef}
          />
        </>
      }
    />
  );
};
