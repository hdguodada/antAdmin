import ProCard from '@ant-design/pro-card';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { delModule, queryModuleInfo, queryModules } from '@/services/Sys';
import ModuleForm from './form';
import { transformTreeData } from '@/utils/utils';
import { memoColumns, optionColumns, stateColumns } from '@/utils/columns';
import { PageContainer } from '@ant-design/pro-layout';

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [pageLoading, setPageLoading] = useState(false);
  const [moduleOptions, setModuleOptions] = useState<any[]>([]);
  const [modalFormInit, setModalFormInit] = useState<Partial<SYS.Dep>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<SYS.Module>[] = [
    {
      title: 'id',
      dataIndex: 'modId',
      width: 80,
      align: 'center',
      fixed: 'left',
    },
    {
      title: '模块名称',
      dataIndex: 'modName',
      editable: false,
      width: '60%',
      search: false,
    },
    memoColumns(),
    // {
    //   title: '路由',
    //   dataIndex: 'path',
    //   search: false,
    // },
    // {
    //   title: '组件',
    //   dataIndex: 'component',
    //   search: false,
    // },
    // {
    //   title: '图标',
    //   dataIndex: 'icon',
    //   search: false,
    // },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setPageLoading(true);
        setFormAction('upd');
        const module = (await queryModuleInfo(record.modId)).data;
        setModalFormInit(module);
        setModalVisit(true);
        setPageLoading(false);
      },
      del: async ({ record }) => {
        await delModule([record.modId]);
      },
    }),
  ];
  return (
    <PageContainer
      content={
        <>
          <ModuleForm
            moduleOptions={moduleOptions}
            action={formAction}
            visible={modalVisit}
            setVisible={setModalVisit}
            initialValues={modalFormInit}
            actionRef={actionRef}
          />
          <ProCard split="vertical">
            <ProTable<SYS.Module>
              search={false}
              actionRef={actionRef}
              rowKey="modId"
              options={false}
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
                defaultExpandAllRows: true,
              }}
              request={async (params) => {
                const response = await queryModules({
                  ...params,
                  pageNumber: -1,
                });
                setModuleOptions(transformTreeData(response.data.rows, '', 'modId', 'memo'));
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
