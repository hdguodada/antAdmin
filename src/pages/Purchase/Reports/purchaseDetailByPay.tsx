import { purchaseDetailBySupp } from '@/services/Purchase';
import { memoColumns } from '@/utils/columns';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { SupplierSelect } from '../components';

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
      hideInTable: true,
      valueType: 'select',
      renderFormItem: () => <SupplierSelect />,
    },
    {
      title: '供应商',
      dataIndex: 'suppName',
      search: false,
      index: 1,
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
