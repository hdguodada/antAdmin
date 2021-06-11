import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import GlobalWrapper from '@/components/GlobalWrapper';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  billNoColumns,
  bussTypeColumns,
  cateIdColumns,
  customerColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
  skuIdColumns,
  spuCodeColumns,
  srcOrderColumns,
  storeColumns,
  TaxColumns,
  unitIdColumns,
} from '@/utils/columns';
import { Button } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useModel, request, useRequest } from 'umi';
import { StatisticCard } from '@ant-design/pro-card';
import lodash from 'lodash';
import { mapModId, transProTableParamsToMyRequest } from '@/utils/utils';
import { ProFormCheckBoxZeroAndOne } from '@/utils/form';

export const SaleOrderTrack: React.FC = () => {
  const { userEnum } = useModel('user', (model) => ({ userEnum: model.valueEnum }));
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    spuCodeColumns,
    skuIdColumns({}),
    unitIdColumns,
    dateRangeColumns(),
    billNoColumns(),
    {
      dataIndex: 'salesmanId',
      title: '销售人员',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      search: {
        transform: (v) => ({
          operId: v,
        }),
      },
      valueEnum: userEnum,
    },
    customerColumns(undefined, undefined, { renderName: 'custCd' }),
    storeColumns({
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
      search: false,
    }),
    {
      width: 105,
      dataIndex: 'statusName',
      title: '订单状态',
      search: false,
    },
    moneyColumns({
      dataIndex: 'price',
      title: '单价',
    }),
    {
      dataIndex: 'qty',
      title: '数量',
      search: false,
    },
    moneyColumns({
      dataIndex: 'amount',
      title: '销售额',
    }),
    {
      dataIndex: 'unQty',
      title: '未出库数量',
      search: false,
    },
    moneyColumns({
      dataIndex: 'unAmount',
      title: '未出库金额',
    }),
  ];
  const { run } = useRequest<RowResponse<PUR.PurchaseOrder>>(
    (params) => ({
      url: '/report/sale/saleOrderTrack',
      data: transProTableParamsToMyRequest(params),
      method: 'POST',
    }),
    { manual: true },
  );
  return (
    <ProTable<PUR.PurchaseOrder>
      columns={columns}
      search={{
        collapseRender: (collapsed) =>
          collapsed ? (
            <Button>
              更多条件
              <DownOutlined />
            </Button>
          ) : (
            <Button>
              收起条件
              <UpOutlined />
            </Button>
          ),
      }}
      rowKey="autoId"
      request={async (params) => {
        const res = await run(params);
        return {
          data: res.rows,
          success: true,
        };
      }}
      pagination={false}
      bordered
      options={false}
      scroll={{ x: 2000, y: 500 }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '数量',
                value: recordList.reduce((a, b) => lodash.add(a, b.qty || 0), 0),
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '销售额',
                value: recordList.reduce((a, b) => lodash.add(a, b.amount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '未出库数量',
                value: recordList.reduce((a, b) => lodash.add(a, b.unQty || 0), 0),
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '未出库金额',
                value: recordList.reduce((a, b) => lodash.add(a, b.unAmount || 0), 0),
                precision: 2,
                suffix: '元',
              }}
            />
          </StatisticCard.Group>
        );
      }}
    />
  );
};

export const SaleAndPay: React.FC = () => {
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    customerColumns(),
    bussTypeColumns({ search: false }),
    dateRangeColumns(),
    billNoColumns(),
    moneyColumns({
      title: '销售金额',
      dataIndex: 'totalAmount',
    }),
    moneyColumns({
      title: '优惠金额',
      dataIndex: 'reducedAmount',
    }),
    moneyColumns({
      title: '本次收款',
      dataIndex: 'payedAmount',
    }),
    moneyColumns({
      title: '应收款余额',
      dataIndex: 'payableAmount',
    }),
    {
      title: '回款率',
      dataIndex: 'backRate',
      search: false,
      width: 105,
      render: (_, record) => <div>{record.backRate * 100}%</div>,
    },
    {
      title: '回款率100%不显示',
      dataIndex: 'showFull',
      hideInTable: true,
      formItemProps: { labelCol: { span: 8 } },
      renderFormItem: () => <ProFormCheckBoxZeroAndOne />,
    },
    memoColumns(),
  ];
  return (
    <ProTable<PUR.PurchaseOrder>
      search={{
        collapseRender: (collapsed) =>
          collapsed ? (
            <Button>
              更多条件
              <DownOutlined />
            </Button>
          ) : (
            <Button>
              收起条件
              <UpOutlined />
            </Button>
          ),
      }}
      columns={columns}
      request={async (params) => {
        const res = await request<RowResponse<PUR.PurchaseOrder>>('/report/sale/saleAndPay', {
          data: transProTableParamsToMyRequest(params),
          headers: { modId: mapModId.sales },
          method: 'POST',
        });
        return {
          data: res.data.rows,
          success: true,
        };
      }}
      rowKey="autoId"
      pagination={false}
      bordered
      options={false}
      scroll={{ x: 1800, y: 500 }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '销售金额',
                value: recordList.reduce((a, b) => lodash.add(a, b.totalAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '优惠金额',
                value: recordList.reduce((a, b) => lodash.add(a, b.reducedAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '本次收款',
                value: recordList.reduce((a, b) => lodash.add(a, b.payedAmount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '应收款余额',
                value: recordList.reduce((a, b) => lodash.add(a, b.payableAmount || 0), 0),
                suffix: '元',
              }}
            />
          </StatisticCard.Group>
        );
      }}
    />
  );
};

type XhHzbProps = {
  url: string;
  type: 'SaleSumByCust' | 'SaleSumBySku' | 'SaleDtl';
};
export const XhHzb: React.FC<XhHzbProps> = ({ url, type }) => {
  const { useTax } = useModel('params', (model) => ({ useTax: model.sysParams?.useTax || 0 }));
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    dateRangeColumns(),
    {
      dataIndex: 'custTypeName',
      title: '客户类别',
      width: 105,
      search: false,
      hideInTable: type === 'SaleSumBySku',
    },
    customerColumns(undefined, {
      hideInTable: type === 'SaleSumBySku',
    }),
    cateIdColumns({
      hideInTable: type === 'SaleSumByCust',
    }),
    spuCodeColumns,
    skuIdColumns({
      fixed: false,
    }),
    storeColumns({
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    {
      title: '副单位',
      dataIndex: 'secondUnit',
      search: false,
      width: 155,
      hideInTable: type === 'SaleDtl',
    },
    {
      title: '副单位数',
      dataIndex: 'secondQty',
      search: false,
      width: 105,
      hideInTable: type === 'SaleDtl',
    },
    {
      title: '基本单位',
      dataIndex: 'baseUnitId',
      search: false,
      width: 105,
      render: (_, record) => <div>{record.baseUnitName}</div>,
    },
    {
      title: '基本数量',
      search: false,
      width: 105,
      dataIndex: 'baseQty',
    },
    moneyColumns({
      title: '单价',
      dataIndex: 'price',
    }),
    moneyColumns({
      title: '销售收入',
      dataIndex: 'amount',
    }),

    moneyColumns({
      title: '税额',
      dataIndex: 'tax',
      editable: false,
      hideInTable: !useTax,
      search: false,
    }),
    moneyColumns({
      title: '价税合计',
      dataIndex: 'taxAmount',
      editable: false,
      hideInTable: !useTax,
      search: false,
    }),
    billNoColumns(),
    srcOrderColumns(
      {
        title: '关联销售单号',
      },
      'srcXhddBillNo',
    ),
    {
      dataIndex: 'operName',
      title: '销售人员',
      width: 105,
      search: false,
    },
    // moneyColumns({
    //   title: '单位成本',
    //   dataIndex: 'unitCost',
    // }),
    // moneyColumns({
    //   title: '销售成本',
    //   dataIndex: 'cost',
    // }),
    // moneyColumns({
    //   title: '销售毛利',
    //   dataIndex: 'saleProfit',
    // }),
    // {
    //   title: '毛利率',
    //   dataIndex: 'salepPofitRate',
    //   search: false,
    //   width: 105,
    //   valueType: 'percent',
    // },
    memoColumns(),
  ];
  return (
    <ProTable<PUR.PurchaseOrder>
      search={{
        collapseRender: (collapsed) =>
          collapsed ? (
            <Button>
              更多条件
              <DownOutlined />
            </Button>
          ) : (
            <Button>
              收起条件
              <UpOutlined />
            </Button>
          ),
      }}
      columns={columns}
      request={async (params) => {
        const res = await request<RowResponse<PUR.PurchaseOrder>>(url, {
          data: transProTableParamsToMyRequest(params),
          headers: { modId: mapModId.sales },
          method: 'POST',
        });
        return {
          data: res.data.rows,
          success: true,
        };
      }}
      rowKey="autoId"
      pagination={false}
      bordered
      options={false}
      scroll={{ x: 2700, y: 500 }}
      footer={(recordList) => {
        return (
          <StatisticCard.Group>
            <StatisticCard
              statistic={{
                title: '数量',
                value: recordList.reduce((a, b) => lodash.add(a, b.baseQty || 0), 0),
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '单价',
                value: lodash.divide(
                  recordList.reduce((a, b) => lodash.add(a, b.price || 0), 0),
                  recordList.length,
                ),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
            <StatisticCard
              statistic={{
                title: '销售收入',
                value: recordList.reduce((a, b) => lodash.add(a, b.amount || 0), 0),
                suffix: '元',
              }}
            />
            <StatisticCard.Divider />
          </StatisticCard.Group>
        );
      }}
    />
  );
};

export default () => {
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer
        title={false}
        tabProps={{
          defaultActiveKey: 'SaleDtl',
        }}
        tabList={[
          {
            tab: '销售订单追踪表',
            key: 'SaleOrderTrack',
            children: <SaleOrderTrack />,
          },
          {
            tab: '销售付款一览表',
            key: 'SaleAndPay',
            children: <SaleAndPay />,
          },
          {
            tab: '销售汇总表(按商品)',
            key: 'SaleSumBySku',
            children: <XhHzb url="/report/sale/saleSumBySku" type="SaleSumBySku" />,
          },
          {
            tab: '销售汇总表(按客户)',
            key: 'SaleSumByCust',
            children: <XhHzb url="/report/sale/saleSumByCust" type="SaleSumByCust" />,
          },
          {
            tab: '销售明细表',
            key: 'SaleDtl',
            children: <XhHzb url="/report/sale/saleDtl" type="SaleDtl" />,
          },
        ]}
      />
    </GlobalWrapper>
  );
};
