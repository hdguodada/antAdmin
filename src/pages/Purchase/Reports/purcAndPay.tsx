import { purcAndPay } from '@/services/Purchase';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Table, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { useModel, useRequest } from 'umi';
import { BussType, SupplierSelect } from '../components';

const { Text } = Typography;

export default () => {
  const { suppEnum } = useModel('suppType', (model) => ({ suppEnum: model.valueEnum }));

  const columns: ProColumns<PUR.PurchaseOrder>[] = [
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
    {
      title: '供应商',
      dataIndex: 'suppName',
      search: false,
      index: 1,
    },
    {
      title: '业务类别',
      dataIndex: 'bussType',
      valueEnum: BussType,
      valueType: 'select',
      search: false,
    },
    {
      title: '单据日期',
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
      title: '采购金额',
      search: false,
      dataIndex: 'totalAmount',
      valueType: 'money',
    },
    {
      title: '优惠金额',
      search: false,
      dataIndex: 'reducedAmount',
      valueType: 'money',
    },
    {
      title: '优惠后金额',
      search: false,
      dataIndex: 'amount',
      valueType: 'money',
    },
    {
      title: '本次付款',
      search: false,
      dataIndex: 'payedAmount',
      valueType: 'money',
    },
    {
      title: '应付款余额',
      search: false,
      dataIndex: 'payableAmount',
      valueType: 'money',
    },
    {
      title: '付款率',
      search: false,
      dataIndex: 'backRateStr',
    },
    {
      title: '备注',
      dataIndex: 'billDesc',
      search: false,
      editable: false,
    },
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purcAndPay({
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
      scroll={{ x: 2000, y: 500 }}
      options={false}
      pagination={false}
      columns={columns}
      request={async (params) => {
        return run(params);
      }}
      summary={() => (
        <Table.Summary.Row>
          <Table.Summary.Cell index={0} colSpan={4}>
            合计
          </Table.Summary.Cell>
          <Table.Summary.Cell index={2}>
            <Text type="danger">¥{data?.summary?.totalAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={3}>
            <Text type="danger">¥{data?.summary?.reducedAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={4}>
            <Text type="danger">¥{data?.summary?.amount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={5}>
            <Text type="danger">¥{data?.summary?.payedAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={6}>
            <Text type="danger">¥{data?.summary?.payableAmount}</Text>
          </Table.Summary.Cell>
          <Table.Summary.Cell index={7}>
            <Text type="danger">{data?.summary?.backRateStr}</Text>
          </Table.Summary.Cell>
        </Table.Summary.Row>
      )}
    />
  );
};
