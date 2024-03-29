import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CustTypeForm from './form';
import { delCusttype } from '@/services/Bas';
import { optionColumns, stateColumns } from '@/utils/columns';

export default function CustTypeTable() {
  const { queryCustTypeTree, custTypeTree } = useModel('custType', (model) => ({
    queryCustTypeTree: model.queryCustTypeTree,
    custTypeTree: model.custTypeTree,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.CustType>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustType>[] = [
    {
      title: '类型名称',
      dataIndex: 'custTypeName',
      search: false,
      fixed: 'left',
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delCusttype([record.custTypeId]);
        queryCustTypeTree();
      },
    }),
  ];

  return (
    <>
      <ProTable<BAS.CustType>
        pagination={false}
        search={false}
        rowKey="custTypeId"
        actionRef={actionRef}
        expandable={{
          defaultExpandAllRows: true,
        }}
        headerTitle={'客户类别'}
        options={false}
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setFormAction('add');
              setModalFormInit(undefined);
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        columns={columns}
        dataSource={custTypeTree[0].children}
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
}
