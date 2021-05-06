import {
  addCustomerRel,
  delCustomerRel,
  queryCustomerInfo,
  queryCustomerRel,
  updCustomerRel,
  queryCustomerFinanceInfo,
} from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import { useModel, useParams } from 'umi';
import ProCard from '@ant-design/pro-card';
import { Divider } from 'antd';
import { EllipsisOutlined } from '@ant-design/icons';
import CustRecord from './custRecord';
import CustDoc from './custDoc';
import ProDescriptions from '@ant-design/pro-descriptions';
import EditFilledForm from './updForm';
import { indexColumns } from '@/utils/columns';
import { useRequest } from 'umi';
import CustomerFinanceForm from './custFinanceForm';

export const relColumns: ProColumns<BAS.Rel>[] = [
  indexColumns,

  {
    dataIndex: 'relName',
    title: '联系人',
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
  {
    dataIndex: 'isMain',
    title: '首要联系人',
    search: false,
    width: 80,
    valueType: 'select',
    valueEnum: new Map([
      [0, '否'],
      [1, '是'],
    ]),
  },
  {
    key: 'action',
    valueType: 'option',
    width: 150,
    align: 'center',
    title: '操作',
    render: (_, entity, _index, action) => {
      return [
        <EllipsisOutlined
          key={'edit'}
          onClick={() => {
            action.startEditable(entity.relId);
          }}
        />,
      ];
    },
  },
];
export default (): React.ReactNode => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<BAS.Customer>();
  const custRelActionRef = useRef<ActionType>();
  const { data, loading, refresh } = useRequest(async () => {
    const customerRel = await queryCustomerRel({
      pageNumber: -1,
      queryFilter: {
        custId: id,
      },
    });
    const customerInfo = await queryCustomerInfo(id);
    setDetail(customerInfo.data);
    const finance = await queryCustomerFinanceInfo(id);
    return {
      data: {
        customerInfo: customerInfo.data,
        customerRel: customerRel.data.rows,
        finance: finance.data,
      },
      success: customerInfo.code === 0,
    };
  });
  const { valueEnum } = useModel('options', (model) => ({
    valueEnum: model.valueEnum,
  }));
  return (
    <PageContainer
      loading={loading}
      title={detail?.custName}
      content={
        <>
          <ProCard
            title="基本信息"
            collapsible
            extra={[
              <EditFilledForm key="edit" initialValues={detail} refresh={refresh} action="upd" />,
            ]}
          >
            <ProDescriptions<BAS.Customer>
              columns={[
                { title: '客户编号', dataIndex: 'custCd', editable: false },
                {
                  title: '客户名称',
                  dataIndex: 'custName',
                },
                {
                  title: '等级',
                  dataIndex: 'custLevelName',
                },
                {
                  title: '类型',
                  dataIndex: 'custTypeName',
                },
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
              dataSource={data?.customerInfo}
            />
          </ProCard>
          <Divider />
          <ProCard
            title="财务信息"
            collapsible
            extra={
              <CustomerFinanceForm action="upd" initialValues={data?.finance} refresh={refresh} />
            }
          >
            <ProDescriptions<BAS.CustomerFinance>
              columns={[
                {
                  dataIndex: 'invoice',
                  title: '开票名称',
                  copyable: true,
                },
                {
                  dataIndex: 'taxNumber',
                  title: '开票税号',
                  copyable: true,
                },
                {
                  dataIndex: 'invoiceAddress',
                  title: '开户地址',
                  copyable: true,
                },
                {
                  dataIndex: 'invoiceTel',
                  title: '开户电话',
                  copyable: true,
                },
                {
                  dataIndex: 'bankName',
                  title: '开户名称',
                  copyable: true,
                },
                {
                  dataIndex: 'bank',
                  title: '开户银行',
                  copyable: true,
                },
                {
                  dataIndex: 'bankAccount',
                  title: '银行账号',
                  copyable: true,
                },
                {
                  dataIndex: 'alipay',
                  title: '支付宝账号',
                  copyable: true,
                },
                {
                  dataIndex: 'wxpay',
                  title: '微信账号',
                  copyable: true,
                },
                {
                  dataIndex: 'settlementId',
                  title: '结算方式',
                  valueEnum: valueEnum('Settlement'),
                },
                {
                  dataIndex: 'debtTypeId',
                  title: '账期类型',
                  valueEnum: valueEnum('DebtType'),
                },
                {
                  dataIndex: 'initDate',
                  title: '余额日期',
                  valueType: 'date',
                },
                {
                  dataIndex: 'isInit',
                  title: '对账初始化',
                  valueEnum: new Map([
                    [0, '否'],
                    [1, '是'],
                  ]),
                },
                {
                  dataIndex: 'initRecv',
                  title: '期初应收款',
                  valueType: 'money',
                },
                {
                  dataIndex: 'initPerRecv',
                  title: '期初预收款',
                  valueType: 'money',
                },
                {
                  dataIndex: 'InitRecvOther',
                  title: '期初其他应收款',
                  valueType: 'money',
                },
                {
                  dataIndex: 'creditLimit',
                  title: '授信额度',
                  valueType: 'money',
                },
              ]}
              dataSource={data?.finance}
            />
          </ProCard>
          <Divider />
          <ProCard title="联系人" collapsible>
            <EditableProTable<BAS.Rel>
              rowKey="relId"
              loading={loading}
              value={data?.customerRel}
              actionRef={custRelActionRef}
              bordered
              columns={relColumns}
              recordCreatorProps={{
                record: {
                  relId: (Math.random() * 1000000).toFixed(0),
                  action: 'add',
                } as BAS.Rel,
              }}
              editable={{
                onSave: async (key, values) => {
                  if (values.action === 'add') {
                    await addCustomerRel({
                      ...values,
                      custId: id,
                    });
                  } else {
                    await updCustomerRel(values);
                  }
                  refresh();
                },
                onDelete: async (key) => {
                  await delCustomerRel([key as number]);
                  refresh();
                },
              }}
            />
          </ProCard>
          <Divider />
          <ProCard collapsible split={'vertical'} title="跟踪动态">
            <ProCard>
              {detail ? <CustRecord customer={detail} custRel={data?.customerRel} /> : ''}
            </ProCard>
            <ProCard>{detail ? <CustDoc customer={detail} /> : ''}</ProCard>
          </ProCard>
        </>
      }
    />
  );
};
