import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import CateType from './form';
import { delSuppType } from '@/services/Bas';
import { dateColumns, optionColumns, stateColumns } from '@/utils/columns';

const SuppType: React.FC<{
  columns?: ProColumns<BAS.SuppType>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const { tree, queryTree } = useModel('suppType', (model) => ({
    tree: model.tree,
    queryTree: model.queryTree,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.SuppType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.SuppType>[] = [
    {
      title: '供应商类别',
      dataIndex: 'suppTypeName',
      search: false,
    },
    stateColumns,
    dateColumns(),
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delSuppType([record.suppTypeId]).then(() => {
          queryTree();
        });
      },
      fixed: 'right',
    }),
  ];

  return (
    <>
      {tree.length > 0 && (
        <ProTable<BAS.SuppType>
          pagination={false}
          search={false}
          rowKey="suppTypeId"
          actionRef={actionRef}
          toolBarRender={() => [
            <Button
              type="primary"
              onClick={() => {
                setFormAction('add');
                setModalFormInit({});
                setModalVisit(true);
              }}
            >
              <PlusOutlined />
              新建
            </Button>,
          ]}
          expandable={{
            defaultExpandAllRows: true,
          }}
          dataSource={tree[0].children}
          columns={columns}
          options={false}
        />
      )}

      <CateType
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit as BAS.SuppType}
      />
    </>
  );
};
export default () => {
  return <SuppType />;
};
