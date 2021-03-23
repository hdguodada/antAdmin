import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { useModel } from 'umi';
import DelPopconfirm from '@/components/DelPopconfirm';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delCustArea } from '@/services/Bas';
import CustAreaForm from './form';

const CustLevel: React.FC<{
  columns?: ProColumns<BAS.CustArea>[];
}> = () => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustArea>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumns<BAS.CustArea>[] = [
    {
      title: '区域名称',
      dataIndex: 'areaName',
      search: false,
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
            await delCustArea([entity.areaId]);
            action.reload();
          }}
        />,
      ];
    },
  });
  const { queryCustAreaTree, queryCustArea } = useModel('custArea', (model) => ({
    queryCustAreaTree: model.queryCustAreaTree,
    queryCustArea: model.queryCustArea,
  }));
  return (
    <>
      <CustAreaForm
        setVisible={setModalVisit}
        visible={modalVisit}
        initialValues={modalFormInit}
        action={formAction}
        actionRef={actionRef}
      />
      <ProTable<BAS.CustArea>
        size="small"
        expandable={{
          defaultExpandAllRows: true,
        }}
        pagination={false}
        search={false}
        rowKey="areaId"
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
          queryCustArea({ pageNumber: -1 });
          const response = await queryCustAreaTree({ id: 1 });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        postData={(datas) => {
          return datas[0].children;
        }}
      />
    </>
  );
};
export default () => {
  return <CustLevel />;
};
