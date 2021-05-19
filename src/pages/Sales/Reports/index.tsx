import React from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import GlobalWrapper from '@/components/GlobalWrapper';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  billNoColumns,
  billStatusColumns,
  skuIdColumns,
  spuCodeColumns,
  storeCdColumns,
  unitIdColumns,
} from '@/utils/columns';
import moment from 'moment';
import { useRequest } from '@/.umi/plugin-request/request';
import { Button, Select, Table, Typography } from 'antd';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import { useModel } from '@/.umi/plugin-model/useModel';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';

const { Text } = Typography;
export const XhddReports: React.FC = () => {
  const { userOptions } = useModel('user', (model) => ({ userOptions: model.options }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    spuCodeColumns,
    skuIdColumns,
    unitIdColumns,
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      render: (_, record) => <div>{record.date}</div>,
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
    },
    billNoColumns(),
    {
      dataIndex: 'operId',
      title: '销售人员',
      render: (_, r) => <div>{r.operName}</div>,
      renderFormItem: () => <Select options={userOptions} mode="multiple" />,
    },
    {
      dataIndex: 'custId',
      title: '客户',
      valueType: 'select',
      render: (_, r) => <div>{r.contactName}</div>,
      renderFormItem: () => <CustomerSelect multiple />,
    },
    storeCdColumns,
    billStatusColumns(2, false, false),
    {
      dataIndex: 'qty',
      title: '数量',
      search: false,
    },
    {
      dataIndex: 'price',
      title: '单价',
      search: false,
      valueType: 'money',
    },
    {
      dataIndex: 'amount',
      title: '销售额',
      search: false,
      valueType: 'money',
    },
    {
      dataIndex: 'unQty',
      title: '未出库数量',
      search: false,
      width: 100,
    },
    {
      dataIndex: 'unAmount',
      title: '未出库金额',
      search: false,
      valueType: 'money',
    },
  ];
  const { run, data } = useRequest<RowResponse<PUR.PurchaseOrder>>(
    (params) => ({
      url: '/sales/reports/xhdd',
      data: {
        queryFilter: params,
        dev: 'xsdj',
      },
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
      rowKey="billId"
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
      scroll={{ x: 1800, y: 500 }}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
          <Table.Summary.Cell index={1} colSpan={4} />
          <Table.Summary.Cell index={2}>
            <Text type="danger">¥{data?.summary?.amount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <Text type="danger">¥{data?.summary?.qty}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4}>
            <Text type="danger">¥{data?.summary?.amount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            <Text type="danger">¥{data?.summary?.unAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            <Text type="danger">¥{data?.summary?.unQty}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7} />
        </Table.Summary.Row>
      )}
    />
  );
};

export default () => {
  return (
    <GlobalWrapper type="descriptions">
      <PageContainer
        title={false}
        tabList={[
          {
            tab: '销售订单追踪表',
            key: 'xhdd',
            children: <XhddReports />,
          },
          {
            tab: '销售付款一览表',
            key: 'Pay',
          },
          {
            tab: '销售汇总表(按商品)',
            key: 'Sku',
          },
          {
            tab: '销售汇总表(按供应商)',
            key: 'Supp',
          },
          {
            tab: '销售明细表',
            key: 'Detail',
          },
        ]}
      />
    </GlobalWrapper>
  );
};
