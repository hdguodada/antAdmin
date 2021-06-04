import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { queryCodeRule } from '@/services/Sys';
import CodeRuleForm from './form';
import { indexColumns, optionColumns, stateColumns } from '@/utils/columns';

export const CodelRuleTable: React.FC = () => {
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<SYS.CodeRule>();
  const actionRef = useRef<ActionType>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<SYS.CodeRule>[] = [
    indexColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
    }),
    {
      title: '快速查询',
      dataIndex: 'keyword',
      hideInTable: true,
    },
    {
      title: '编码标识',
      dataIndex: 'codeId',
      search: false,
    },
    {
      title: '编码名称',
      dataIndex: 'codeName',
      search: false,
    },
    {
      title: '编码前缀',
      dataIndex: 'prefix',
      search: false,
    },
    stateColumns,
  ];
  return (
    <>
      <ProTable<SYS.CodeRule>
        actionRef={actionRef}
        rowKey="codeId"
        request={async (params) => {
          const response = await queryCodeRule({
            ...params,
            queryFilter: params,
          });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        pagination={false}
        options={false}
        columns={columns}
      />
      <CodeRuleForm
        action={formAction}
        visible={modalVisit}
        initialValues={modalFormInit}
        setVisible={setModalVisit}
        actionRef={actionRef}
      />
    </>
  );
};
export default (): React.ReactNode => {
  return (
    <PageHeaderWrapper
      content={
        <ProCard split="vertical">
          <CodelRuleTable />
        </ProCard>
      }
    />
  );
};
