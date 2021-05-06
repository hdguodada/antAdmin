import { purchaseDetailBySupp } from '@/services/Purchase';
import { memoColumns } from '@/utils/columns';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { SupplierSelect, SkuSelect } from '../components';

export default () => {
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '供应商类别',
      dataIndex: 'suppTypeName',
      search: false,
      index: 0,
    },
    {
      title: '供应商',
      dataIndex: 'suppId',
      valueType: 'select',
      renderFormItem: () => <SupplierSelect />,
      render: (_, record) => <div>{record.cateName}</div>,
    },
    {
      title: '商品编号',
      dataIndex: 'code',
      search: false,
      copyable: true,
      ellipsis: true,
      index: 2,
    },
    {
      title: '商品',
      dataIndex: 'skuId',
      hideInTable: true,
      renderFormItem: () => <SkuSelect />,
      render: (_, record) => <div>{record.skuName}</div>,
    },
    {
      title: '商品规格',
      dataIndex: 'spec',
      search: false,
      index: 4,
    },

    {
      title: '仓库',
      dataIndex: 'storeCd',
      render: (_, record) => <div>{record.storeName}</div>,
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
        const response = await purchaseDetailBySupp(params);
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};
