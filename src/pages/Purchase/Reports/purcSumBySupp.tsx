import { purcSumBySupp } from '@/services/Purchase';
import { memoColumns, spuCodeColumns } from '@/utils/columns';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Table, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useModel, useRequest } from 'umi';
import { SupplierSelect, SkuSelect } from '../components';

const { Text } = Typography;

export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const { suppEnum } = useModel('suppType', (model) => ({ suppEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '单据日期',
      dataIndex: 'dateStr',
      key: 'dataStr',
      hideInTable: true,
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
      title: '供应商类别',
      dataIndex: 'suppTypeId',
      valueType: 'select',
      valueEnum: suppEnum,
      render: (_, record) => <div>{record.suppTypeName}</div>,
    },
    {
      title: '供应商',
      dataIndex: 'suppId',
      valueType: 'select',
      hideInTable: true,
      renderFormItem: () => <SupplierSelect multiple />,
      render: (_, record) => <div>{record.cateName}</div>,
    },
    spuCodeColumns,
    {
      title: '商品',
      dataIndex: 'skuId',
      hideInTable: true,
      renderFormItem: () => <SkuSelect multiple type="input" />,
      render: (_, record) => <div>{record.skuName}</div>,
    },
    {
      title: '仓库',
      dataIndex: 'storeName',
      editable: false,
      search: false,
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      editable: false,
      hideInTable: true,
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    },
    {
      title: '副单位',
      dataIndex: 'secondUnit',
      search: false,
    },
    {
      title: '副单位数',
      dataIndex: 'secondQty',
      search: false,
    },

    {
      title: '基本单位',
      dataIndex: 'baseUnitName',
      search: false,
    },
    {
      title: '基本数量',
      search: false,
      dataIndex: 'baseQty',
    },
    {
      title: '单价',
      search: false,
      dataIndex: 'price',
    },
    {
      title: '采购金额',
      search: false,
      dataIndex: 'amount',
    },
    {
      title: '税额',
      search: false,
      dataIndex: 'tax',
    },
    {
      title: '价税合计',
      search: false,
      dataIndex: 'taxAmount',
    },
    memoColumns(),
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purcSumBySupp({
        ...params,
        queryFilter: params,
      });
      return {
        data: {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
          summary: response.data.summary,
        },
        success: response.code === 0,
      };
    },
    { manual: true },
  );
  return (
    <ProTable
      rowKey="autoId"
      bordered
      scroll={{ x: 2000, y: 600 }}
      options={false}
      pagination={false}
      columns={columns}
      request={async (params) => {
        return run(params);
      }}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={6}>
            合计
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <Text type="danger">{data?.summary?.baseQty}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <Text type="danger">¥{data?.summary?.price}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4}>
            <Text type="danger">¥{data?.summary?.amount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            <Text type="danger">¥{data?.summary?.tax}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            <Text type="danger">¥{data?.summary?.taxAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7}></Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );
};
