import React, { useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import styles from './index.less';
import { ModalForm, ProFormText } from '@ant-design/pro-form';
import { request } from 'umi';
import { Button, message } from 'antd';
import { delUser, queryUsers, updUser } from '@/services/user';
import { PlusOutlined } from '@ant-design/icons';

type DepDataType = {
  DepName: string;
  Leader: string;
  DepId: number;
};

type UserDataType = API.CurrentUser;

type UserTableProps = {
  DepId: number;
};

type DepTableProps = {
  DepId: number;
  onChange: (DepId: number) => void;
};

const Form = () => {
  return (
    <ModalForm<{ name: string; company: string }>
      key="ModelForm"
      title="修改用户"
      trigger={
        <Button type="primary">
          <PlusOutlined />
          新建
        </Button>
      }
      modalProps={{
        onCancel: () => {},
      }}
      onFinish={async (values) => {
        message.success(values);
        return true;
      }}
    >
      <ProFormText width="md" name="UserName" label="账号名称" />
      <ProFormText width="md" name="Mobile" label="手机号码" />
      <ProFormText width="md" name="Email" label="邮箱" />
      <ProFormText width="md" name="RealName" label="真实姓名" />
    </ModalForm>
  );
};
const DepTable: React.FC<DepTableProps> = (props) => {
  const { DepId, onChange } = props;
  const [queryFilter, setQueryFilter] = useState({
    DepName: '',
  });
  const columns: ProColumnType<DepDataType>[] = [
    {
      title: 'DepId',
      dataIndex: 'DepId',
      hideInTable: true,
    },
    {
      title: '部门名称',
      dataIndex: 'DepName',
    },
    {
      title: '负责人',
      dataIndex: 'DepName',
    },
  ];
  return (
    <ProTable<DepDataType>
      expandable={{
        defaultExpandedRowKeys: [1],
      }}
      params={queryFilter}
      rowKey="DepId"
      rowClassName={(record) => {
        return record.DepId === DepId ? styles['split-row-select-active'] : '';
      }}
      columns={columns}
      toolbar={{
        search: {
          onSearch: (value) => {
            setQueryFilter({
              DepName: value,
            });
          },
        },
      }}
      options={false}
      search={false}
      onRow={(record) => {
        return {
          onClick: () => {
            if (record.DepId) {
              onChange(record.DepId);
            }
          },
        };
      }}
      request={async (params = {}) => {
        const response = await request('/sys/dep/treelist', {
          method: 'POST',
          data: {
            DepName: params.DepName,
          },
        });
        return {
          data: response.data.rows,
          success: response.msg,
          total: response.data.total,
        };
      }}
      pagination={false}
    />
  );
};

const UserTable: React.FC<UserTableProps> = (props) => {
  const { DepId } = props;
  const columns: ProColumnType<UserDataType>[] = [
    {
      title: '关键字',
      hideInTable: true,
      dataIndex: 'keyword',
    },
    {
      title: '姓名',
      dataIndex: 'RealName',
      ellipsis: true,
      copyable: true,
    },
    {
      title: '手机号码',
      dataIndex: 'Mobile',
    },
    {
      title: '用户类型',
      dataIndex: 'UserTypeName',
      editable: false,
    },
    {
      title: '部门名称',
      dataIndex: 'DepName',
      search: false,
      editable: false,
    },
    {
      title: '上次登录',
      dataIndex: 'LastLogin',
      valueType: 'date',
      search: false,
      editable: false,
    },
    {
      title: '登录次数',
      dataIndex: 'LoginCnt',
      search: false,
      editable: false,
    },
    {
      title: '状态',
      dataIndex: 'State',
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
      key: 'action',
      valueType: 'option',
      render: (_, entity, _index, action) => {
        return [
          <a
            key="editable"
            onClick={() => {
              action.startEditable?.(entity.UserId);
            }}
          >
            编辑
          </a>,
        ];
      },
    },
  ];
  return (
    <ProTable<API.CurrentUser, { DepId: number }>
      params={{ DepId }}
      rowKey="UserId"
      toolBarRender={() => [<Form />]}
      editable={{
        onDelete: async (key) => {
          await delUser([key]).catch;
          message.success('删除数据成功。');
        },
        onSave: async (_, row) => {
          await updUser(row);
          message.success('修改数据成功。');
        },
      }}
      request={async (params) => {
        const response = await queryUsers({
          pageSize: params.pageSize,
          pageNumber: params.current,
          DepId: params.DepId,
        });
        return {
          data: response.data.rows,
          success: response.msg === 'success',
          total: response.data.total,
        };
      }}
      pagination={{
        pageSize: 5,
      }}
      columns={columns}
    />
  );
};

export default (): React.ReactNode => {
  const [DepId, setDepId] = useState(0);
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard colSpan="384px" ghost>
          <DepTable
            onChange={(depId) => {
              setDepId(depId);
            }}
            DepId={DepId}
          />
        </ProCard>
        <ProCard>
          <UserTable DepId={DepId} />
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};
