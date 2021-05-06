import React, { useRef, useState } from 'react';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import type { ActionType, ProColumns, ProColumnType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import ProCard from '@ant-design/pro-card';
import { message } from 'antd';
import EmployForm from './form';
import {
  addPost,
  delEmploy,
  queryEmploy,
  queryEmployInfo,
  queryPost,
  updPost,
} from '@/services/Bas';
import {
  baseSearch,
  indexColumns,
  optionColumns,
  stateColumns,
  tableAlertOptionRenderDom,
} from '@/utils/columns';
import BatchDel from '@/components/DelPopconfirm';

export type UserTableProps = {
  postId: React.Key;
};

type PostTableProps = {
  postId: React.Key;
  onChange: (postId: React.Key) => void;
  columns: ProColumnType<BAS.Post>[];
};
export const PostTable: React.FC<PostTableProps> = (props) => {
  const { postId, onChange, columns } = props;
  const [queryFilter, setQueryFilter] = useState({
    postName: '',
  });
  const actionRef = useRef<ActionType>();
  return (
    <EditableProTable<BAS.Post>
      expandable={{
        defaultExpandedRowKeys: [1],
      }}
      bordered
      actionRef={actionRef}
      params={queryFilter}
      rowKey="postId"
      rowClassName={(record) => {
        return record.postId === postId ? 'split-row-select-active' : '';
      }}
      recordCreatorProps={{
        record: {
          postId: -1,
          postName: '',
        },
      }}
      columns={columns}
      toolbar={{
        search: {
          onSearch: (value) => {
            setQueryFilter({
              postName: value,
            });
          },
        },
      }}
      onRow={(record) => {
        return {
          onDoubleClick: () => {
            if (record.postId) {
              onChange(record.postId);
            }
          },
        };
      }}
      request={async (params) => {
        const response = await queryPost({
          queryFilter: {
            postName: params.postName,
          },
        });
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
      editable={{
        type: 'single',
        onSave: async (_key, row) => {
          if (row.postId === -1) {
            await addPost(row);
          } else {
            await updPost(row);
          }
          message.success('保存成功');
          actionRef?.current?.reload();
        },
      }}
    />
  );
};

export const EmployTable: React.FC<UserTableProps> = (props) => {
  const { postId } = props;
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<BAS.Employ>();
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const EmployColumns: ProColumnType<BAS.Employ>[] = [
    indexColumns,
    {
      title: '员工姓名',
      dataIndex: 'empName',
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
      title: '职位',
      dataIndex: 'postName',
      search: false,
      editable: false,
    },
    {
      title: '部门名称',
      dataIndex: 'depName',
      search: false,
      editable: false,
    },
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        const empoly = (await queryEmployInfo(record.empId)).data;
        setModalFormInit(empoly);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delEmploy([record.empId]);
        actionRef?.current?.reload();
      },
    }),
  ];
  return (
    <>
      <ProTable<BAS.Employ, { postId: React.Key }>
        actionRef={actionRef}
        params={{ postId }}
        rowKey="empId"
        search={baseSearch({
          fn: () => {
            setFormAction('add');
            setModalFormInit(undefined);
            setModalVisit(true);
          },
        })}
        options={false}
        request={async (params) => {
          const response = await queryEmploy({
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
        rowSelection={{}}
        tableAlertOptionRender={({ selectedRowKeys }) => {
          return tableAlertOptionRenderDom([
            <BatchDel
              key="del"
              onConfirm={async () => {
                await delEmploy(selectedRowKeys);
                actionRef.current?.reload();
              }}
            />,
          ]);
        }}
        columns={EmployColumns}
      />
      <EmployForm
        initialValues={modalFormInit}
        action={formAction}
        visible={modalVisit}
        setVisible={setModalVisit}
        actionRef={actionRef}
      />
    </>
  );
};

export default () => {
  const [postId, setPostId] = useState<React.Key>(0);
  const postColumns: ProColumns<BAS.Post>[] = [
    {
      title: 'postId',
      dataIndex: 'postId',
      hideInTable: true,
    },
    {
      title: '职位',
      dataIndex: 'postName',
    },
    {
      title: '操作',
      valueType: 'option',
      width: 150,
      render: (text, record, _, action) => [
        <a
          key="editable"
          onClick={() => {
            action.startEditable?.(record.postId);
          }}
        >
          编辑
        </a>,
        <a key="delete" onClick={() => {}}>
          删除
        </a>,
      ],
    },
  ];
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard colSpan="384px">
          <PostTable
            columns={postColumns}
            onChange={(id) => {
              setPostId(id);
            }}
            postId={postId}
          />
        </ProCard>
        <ProCard>
          <EmployTable postId={postId} />
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};
