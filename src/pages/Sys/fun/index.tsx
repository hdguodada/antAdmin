import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delFuns, queryFuns } from '@/services/Sys';
import FunForm from './form';
import { indexColumns, optionColumns, stateColumns } from '@/utils/columns';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dict>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<API.Fun>[] = [
    indexColumns,
    {
      title: '操作名称',
      dataIndex: 'funName',
    },
    {
      title: '操作描述',
      dataIndex: 'funDesc',
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
        await delFuns([record.funId]);
      },
    }),
  ];
  return (
    <PageContainer
      content={
        <>
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
              bordered
              recordCreatorProps={false}
              search={false}
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
        </>
      }
    />
  );
};
