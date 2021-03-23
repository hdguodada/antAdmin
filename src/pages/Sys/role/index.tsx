import { delRole, queryRoleInfo, queryRoleList, updRole } from '@/services/Sys/role';
import { FormOutlined } from '@ant-design/icons';
import ProCard from '@ant-design/pro-card';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, message } from 'antd';
import React, { useRef, useState, useEffect } from 'react';
import RoleForm from './form';
import styles from '@/pages/Sys/user/index.less';

export type RoleDataType = API.UserRole;

export default (): React.ReactNode => {
  const actionRef = useRef<ActionType>();
  const [roleId, setRoleId] = useState(1);
  const [modalFormInit, setModalFormInit] = useState<API.UserRole | undefined>();

  useEffect(() => {
    queryRoleInfo(roleId).then((res) => {
      setModalFormInit(res.data);
    });
  }, [roleId]);
  const columns: ProColumnType<RoleDataType>[] = [
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
    },
    {
      title: '角色描述',
      dataIndex: 'roleDesc',
      search: false,
      hideInTable: true,
    },
    {
      title: '顺序',
      dataIndex: 'sortNum',
      search: false,
      hideInTable: true,
    },
    {
      title: '状态',
      hideInTable: true,
      dataIndex: 'state',
      valueType: 'select',
      search: false,
      valueEnum: () =>
        new Map([
          [1, { text: '正常', status: 'Success' }],
          [0, { text: '禁用', status: 'Error' }],
        ]),
    },
    {
      width: 150,
      title: '操作',
      key: 'action',
      valueType: 'option',
      render: (_, entity, _index, action) => {
        return [
          <Button
            key="edit"
            type="link"
            onClick={() => {
              action.startEditable?.(entity.roleId);
            }}
          >
            <FormOutlined />
            修改
          </Button>,
        ];
      },
    },
  ];
  return (
    <>
      <ProCard split="vertical">
        <ProCard colSpan="384px">
          <ProTable<RoleDataType>
            rowClassName={(record) => {
              return record.roleId === roleId ? styles['split-row-select-active'] : '';
            }}
            onRow={(record) => {
              return {
                onClick: async () => {
                  if (record.roleId) {
                    setRoleId(record.roleId as number);
                  }
                },
              };
            }}
            search={false}
            options={false}
            actionRef={actionRef}
            editable={{
              onDelete: async (key) => {
                await delRole([key as string]);
                message.success('删除数据成功。');
              },
              onSave: async (_, row) => {
                await updRole(row);
                message.success('修改数据成功。');
              },
            }}
            bordered
            rowKey="roleId"
            columns={columns}
            request={async (params) => {
              const response = await queryRoleList({
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
          />
        </ProCard>
        <ProCard ghost>
          {modalFormInit ? (
            <RoleForm
              initialValues={modalFormInit}
              setRoleId={(id: number) => {
                queryRoleInfo(id).then((res) => {
                  setModalFormInit(res.data);
                });
              }}
            />
          ) : (
            <></>
          )}
        </ProCard>
      </ProCard>
    </>
  );
};
