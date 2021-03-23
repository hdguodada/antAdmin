import {
  addCustomerRel,
  delCustomerRel,
  queryCustomerInfo,
  queryCustomerRel,
  updCustomerRel,
} from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import React, { useEffect, useRef, useState } from 'react';
import { useModel, useParams } from 'umi';
import { PageLoading } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { EditableProTable } from '@ant-design/pro-table';
import { message } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import CustRecord from './custRecord';
import CustDoc from './custDoc';
import ProDescriptions from '@ant-design/pro-descriptions';

export default (): React.ReactNode => {
  const { id } = useParams<{ id: string }>();
  const [loading, setLoading] = useState<boolean>(true);
  const [detail, setDetail] = useState<BAS.Customer>();
  const custRelActionRef = useRef<ActionType>();
  const columns: ProColumns<BAS.CustRel>[] = [
    {
      dataIndex: 'index',
      valueType: 'indexBorder',
    },
    {
      dataIndex: 'relName',
      title: '姓名',
      render: (_) => <a>{_}</a>,
    },
    {
      dataIndex: 'job',
      title: '职位',
      search: false,
    },
    {
      dataIndex: 'sex',
      title: '性别',
      search: false,
      valueType: 'select',
      valueEnum: () =>
        new Map([
          [0, { text: '男', status: 'Default' }],
          [1, { text: '女', status: 'Warning' }],
        ]),
    },
    {
      dataIndex: 'birthday',
      title: '出生日期',
      search: false,
      valueType: 'date',
    },
    {
      dataIndex: 'relMobile',
      title: '手机',
      search: false,
      copyable: true,
    },
    {
      dataIndex: 'relEmail',
      title: '邮箱',
      search: false,
      copyable: true,
    },
    {
      dataIndex: 'relWeiXin',
      title: '微信',
      search: false,
      copyable: true,
    },
    {
      dataIndex: 'relMemo',
      title: '备注',
      search: false,
    },
  ];
  columns.push({
    key: 'action',
    valueType: 'option',
    width: 75,
    align: 'center',
    render: (_, entity, _index, action) => {
      return [
        <EllipsisOutlined
          onClick={() => {
            action.startEditable(entity.relId);
          }}
        />,
      ];
    },
  });
  const { queryOptions } = useModel('options', (model) => ({ queryOptions: model.queryOptions }));
  useEffect(() => {
    queryOptions();
  }, [queryOptions]);
  useEffect(() => {
    queryCustomerInfo(id).then((res) => {
      setLoading(false);
      setDetail(res.data);
    });
  }, [id]);
  return (
    <PageContainer title={detail?.custName}>
      {loading ? (
        <PageLoading />
      ) : (
        <ProCard split="vertical" ghost>
          <ProCard colSpan={18} direction="column">
            <PageContainer
              title={false}
              tabList={[
                {
                  tab: '行动记录',
                  key: 'record',
                  children: <ProCard>{detail ? <CustRecord customer={detail} /> : ''}</ProCard>,
                },
                {
                  tab: '客户联系人',
                  key: 'rel',
                  children: (
                    <ProCard>
                      <EditableProTable<BAS.CustRel>
                        bordered
                        rowKey="relId"
                        actionRef={custRelActionRef}
                        columns={columns}
                        params={{ custId: id }}
                        recordCreatorProps={{
                          record: {
                            relId: (Math.random() * 1000000).toFixed(0),
                            action: 'add',
                          } as BAS.CustRel,
                        }}
                        editable={{
                          onSave: async (key, values) => {
                            if (values.action === 'add') {
                              await addCustomerRel({
                                ...values,
                                custId: id,
                              });
                              message.success('新增联系人成功');
                            } else {
                              await updCustomerRel(values);
                              message.success('修改成功');
                            }
                            custRelActionRef?.current?.reload();
                          },
                          onDelete: async (key, values) => {
                            await delCustomerRel([key as number]);
                            message.success(`删除${values.relName}成功`);
                            custRelActionRef?.current?.reload();
                          },
                        }}
                        request={async (params) => {
                          const response = await queryCustomerRel({
                            ...params,
                            pageNumber: -1,
                            queryFilter: {
                              ...params,
                            },
                          });
                          return {
                            data: response.data.rows,
                            success: response.code === 0,
                            total: response.data.total,
                          };
                        }}
                      ></EditableProTable>
                    </ProCard>
                  ),
                },
                {
                  tab: '客户附件',
                  key: 'doc',
                  children: <ProCard>{detail ? <CustDoc customer={detail} /> : ''}</ProCard>,
                },
              ]}
              tabProps={{
                defaultActiveKey: 'doc',
              }}
            ></PageContainer>
          </ProCard>
          <ProCard title="基本信息" colSpan={6}>
            <ProDescriptions
              bordered
              dataSource={detail}
              column={1}
              columns={[
                { title: '客户编号', dataIndex: 'custCd', editable: false },
                {
                  title: '客户名称',
                  dataIndex: 'custName',
                },
                { title: '等级', dataIndex: 'custLevelId', valueType: 'select' },
                { title: '类型', dataIndex: 'custTypeName' },
                { title: '标签', dataIndex: 'custTags' },
                { title: '所属部门', dataIndex: 'depName' },
                { title: '持有人', dataIndex: 'salesman' },
                { title: '区域', dataIndex: 'custAreaName' },
                { title: '电话', dataIndex: 'tel' },
                { title: '传真', dataIndex: 'fax' },
                { title: '详细地址', dataIndex: 'address' },
                { title: '邮编', dataIndex: 'zipCode' },
                { title: '网址', dataIndex: 'wWW' },
                { title: '邮箱', dataIndex: 'email' },
                { title: '简介', dataIndex: 'intro' },
              ]}
            />
          </ProCard>
        </ProCard>
      )}
    </PageContainer>
  );
};
