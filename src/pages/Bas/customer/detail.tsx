import {
  addCustomerRel,
  delCustomerRel,
  queryCustomerFinanceInfo,
  queryCustomerInfo,
  queryCustomerRel,
  updCustomerRel,
} from '@/services/Bas';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import React, { useRef, useState } from 'react';
import { useModel, useParams, useRequest } from 'umi';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import { EllipsisOutlined } from '@ant-design/icons';
import CustRecord from './custRecord';
import CustDoc from './custDoc';
import ProDescriptions from '@ant-design/pro-descriptions';
import EditFilledForm from './updForm';
import { indexColumns } from '@/utils/columns';
import CustomerFinanceForm from './custFinanceForm';
import GlobalWrapper from '@/components/GlobalWrapper';
import RcResizeObserver from 'rc-resize-observer';
import { BussType } from '@/pages/Purchase/components';
import { CustAddressTable } from './cusAddress';
import { Button } from 'antd';
import { XhTable } from '@/pages/Sales/components';

const imgStyle = {
  display: 'block',
  width: 42,
  height: 42,
};
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
export default () => {
  const { id } = useParams<{ id: string }>();
  const [detail, setDetail] = useState<BAS.Customer>();
  const [collapsed, setCollapsed] = useState<boolean>(true);
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
    <GlobalWrapper type="descriptions">
      <PageContainer
        loading={loading}
        title={detail?.custName}
        extra={[
          <Button key={'refresh'} type={'dashed'} onClick={refresh}>
            刷新
          </Button>,
          <Button
            key={'collapse'}
            type={'dashed'}
            onClick={() => {
              setCollapsed((i) => !i);
            }}
          >
            {collapsed ? '展开基本信息' : '折叠基本信息'}
          </Button>,
        ]}
        content={
          <ProCard direction="column" ghost>
            {/* 头部 */}
            <ProCard ghost>
              <RcResizeObserver key="resize-observer">
                <StatisticCard.Group direction="row">
                  <StatisticCard
                    statistic={{
                      title: '待审核采购订单',
                      value: 2176,
                      icon: (
                        <img
                          style={imgStyle}
                          src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*dr_0RKvVzVwAAAAAAAAAAABkARQnAQ"
                          alt="icon"
                        />
                      ),
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '待审核采购单',
                      value: 475,
                      icon: (
                        <img
                          style={imgStyle}
                          src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*-jVKQJgA1UgAAAAAAAAAAABkARQnAQ"
                          alt="icon"
                        />
                      ),
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '待审核采购退货单',
                      value: 87,
                      icon: (
                        <img
                          style={imgStyle}
                          src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*FPlYQoTNlBEAAAAAAAAAAABkARQnAQ"
                          alt="icon"
                        />
                      ),
                    }}
                  />
                  <StatisticCard
                    statistic={{
                      title: '待审核其他入库单',
                      value: 1754,
                      icon: (
                        <img
                          style={imgStyle}
                          src="https://gw.alipayobjects.com/mdn/rms_7bc6d8/afts/img/A*pUkAQpefcx8AAAAAAAAAAABkARQnAQ"
                          alt="icon"
                        />
                      ),
                    }}
                  />
                </StatisticCard.Group>
              </RcResizeObserver>
            </ProCard>
            <ProCard ghost split="vertical">
              <ProCard colSpan={collapsed ? 24 : 16} direction="column" ghost>
                {/* 客户关联的表单 Start */}
                <ProCard collapsible title={<span>关联单据</span>} tabs={{}}>
                  <ProCard.TabPane key="销售订单" tab="销售订单">
                    <XhTable
                      bussType={BussType.销售订单}
                      initSearch={{
                        custId: [+id],
                      }}
                    />
                  </ProCard.TabPane>
                  <ProCard.TabPane key="销售单" tab="销售单">
                    <XhTable
                      bussType={BussType.销售单}
                      initSearch={{
                        custId: [+id],
                      }}
                    />
                  </ProCard.TabPane>
                  <ProCard.TabPane key="销售退货单" tab="销售退货单">
                    <XhTable
                      bussType={BussType.销售退货单}
                      initSearch={{
                        custId: [+id],
                      }}
                    />
                  </ProCard.TabPane>
                </ProCard>
                {/* 客户关联的表单 End */}
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
                <ProCard title="销售机会" collapsible>
                  {detail ? <CustRecord customer={detail} custRel={data?.customerRel} /> : ''}
                </ProCard>
                <ProCard title="附件" collapsible>
                  {detail ? <CustDoc customer={detail} /> : ''}
                </ProCard>
              </ProCard>
              <ProCard colSpan={collapsed ? 0 : 8} direction="column" ghost split="horizontal">
                <ProCard
                  title="基本信息"
                  collapsible
                  extra={[
                    <EditFilledForm
                      key="edit"
                      initialValues={detail}
                      refresh={refresh}
                      action="upd"
                    />,
                  ]}
                >
                  <ProDescriptions<BAS.Customer>
                    column={2}
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
                <ProCard
                  title="财务信息"
                  collapsible
                  extra={
                    <CustomerFinanceForm
                      action="upd"
                      initialValues={data?.finance}
                      refresh={refresh}
                    />
                  }
                >
                  <ProDescriptions<BAS.CustomerFinance>
                    column={2}
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
                <ProCard title="收货地址" collapsible>
                  <CustAddressTable custId={id} />
                </ProCard>
              </ProCard>
            </ProCard>
          </ProCard>
        }
      />
    </GlobalWrapper>
  );
};
