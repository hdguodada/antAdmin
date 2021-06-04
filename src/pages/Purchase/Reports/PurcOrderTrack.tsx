import { purchaseOrderListByGhdd } from '@/services/Purchase';
import {
  billNoColumns,
  dateRangeColumns,
  memoColumns,
  skuIdColumns,
  spuCodeColumns,
  suppColumns,
  suppTypeColumns,
  unitIdColumns,
} from '@/utils/columns';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Table, Typography } from 'antd';
import moment from 'moment';
import React from 'react';
import { BussType } from '../components';
import { useModel, useRequest } from 'umi';
import { StatisticCard } from '@ant-design/pro-card';

const { Text } = Typography;

export default function PurcOrderTrack() {
  const { suppTypeEnum } = useModel('suppType', (model) => ({ suppTypeEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns(),
    spuCodeColumns,
    skuIdColumns(),
    unitIdColumns,
    billNoColumns({
      bussType: BussType.采购订单,
    }),
    suppTypeColumns(suppTypeEnum),
    suppColumns(),
    {
      title: '仓库',
      dataIndex: 'storeName',
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
      dataIndex: 'deliveryDateStr',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      render: (_, record) => <div>{record.deliveryDateStr}</div>,
      search: {
        transform: (value) => ({
          fromDeliveryDate: value[0],
          toDeliveryDate: value[1],
        }),
      },
    },
    {
      title: '最后入库日期',
      dataIndex: 'inDateStr',
      search: false,
    },
    {
      title: '状态',
      dataIndex: 'status',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: new Map([
        [1, { text: '未入库', status: 'Processing' }],
        [2, { text: '部分入库', status: 'Warning' }],
        [3, { text: '已入库', status: 'Success' }],
      ]),
    },
    {
      dataIndex: 'orderByBillNo',
      valueType: 'radio',
      valueEnum: new Map([
        [1, '按单据排列'],
        [0, '按商品排列'],
      ]),
      initialValue: 1,
      hideInTable: true,
    },
    {
      title: '含未审核',
      dataIndex: 'includeUnchecked',
      valueType: 'switch',
      initialValue: true,
      hideInTable: true,
      colSize: 0.5,
    },
    memoColumns(),
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purchaseOrderListByGhdd({
        ...params,
        pageNumber: params.current,
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
        total: response.data.total,
      };
    },
    { manual: true },
  );
  return (
    <ProTable<PUR.PurchaseOrder>
      rowKey="autoId"
      options={false}
      bordered
      footer={() => {
        return (
          !(data?.summary instanceof Array) && (
            <StatisticCard.Group>
              <StatisticCard
                statistic={{
                  title: '入库数量',
                  value: data?.summary?.qty,
                  status: 'success',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '入库金额',
                  value: data?.summary?.amount,
                  status: 'success',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '未入库数量',
                  value: data?.summary?.unQty,
                  status: 'error',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '未入库金额',
                  value: data?.summary?.unAmount,
                  status: 'error',
                }}
              />
            </StatisticCard.Group>
          )
        );
      }}
      summary={() =>
        !(data?.summary instanceof Array) && (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={0} colSpan={6}>
              合计
            </Table.Summary.Cell>
            <Table.Summary.Cell index={2}>
              <Text type="danger">¥{data?.summary?.qty}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={3} />
            <Table.Summary.Cell index={4}>
              <Text type="danger">¥{data?.summary?.amount}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={5}>
              <Text type="danger">¥{data?.summary?.unQty}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={6}>
              <Text type="danger"> ¥{data?.summary?.unAmount}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={7} colSpan={4} />
          </Table.Summary.Row>
        )
      }
      columns={columns}
      scroll={{ x: 2000 }}
      pagination={{
        pageSize: 10,
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
}
