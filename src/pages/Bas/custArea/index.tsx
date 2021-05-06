import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delCustArea } from '@/services/Bas';
import CustAreaForm from './form';
import { optionColumns } from '@/utils/columns';

export default () => {
  const { queryCustAreaTree, tree } = useModel('custArea', (model) => ({
    queryCustAreaTree: model.queryCustAreaTree,
    tree: model.tree,
    queryCustArea: model.queryCustArea,
  }));
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.CustArea>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustArea>[] = [
    {
      title: '区域名称',
      dataIndex: 'areaName',
      search: false,
      fixed: 'left',
    },
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delCustArea([record.areaId]);
        queryCustAreaTree();
      },
    }),
  ];

  return (
    <>
      <CustAreaForm
        setVisible={setModalVisit}
        visible={modalVisit}
        initialValues={modalFormInit}
        action={formAction}
        actionRef={actionRef}
      />
      {tree.length > 0 && (
        <ProTable<BAS.CustArea>
          expandable={{
            defaultExpandAllRows: true,
          }}
          pagination={false}
          search={false}
          rowKey="areaId"
          actionRef={actionRef}
          dataSource={tree[0].children}
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
        />
      )}
    </>
  );
};
