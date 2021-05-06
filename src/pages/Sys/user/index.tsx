import React, { useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { message } from 'antd';
import { delUser, queryUsers, resetPassword, updUser } from '@/services/Sys/user';
import { queryDepTreelist } from '@/services/Sys/dep';
import UserForm from './form';
import { baseSearch, indexColumns, optionColumns, stateColumns } from '@/utils/columns';

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
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.CurrentUser>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const userColumns: ProColumnType<UserDataType>[] = [
    indexColumns,
    {
      title: '账号',
      dataIndex: 'userName',
      search: false,
    },
    {
      title: '姓名',
      dataIndex: 'realName',
      ellipsis: true,
      copyable: true,
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
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delUser([record.userId]);
      },
      width: 150,
      jsxList: [
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
      ],
    }),
  ];
  return (
    <>
      <ProTable<API.CurrentUser, { depId: number | string }>
        actionRef={actionRef}
        params={{ depId }}
        rowKey="userId"
        options={false}
        search={baseSearch({
          fn: () => {
            setFormAction('add');
            setModalFormInit({});
            setModalVisit(true);
          },
        })}
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
            queryFilter: params,
          });
          return {
            data: response.data.rows,
            success: response.code === 0,
            total: response.data.total,
          };
        }}
        pagination={{
          pageSize: 10,
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
    <PageContainer
      content={
        <ProCard split="vertical">
          <ProCard colSpan="384px">
            <div style={{ height: 25 }} />
            <DepTable
              columns={depColumns}
              onChange={(id) => {
                setdepId(id);
              }}
              depId={depId}
            />
          </ProCard>
          <ProCard>
            <UserTable depId={depId} />
          </ProCard>
        </ProCard>
      }
    />
  );
};
