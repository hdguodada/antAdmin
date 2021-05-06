import ProCard from '@ant-design/pro-card';
import { PageContainer } from '@ant-design/pro-layout';
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
  delDict,
} from '@/services/Sys';
import DictForm from './DictForm';
import DictTypeForm from './DictTypeForm';
import { indexColumns, optionColumns, stateColumns } from '@/utils/columns';
import Style from '@/global.less';

const DictDef: React.FC<{
  dictTypeId: API.DictType['dictTypeId'];
}> = (props) => {
  const { dictTypeId } = props;
  const actionRef = useRef<ActionType>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<API.Dict>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const columns: ProColumnType<API.Dict>[] = [
    indexColumns,
    {
      title: '字典名称',
      dataIndex: 'dictName',
      render: (_, record) => (
        <div>
          {record.dictName} <span className={Style['error-color']}>({record.dictId})</span>
        </div>
      ),
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
    stateColumns,
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delDict([{ dictId: record.dictId, dictTypeId: record.dictTypeId }]);
      },
    }),
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
      {dictTypeId > 0 && (
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
          options={false}
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
            const response = await queryDicts(params);
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
      )}
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
    indexColumns,
    {
      title: '分类名称',
      dataIndex: 'dictTypeName',
    },
    {
      title: '枚举类型',
      dataIndex: 'enumType',
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
    optionColumns({
      modify: async ({ record }) => {
        setFormAction('upd');
        setModalFormInit(record);
        setModalVisit(true);
      },
      del: async ({ record }) => {
        await delDictType([record.dictTypeId]);
      },
    }),
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
            onDoubleClick: () => {
              if (record.dictTypeId) {
                onChange(record.dictTypeId);
              }
            },
          };
        }}
        rowClassName={(record) => {
          return record.dictTypeId === dictTypeId ? 'split-row-select-active' : '';
        }}
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
            queryFilter: params,
          });
          onChange(response.data.rows[0].dictTypeId);
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
  const [dictTypeId, setDictTypeId] = useState<React.Key>(-1);
  return (
    <PageContainer
      content={
        <ProCard split="vertical">
          <ProCard colSpan={'40%'}>
            <DictType
              onChange={(id) => {
                setDictTypeId(id);
              }}
              dictTypeId={dictTypeId}
            />
          </ProCard>
          <ProCard>
            <DictDef dictTypeId={dictTypeId} />
          </ProCard>
        </ProCard>
      }
    />
  );
};
