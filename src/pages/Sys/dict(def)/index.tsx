import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import {
  queryDicts,
  queryDictTypes,
  addDict,
  updDict,
  updDictType,
  delDictType,
  addDictType,
} from '@/services/Sys';
import DictForm from './DictForm';
import DictTypeForm from './DictTypeForm';

const DictDef: React.FC<{
  dictTypeId: API.DictType['dictTypeId'];
}> = (props) => {
  const { dictTypeId } = props;
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dict>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<API.Dict>[] = [
    {
      title: '字典名称',
      dataIndex: 'dictName',
    },
    {
      title: '字典描述',
      dataIndex: 'dictDesc',
    },
    {
      title: '枚举值',
      dataIndex: 'enumCode',
      hideInTable: true,
    },
    {
      title: '顺序号',
      dataIndex: 'sortNum',
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () => {
        return new Map([
          [
            1,
            {
              text: '正常',
              status: 'Success',
            },
          ],
          [
            0,
            {
              text: '禁用',
              status: 'Error',
            },
          ],
        ]);
      },
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
    <>
      <DictForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
      <ProTable<API.Dict, { dictTypeId: API.DictType['dictTypeId'] }>
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setFormAction('add');
              setModalFormInit({
                dictTypeId,
              });
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        bordered
        actionRef={actionRef}
        search={false}
        params={{ dictTypeId }}
        rowKey={(row) => `${row.dictId},${row.dictTypeId}`}
        editable={{
          onSave: async (_, row) => {
            if (row?.action === 'add') {
              await addDict({
                ...row,
                dictTypeId,
              });
              message.success('新增数据字典成功');
            } else {
              await updDict(row);
              message.success('修改数据字典成功');
            }
            actionRef?.current?.reload();
          },
        }}
        request={async (params) => {
          const response = await queryDicts({
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
          pageSize: 10,
        }}
        columns={columns}
      />
    </>
  );
};

const DictType: React.FC<{
  onChange: (id: API.DictType['dictTypeId']) => void;
  dictTypeId: API.DictType['dictTypeId'];
}> = (props) => {
  const actionRef = useRef<ActionType>();
  const ref = useRef<FormInstance>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.DictType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const { onChange, dictTypeId } = props;
  const [queryFilter, setQueryFilter] = useState({
    keyword: '',
  });
  const columns: ProColumnType<API.DictType>[] = [
    {
      title: '分类名称',
      dataIndex: 'dictTypeName',
    },
    {
      title: '枚举类型',
      dataIndex: 'enumType',
    },
    {
      title: '顺序号',
      dataIndex: 'sortNum',
      search: false,
      hideInTable: true,
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: () => {
        return new Map([
          [
            1,
            {
              text: '正常',
              status: 'Success',
            },
          ],
          [
            0,
            {
              text: '禁用',
              status: 'Error',
            },
          ],
        ]);
      },
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
    <>
      <DictTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
      />
      <ProTable<API.DictType>
        toolBarRender={() => [
          <Button
            type="primary"
            onClick={() => {
              setFormAction('add');
              setModalFormInit({
                dictTypeId,
              });
              setModalVisit(true);
            }}
          >
            <PlusOutlined />
            新建
          </Button>,
        ]}
        actionRef={actionRef}
        onRow={(record) => {
          return {
            onClick: () => {
              if (record.dictTypeId) {
                onChange(record.dictTypeId);
              }
            },
          };
        }}
        rowClassName={(record) => {
          return record.dictTypeId === dictTypeId ? 'split-row-select-active' : '';
        }}
        bordered
        search={false}
        params={queryFilter}
        rowKey="dictTypeId"
        toolbar={{
          search: {
            onSearch: (value) => {
              setQueryFilter({
                keyword: value,
              });
            },
          },
        }}
        editable={{
          onSave: async (_, row) => {
            if (row.action === 'add') {
              await addDictType(row);
            } else {
              await updDictType(row);
            }
            message.success('修改数据类型成功');
            actionRef?.current?.reload();
          },
          onDelete: async (key) => {
            await delDictType([key as number]);
            message.success('删除数据成功。');
            actionRef?.current?.reload();
          },
        }}
        request={async (params) => {
          const response = await queryDictTypes({
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
          pageSize: 10,
        }}
        columns={columns}
        formRef={ref}
        options={false}
      />
    </>
  );
};
export default (): React.ReactNode => {
  const [dictTypeId, setDictTypeId] = useState<API.DictType['dictTypeId']>(1);
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard colSpan={'40%'} ghost>
          <DictType
            onChange={(id) => {
              setDictTypeId(id);
            }}
            dictTypeId={dictTypeId}
          />
        </ProCard>
        <ProCard ghost>
          <DictDef dictTypeId={dictTypeId} />
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};
