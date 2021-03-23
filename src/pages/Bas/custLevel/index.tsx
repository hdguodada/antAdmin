import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delCustLevel } from '@/services/Bas';
import LevelForm from './form';

const CustLevel: React.FC<{
  columns?: ProColumns<BAS.CustLevel>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const { queryCustLevel } = useModel('custLevel', (model) => ({
    queryCustLevel: model.queryCustLevel,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustLevel>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustLevel>[] = [
    {
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      title: '等级',
      dataIndex: 'levelName',
      search: false,
    },
    {
      title: '折扣',
      dataIndex: 'discount',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () => {
        return new Map([
          [1, { text: '正常', status: 'Success' }],
          [0, { text: '禁用', status: 'Error' }],
        ]);
      },
    },
  ];
  columns.push({
    title: '操作',
    key: 'action',
    valueType: 'option',
    render: (_, entity, _index, action) => {
      return [
        <a
          key="editable"
          onClick={() => {
            setFormAction('upd');
            setModalFormInit(entity);
            setModalVisit(true);
          }}
        >
          修改
        </a>,
        <DelPopconfirm
          key="del"
          onConfirm={async () => {
            await delCustLevel([entity.levelId]);
            action.reload();
          }}
        />,
      ];
    },
  });

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
        size="small"
        expandable={{
          defaultExpandAllRows: true,
        }}
        pagination={false}
        search={false}
        rowKey="levelId"
        actionRef={actionRef}
        bordered
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
        request={async () => {
          const response = await queryCustLevel({ pageNumber: -1 });
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
  return <CustLevel />;
};
