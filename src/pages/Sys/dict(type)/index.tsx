import ProCard from '@ant-design/pro-card';
import { PageHeaderWrapper } from '@ant-design/pro-layout';
import React, { useRef, useState } from 'react';
import type { ProColumnType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import { history } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import { queryDictTypes } from '@/services/Sys';

export default (): React.ReactNode => {
  const ref = useRef<FormInstance>();
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
  ];
  return (
    <PageHeaderWrapper>
      <ProCard split="vertical">
        <ProCard colSpan={'440px'} ghost>
          <ProTable<API.DictType>
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
            toolBarRender={() => [
              <Button
                type="primary"
                onClick={() => {
                  history.push('/sys/user/new');
                }}
              >
                <PlusOutlined />
                新建
              </Button>,
            ]}
            editable={{}}
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
        </ProCard>
      </ProCard>
    </PageHeaderWrapper>
  );
};
