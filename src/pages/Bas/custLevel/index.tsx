import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delCustLevel } from '@/services/Bas';
import LevelForm from './form';
import { indexColumns, optionColumns, stateColumns } from '@/utils/columns';

const CustLevel: React.FC<{
  columns?: ProColumns<BAS.CustLevel>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const { level, queryCustLevel } = useModel('custLevel', (model) => ({
    level: model.level,
    queryCustLevel: model.queryCustLevel,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustLevel>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustLevel>[] = [
    indexColumns,
    {
      title: '等级',
      dataIndex: 'levelName',
      search: false,
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      search: false,
      valueType: 'percent',
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delCustLevel([record.levelId]);
        await queryCustLevel();
      },
    }),
  ];

  return (
    <>
      <LevelForm
        setVisible={setModalVisit}
        visible={modalVisit}
        initialValues={modalFormInit}
        action={formAction}
        actionRef={actionRef}
      />
      <ProTable<BAS.CustLevel>
        expandable={{
          defaultExpandAllRows: true,
        }}
        options={false}
        pagination={false}
        search={false}
        rowKey="levelId"
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
        columns={columns}
        dataSource={level}
      />
    </>
  );
};
export default () => {
  return <CustLevel />;
};
