import type { DepFilters } from '@/services/Sys/dep';
import { delDep } from '@/services/Sys/dep';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import type { DepDataType } from '../user';
import { useModel } from 'umi';
import DepForm from './form';
import { baseSearch, optionColumns, stateColumns } from '@/utils/columns';
import GlobalWrapper from '@/components/GlobalWrapper';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const { queryDepTree } = useModel('dep', (model) => ({
    queryDepTree: model.queryDepTree,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<SYS.Dep>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const depColumns: ProColumnType<DepDataType>[] = [
    {
      title: 'depId',
      dataIndex: 'depId',
      hideInTable: true,
      search: false,
    },
    {
      title: '部门名称',
      dataIndex: 'depName',
      fixed: 'left',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
      search: false,
    },
    {
      title: '联系电话',
      dataIndex: 'phone',
      search: false,
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delDep([record.depId]);
      },
    }),
  ];
  return (
    <GlobalWrapper type="list">
      <PageContainer
        content={
          <>
            <ProTable<DepDataType, DepFilters>
              actionRef={actionRef}
              expandable={{
                defaultExpandedRowKeys: [1],
              }}
              search={baseSearch({
                fn: () => {
                  setFormAction('add');
                  setModalFormInit(undefined);
                  setModalVisit(true);
                },
              })}
              rowKey="depId"
              columns={depColumns}
              request={async (params) => {
                const response = await queryDepTree({ ...params, queryFilter: params });
                return {
                  data: response.data.rows,
                  success: response.code === 0,
                  total: response.data.total,
                };
              }}
              pagination={false}
              options={false}
            />
            <DepForm
              action={formAction}
              visible={modalVisit}
              actionRef={actionRef}
              setVisible={setModalVisit}
              initialValues={modalFormInit}
            />
          </>
        }
      />
    </GlobalWrapper>
  );
};
