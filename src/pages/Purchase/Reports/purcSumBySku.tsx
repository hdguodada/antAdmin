import { purcSumBySku } from '@/services/Purchase';
import {
  cateIdColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
  skuIdColumns,
  spuCodeColumns,
  storeColumns,
} from '@/utils/columns';
import { transProTableParamsToMyRequest } from '@/utils/utils';
import { StatisticCard } from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { useModel, useRequest } from 'umi';

export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const { useTax } = useModel('params', (model) => ({ useTax: model.sysParams?.useTax || 0 }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    dateRangeColumns(),
    cateIdColumns(),
    spuCodeColumns,
    skuIdColumns({
      fixed: false,
    }),
    storeColumns({
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    }),
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
      dataIndex: 'baseUnitId',
      search: false,
      render: (_, record) => <div>{record.baseUnitName}</div>,
    },
    {
      title: '基本数量',
      search: false,
      dataIndex: 'baseQty',
    },
    moneyColumns({
      title: '单价',
      dataIndex: 'price',
    }),
    moneyColumns({
      title: '采购金额',
      dataIndex: 'amount',
    }),
    moneyColumns({
      title: '税额',
      dataIndex: 'tax',
      hideInTable: !!useTax,
    }),
    moneyColumns({
      title: '价税合计',
      dataIndex: 'taxAmount',
      hideInTable: !!useTax,
    }),
    memoColumns(),
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purcSumBySku(transProTableParamsToMyRequest(params));
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
      // summary={() =>
      //   !(data?.summary instanceof Array) && (
      //     <Table.Summary.Row>
      //       <Table.Summary.Cell index={0} colSpan={6}>
      //         合计
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={2}>
      //         <Text type="danger">{data?.summary?.baseQty}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={3}>
      //         <Text type="danger">¥{data?.summary?.price}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={4}>
      //         <Text type="danger">¥{data?.summary?.amount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={5}>
      //         <Text type="danger">¥{data?.summary?.tax}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={6}>
      //         <Text type="danger">¥{data?.summary?.taxAmount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={7} />
      //     </Table.Summary.Row>
      //   )
      // }
      footer={() => {
        return (
          !(data?.summary instanceof Array) && (
            <StatisticCard.Group>
              <StatisticCard
                statistic={{
                  title: '总基本数量',
                  value: data?.summary?.baseQty,
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '均价',
                  value: data?.summary?.price,
                  suffix: '元',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '采购总金额',
                  value: data?.summary?.amount,
                  suffix: '元',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '总税额',
                  value: data?.summary?.tax,
                  suffix: '元',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '总价税合计',
                  value: data?.summary?.taxAmount,
                  suffix: '元',
                }}
              />
            </StatisticCard.Group>
          )
        );
      }}
    />
  );
};
