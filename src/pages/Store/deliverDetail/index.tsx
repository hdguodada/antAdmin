import { purchaseOrderListByDetail } from '@/services/Purchase';
import { memoColumns } from '@/utils/columns';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';

export default () => {
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '采购日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      render: (_, record) => <div>{record.date}</div>,
    },
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
      search: false,
    },
    {
      title: '商品类别',
      dataIndex: 'cateId',
      hideInTable: true,
    },
    {
      title: '单位',
      dataIndex: 'unitId',
      render: (_, record) => <div>{record.unitName}</div>,
      search: false,
    },
    {
      title: '单据编号',
      dataIndex: 'billNo',
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      render: (_, record) => <div>{record.storeName}</div>,
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
      title: '税率',
      search: false,
      dataIndex: 'taxRate',
    },
    {
      title: '含税单价',
      search: false,
      dataIndex: 'taxPrice',
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
    {
      title: '源购货订单号',
      dataIndex: 'srcGhddBillNo',
    },
    memoColumns(),
  ];
  return (
    <PageContainer
      content={
        <ProTable
          rowKey="autoId"
          scroll={{ y: 440 }}
          pagination={false}
          columns={columns}
          search={{
            defaultCollapsed: false,
            span: 5,
          }}
          request={async (params) => {
            const response = await purchaseOrderListByDetail(params);
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
        />
      }
    ></PageContainer>
  );
};
