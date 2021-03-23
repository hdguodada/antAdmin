import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { queryFuns } from '@/services/Sys';
import FunForm from './form';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dict>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<API.Fun>[] = [
    {
      title: '序号',
      dataIndex: 'index',
      valueType: 'index',
      width: 50,
    },
    {
      title: '操作名称',
      dataIndex: 'funName',
    },
    {
      title: '操作描述',
      dataIndex: 'funDesc',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () =>
        new Map([
          [1, { text: '正常', status: 'Success' }],
          [0, { text: '禁用', status: 'Error' }],
        ]),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, entity) => {
        return [
          <a
            key="edit"
            onClickCapture={async () => {
              setFormAction('upd');
              setModalFormInit(entity);
              setModalVisit(true);
            }}
          >
            修改
          </a>,
        ];
      },
    },
  ];
  return (
    <PageHeaderWrapper>
      <FunForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
      <ProCard split="vertical">
        <EditableProTable<API.Fun>
          actionRef={actionRef}
          recordCreatorProps={false}
          search={false}
          bordered
          rowKey="funId"
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
          editable={{}}
          request={async (params) => {
            const response = await queryFuns({
              ...params,
              pageNumber: -1,
            });
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={false}
          columns={columns}
        />
      </ProCard>
    </PageHeaderWrapper>
  );
};
