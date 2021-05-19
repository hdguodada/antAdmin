import { purchaseDtl } from '@/services/Purchase';
import {
  billDescColumns,
  memoColumns,
  spuCodeColumns,
  srcOrderColumns,
  srcOrderSearch,
  suppColumns,
  unitIdColumns,
} from '@/utils/columns';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Table, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useModel, useRequest } from 'umi';
import { SkuSelect, BussTypeComponentUrl, BussTypeEnum } from '../components';

const { Text } = Typography;
export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '采购日期',
      dataIndex: 'dateStr',
      key: 'dataStr',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      render: (_, record) => <div>{record.dateStr}</div>,
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
    },
    {
      title: '采购单据号',
      dataIndex: 'billNo',
    },
    {
      title: '业务类别',
      dataIndex: 'bussType',
      valueType: 'select',
      valueEnum: BussTypeEnum,
      search: false,
    },
    suppColumns(),
    spuCodeColumns,
    {
      title: '商品名称',
      dataIndex: 'skuId',
      key: 'skuId',
      renderFormItem: () => <SkuSelect multiple type="input" />,
      render: (_, record) => <div>{record.skuName}</div>,
    },
    {
      title: '商品条码',
      dataIndex: 'skuCode',
      search: false,
    },
    unitIdColumns,
    {
      title: '仓库',
      dataIndex: 'storeCd',
      editable: false,
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    },
    {
      title: '数量',
      search: false,
      dataIndex: 'qty',
    },
    {
      title: '单价',
      search: false,
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '税率',
      search: false,
      dataIndex: 'taxRate',
      valueType: 'percent',
    },
    {
      title: '含税单价',
      search: false,
      dataIndex: 'taxPrice',
      valueType: 'money',
    },
    {
      title: '采购金额',
      search: false,
      dataIndex: 'amount',
      valueType: 'money',
    },
    {
      title: '税额',
      search: false,
      dataIndex: 'tax',
      valueType: 'money',
    },
    {
      title: '价税合计',
      search: false,
      dataIndex: 'taxAmount',
      valueType: 'money',
    },
    srcOrderColumns({
      title: '源购货订单号',
      dataIndex: 'srcGhddBillNo',
      url: BussTypeComponentUrl.采购订单,
      hideInTable: false,
    }),
    billDescColumns(),
    srcOrderSearch(),
    memoColumns(),
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purchaseDtl({
        ...params,
        pageNumber: params.current,
        queryFilter: params,
      });
      return {
        data: {
          data: response.data.rows.rows,
          success: response.code === 0,
          total: response.data.total,
          summary: response.data.rows.summary,
        },
        success: response.code === 0,
        total: response.data.total,
      };
    },
    { manual: true },
  );
  return (
    <ProTable
      rowKey="autoId"
      options={false}
      bordered
      scroll={{ x: 2000, y: 500 }}
      columns={columns}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={8}>
            合计
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <Text type="danger">¥{data?.summary?.qty}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3} colSpan={3}></Table.Summary.Cell>
          <Table.Summary.Cell index={4}>
            <Text type="danger">¥{data?.summary?.amount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            <Text type="danger">¥{data?.summary?.tax}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            <Text type="danger">¥{data?.summary?.taxAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7} colSpan={4}></Table.Summary.Cell>
        </Table.Summary.Row>
      )}
      pagination={{
        pageSize: 500,
      }}
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
      request={async (params) => {
        return await run(params);
      }}
    />
  );
};
