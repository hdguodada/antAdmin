import { delRole, queryRoleInfo } from '@/services/Sys/role';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import RoleForm from './form';
import RoleGlobalForm from './roleForm';
import styles from '@/pages/Sys/user/index.less';
import { indexColumns, optionColumns, refreshAndNew, stateColumns } from '@/utils/columns';
import { PageContainer } from '@ant-design/pro-layout';
import { useRequest, useModel } from 'umi';

export type RoleDataType = API.UserRole;

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [roleId, setRoleId] = useState(1);
  const [modalFormInit, setModalFormInit] = useState<API.UserRole | undefined>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const [modalVisit, setModalVisit] = useState(false);
  const { userRoleList, queryUserRoles } = useModel('userRole', (model) => ({
    userRoleList: model.userRoleList,
    queryUserRoles: model.queryUserRoles,
  }));
  const { data, run } = useRequest(() => queryRoleInfo(roleId), { manual: true });
  useEffect(() => {
    run();
  }, [roleId]);
  const columns: ProColumnType<RoleDataType>[] = [
    indexColumns,
    {
      title: 'roleId',
      dataIndex: 'roleId',
      hideInTable: true,
      search: false,
    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
      render: (_) => <a>{_}</a>,
      search: false,
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      search: false,
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        const role = (await queryRoleInfo(record.roleId)).data;
        setModalFormInit(role);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delRole([record.roleId]);
      },
    }),
  ];
  return (
    <PageContainer
      content={
        <>
          <RoleGlobalForm
            action={formAction}
            visible={modalVisit}
            actionRef={actionRef}
            setVisible={setModalVisit}
            initialValues={modalFormInit as API.UserRole}
          />
          <ProCard split="vertical">
            <ProCard colSpan="700px">
              <ProTable<RoleDataType>
                pagination={false}
                search={false}
                toolBarRender={() =>
                  refreshAndNew({
                    fn: async () => {
                      setFormAction('add');
                      setModalFormInit(undefined);
                      setModalVisit(true);
                    },
                    refresh: queryUserRoles,
                  })
                }
                rowClassName={(record) => {
                  return record.roleId === roleId ? styles['split-row-select-active'] : '';
                }}
                options={false}
                onRow={(record) => {
                  return {
                    onDoubleClick: async () => {
                      if (record.roleId) {
                        setRoleId(record.roleId as number);
                      }
                    },
                  };
                }}
                actionRef={actionRef}
                rowKey="roleId"
                columns={columns}
                dataSource={userRoleList}
              />
            </ProCard>
            <ProCard>{data ? <RoleForm initialValues={data} setRoleId={run} /> : ''}</ProCard>
          </ProCard>
        </>
      }
    />
  );
};
