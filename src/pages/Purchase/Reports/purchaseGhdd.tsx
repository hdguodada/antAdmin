import { purchaseOrderListByGhdd } from '@/services/Purchase';
import { memoColumns } from '@/utils/columns';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { SupplierSelect, SkuSelect } from '../components';

export default () => {
  const columns: ProColumns<PUR.Purchase>[] = [
    {
      title: '商品编号',
      dataIndex: 'code',
      search: false,
      copyable: true,
      ellipsis: true,
    },
    {
      title: '商品名称',
      dataIndex: 'skuName',
      renderFormItem: () => <SkuSelect />,
    },
    {
      title: '单位',
      dataIndex: 'unitName',
      search: false,
    },
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
    },
    {
      title: '采购订单编号',
      dataIndex: 'billNo',
    },
    {
      title: '供应商',
      dataIndex: 'suppId',
      valueType: 'select',
      renderFormItem: () => <SupplierSelect />,
    },
    {
      title: '供应商',
      dataIndex: 'suppName',
      search: false,
    },
    {
      title: '仓库',
      dataIndex: 'storeName',
      search: false,
    },

    {
      title: '状态',
      dataIndex: 'status',
      search: false,
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
    },
    {
      title: '采购额',
      search: false,
      dataIndex: 'amount',
    },
    {
      title: '未入库数量',
      search: false,
      dataIndex: 'unQty',
    },
    {
      title: '未入库金额',
      search: false,
      dataIndex: 'unAmount',
    },
    {
      title: '预计交货日期',
      dataIndex: 'deliveryDate',
      valueType: 'dateRange',
    },
    {
      title: '最后入库日期',
      dataIndex: 'inDate',
      search: false,
    },
    memoColumns(),
  ];
  return (
    <ProTable
      rowKey="autoId"
      scroll={{ y: 440 }}
      options={false}
      pagination={false}
      columns={columns}
      search={{
        defaultCollapsed: false,
        span: 5,
      }}
      request={async (params) => {
        const response = await purchaseOrderListByGhdd(params);
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};
