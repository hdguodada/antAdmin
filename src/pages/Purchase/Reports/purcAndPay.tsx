import { purcAndPay } from '@/services/Purchase';
import { dateRangeColumns, indexColumns, moneyColumns, suppColumns } from '@/utils/columns';
import { transProTableParamsToMyRequest } from '@/utils/utils';
import { StatisticCard } from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { useRequest } from 'umi';
import { BussTypeEnum } from '../components';

export default () => {
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    dateRangeColumns(),
    suppColumns(),
    {
      title: '业务类别',
      dataIndex: 'bussType',
      valueEnum: BussTypeEnum,
      valueType: 'select',
      search: false,
    },
    moneyColumns({
      title: '采购金额',
      dataIndex: 'totalAmount',
    }),
    moneyColumns({
      title: '优惠金额',
      dataIndex: 'reducedAmount',
    }),
    moneyColumns({
      title: '优惠后金额',
      dataIndex: 'amount',
    }),
    moneyColumns({
      title: '本次付款',
      dataIndex: 'payedAmount',
    }),
    moneyColumns({
      title: '应付款余额',
      dataIndex: 'payableAmount',
    }),
    {
      title: '付款率',
      search: false,
      dataIndex: 'backRateStr',
      valueType: 'percent',
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
      const response = await purcAndPay(transProTableParamsToMyRequest(params));
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
      scroll={{ x: 1800, y: 550 }}
      options={false}
      pagination={false}
      columns={columns}
      request={async (params) => {
        return run(params);
      }}
      // summary={() =>
      //   !(data?.summary instanceof Array) && (
      //     <Table.Summary.Row>
      //       <Table.Summary.Cell index={0} colSpan={4}>
      //         合计
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={2}>
      //         <Text type="danger">¥{data?.summary?.totalAmount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={3}>
      //         <Text type="danger">¥{data?.summary?.reducedAmount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={4}>
      //         <Text type="danger">¥{data?.summary?.amount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={5}>
      //         <Text type="danger">¥{data?.summary?.payedAmount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={6}>
      //         <Text type="danger">¥{data?.summary?.payableAmount}</Text>
      //       </Table.Summary.Cell>
      //       <Table.Summary.Cell index={7}>
      //         <Text type="danger">{data?.summary?.backRateStr}</Text>
      //       </Table.Summary.Cell>
      //     </Table.Summary.Row>
      //   )
      // }
      footer={() => {
        return (
          !(data?.summary instanceof Array) && (
            <StatisticCard.Group>
              <StatisticCard
                statistic={{
                  title: '采购金额',
                  value: data?.summary?.totalAmount,
                  suffix: '元',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '优惠金额',
                  value: data?.summary?.reducedAmount,
                  suffix: '元',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '优惠后金额',
                  value: data?.summary?.amount,
                  suffix: '元',
                }}
              />
              <StatisticCard.Divider />
              <StatisticCard
                statistic={{
                  title: '本次付款',
                  value: data?.summary?.payedAmount,
                  suffix: '元',
                }}
              />
              <StatisticCard
                statistic={{
                  title: '应付款余额',
                  value: data?.summary?.payableAmount,
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
