import { purchaseDtl } from '@/services/Purchase';
import {
  billDescColumns,
  dateRangeColumns,
  memoColumns,
  skuCodeColumns,
  skuIdColumns,
  spuCodeColumns,
  srcOrderColumns,
  srcOrderSearch,
  storeColumns,
  suppColumns,
  TaxColumns,
  unitIdColumns,
} from '@/utils/columns';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Table, Typography } from 'antd';
import React from 'react';
import { useModel, useRequest } from 'umi';
import { BussTypeComponentUrl, BussTypeEnum } from '../components';

const { Text } = Typography;
export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const { useTax } = useModel('params', (model) => ({ useTax: model.sysParams?.useTax || false }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns({
      dataIndex: 'dateStr',
      title: '采购日期',
    }),
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
    skuIdColumns(),
    skuCodeColumns,
    unitIdColumns,
    storeColumns({
      editable: false,
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    }),
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
      title: '采购金额',
      search: false,
      dataIndex: 'amount',
      valueType: 'money',
    },
    ...TaxColumns(useTax),
    srcOrderColumns(
      {
        title: '源购货订单号',
        hideInTable: false,
      },
      'srcGhddBillNo',
      BussTypeComponentUrl.采购订单,
    ),
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
