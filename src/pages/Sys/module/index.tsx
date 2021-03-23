import ProCard from '@ant-design/pro-card';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delModule, queryModuleInfo, queryModules } from '@/services/Sys';
import DelPopconfirm from '@/components/DelPopconfirm';
import ModuleForm from './form';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [moduleOptions, setModuleOptions] = useState<SelectOptions>([]);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dep>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<API.Module>[] = [
    {
      title: '模块名称',
      dataIndex: 'modName',
      editable: false,
      width: 250,
      search: false,
    },
    {
      title: '备注',
      dataIndex: 'memo',
      search: false,
    },
    {
      title: '路由',
      dataIndex: 'Path',
      search: false,
    },
    {
      title: '组件',
      dataIndex: 'component',
      search: false,
    },
    {
      title: '图标',
      dataIndex: 'icon',
      search: false,
    },
    {
      title: '状态',
      search: false,
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () => {
        return {
          0: {
            text: '正常',
            status: 'Success',
          },
          1: {
            text: '禁用',
            status: 'Error',
          },
        };
      },
    },
    {
      title: '操作',
      width: 150,
      key: 'action',
      valueType: 'option',
      render: (_, entity) => {
        return [
          <Button
            type="link"
            key="editable"
            onClick={async () => {
              setPageLoading(true);
              setFormAction('upd');
              const module = (await queryModuleInfo(entity.modId)).data;
              setModalFormInit(module);
              setModalVisit(true);
              setPageLoading(false);
            }}
          >
            修改
          </Button>,
          <DelPopconfirm
            key="del"
            onConfirm={async () => {
              await delModule([entity.modId]);
            }}
          />,
        ];
      },
    },
  ];
  return (
    <>
      <ModuleForm
        moduleOptions={moduleOptions}
        action={formAction}
        visible={modalVisit}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
      <ProCard split="vertical">
        <ProTable<API.Module>
          bordered
          search={false}
          actionRef={actionRef}
          rowKey="modId"
          loading={pageLoading}
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
            defaultExpandedRowKeys: [13],
          }}
          postData={(dataSource) => {
            return dataSource.map((item) => ({
              ...item,
              State: String(item.State),
            }));
          }}
          request={async (params) => {
            const response = await queryModules({
              ...params,
              pageNumber: -1,
            });
            setModuleOptions(
              response.data.rows.map((item) => ({
                label: item.modName,
                value: item.modId as string,
              })),
            );
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
  );
};
