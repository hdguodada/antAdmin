import React, { useEffect, useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { useModel } from 'umi';
import { Button, message, Space, Table } from 'antd';
import { delUser, queryUserInfo, queryUsers, resetPassword, updUser } from '@/services/Sys/user';
import { PlusOutlined } from '@ant-design/icons';
import { queryDepTreelist } from '@/services/Sys/dep';
import DelPopconfirm from '@/components/DelPopconfirm';
import UserForm from './form';

export type DepDataType = API.Dep;

type UserDataType = API.CurrentUser;

export type UserTableProps = {
  depId: number | string;
};

type DepTableProps = {
  depId: number | string;
  onChange: (depId: number | string) => void;
  columns: ProColumnType<DepDataType>[];
};
export const DepTable: React.FC<DepTableProps> = (props) => {
  const { depId, onChange, columns } = props;
  const [queryFilter, setQueryFilter] = useState({
    depName: '',
  });

  return (
    <ProTable<DepDataType>
      bordered
      expandable={{
        defaultExpandedRowKeys: [1],
      }}
      params={queryFilter}
      rowKey="depId"
      rowClassName={(record) => {
        return record.depId === depId ? styles['split-row-select-active'] : '';
      }}
      columns={columns}
      toolbar={{
        search: {
          onSearch: (value) => {
            setQueryFilter({
              depName: value,
            });
          },
        },
      }}
      options={false}
      search={false}
      onRow={(record) => {
        return {
          onClick: () => {
            if (record.depId) {
              onChange(record.depId);
            }
          },
        };
      }}
      request={async (params = {}) => {
        const response = await queryDepTreelist({
          depName: params.depName,
        });
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
      pagination={false}
    />
  );
};

export const UserTable: React.FC<UserTableProps> = (props) => {
  const { depId } = props;
  const { queryDepList } = useModel('dep');
  const { queryOptions } = useModel('options', (model) => ({
    userTypeOptions: model.typeOption('UserType'),
    queryOptions: model.queryOptions,
  }));
  const { queryRoles } = useModel('userRole', (model) => ({
    roles: model.userRoleOptions,
    queryRoles: model.queryUserRoles,
  }));
  const actionRef = useRef<ActionType>();
  useEffect(() => {
    queryDepList({ pageNumber: -1 });
    queryOptions();
    queryRoles({ pageNumber: -1 });
  }, [queryDepList, queryOptions, queryRoles]);
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.CurrentUser>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const userColumns: ProColumnType<UserDataType>[] = [
    {
      title: '姓名',
      dataIndex: 'realName',
      ellipsis: true,
      copyable: true,
      fixed: 'left',
      render: (_) => <a>{_}</a>,
    },
    {
      title: '手机号码',
      dataIndex: 'mobile',
      search: false,
    },
    {
      title: '用户角色',
      dataIndex: 'userTypeName',
      search: false,
      editable: false,
    },
    {
      title: '部门名称',
      dataIndex: 'depName',
      search: false,
      editable: false,
    },
    {
      title: '上次登录',
      dataIndex: 'lastLogin',
      valueType: 'date',
      search: false,
      editable: false,
    },
    {
      title: '登录次数',
      dataIndex: 'loginCnt',
      search: false,
      editable: false,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      initialValue: 1,
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
      width: 200,
      render: (_, entity) => {
        return [
          <a
            key="edit"
            onClick={async () => {
              setFormAction('upd');
              const user = (await queryUserInfo(entity.userId)).data;
              setModalFormInit(user);
              setModalVisit(true);
            }}
          >
            修改
          </a>,
          <DelPopconfirm
            key="del"
            onConfirm={async () => {
              await delUser([entity.userId]);
              actionRef?.current?.reload();
            }}
          />,
          <a
            type="text"
            key="resetPassword"
            className="error-color"
            onClick={async () => {
              const res = await resetPassword();
              message.success(res.msg);
            }}
          >
            重置密码
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      <ProTable<API.CurrentUser, { depId: number | string }>
        bordered
        actionRef={actionRef}
        params={{ depId }}
        rowKey="userId"
        rowSelection={{
          selections: [Table.SELECTION_ALL, Table.SELECTION_INVERT],
        }}
        tableAlertOptionRender={() => {
          return (
            <Space size={16}>
              <a>批量删除</a>
              <a>导出数据</a>
            </Space>
          );
        }}
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
        editable={{
          onDelete: async (key) => {
            await delUser([key]);
            message.success('删除数据成功。');
          },
          onSave: async (_, row) => {
            await updUser(row);
            message.success('修改数据成功。');
          },
        }}
        request={async (params) => {
          const response = await queryUsers({
            ...params,
            pageNumber: params.current,
          });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        pagination={{
          pageSize: 5,
        }}
        columns={userColumns}
      />
      <UserForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
    </>
  );
};

export default (): React.ReactNode => {
  const [depId, setdepId] = useState<string | number>(0);
  const depColumns = [
    {
      title: 'depId',
      dataIndex: 'depId',
      hideInTable: true,
    },
    {
      title: '部门名称',
      dataIndex: 'depName',
    },
    {
      title: '负责人',
      dataIndex: 'leader',
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard colSpan="384px" ghost>
          <div style={{ height: 88 }}></div>
          <DepTable
            columns={depColumns}
            onChange={(id) => {
              setdepId(id);
            }}
            depId={depId}
          />
        </ProCard>
        <ProCard ghost>
          <UserTable depId={depId} />
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};
