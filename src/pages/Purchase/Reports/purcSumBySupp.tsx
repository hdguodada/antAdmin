import { purcSumBySupp } from '@/services/Purchase';
import {
  dateRangeColumns,
  memoColumns,
  moneyColumns,
  skuIdColumns,
  spuCodeColumns,
  storeColumns,
  suppColumns,
  suppTypeColumns,
} from '@/utils/columns';
import { StatisticCard } from '@ant-design/pro-card';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React from 'react';
import { useModel, useRequest } from 'umi';

export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const { suppEnum } = useModel('suppType', (model) => ({ suppEnum: model.valueEnum }));
  const { useTax } = useModel('params', (model) => ({ useTax: model.sysParams?.useTax || 0 }));

  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns(),
    suppTypeColumns(suppEnum),
    suppColumns(),
    spuCodeColumns,
    skuIdColumns({
      fixed: false,
    }),
    storeColumns({
      editable: false,
      hideInTable: true,
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
      dataIndex: 'baseUnitName',
      search: false,
      width: 105,
    },
    {
      title: '基本数量',
      search: false,
      dataIndex: 'baseQty',
      width: 105,
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
      hideInTable: !useTax,
    }),
    moneyColumns({
      title: '价税合计',
      dataIndex: 'taxAmount',
      hideInTable: !useTax,
    }),
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
      scroll={{ x: 2000, y: 550 }}
      options={false}
      pagination={false}
      columns={columns}
      request={async (params) => {
        return run(params);
      }}
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
              {useTax && (
                <>
                  <StatisticCard.Divider />
                  <StatisticCard
                    statistic={{
                      title: '总税额',
                      value: data?.summary?.tax,
                      suffix: '元',
                    }}
                  />
                  <StatisticCard.Divider />
                  <StatisticCard
                    statistic={{
                      title: '总价税合计',
                      value: data?.summary?.taxAmount,
                      suffix: '元',
                    }}
                  />
                </>
              )}
            </StatisticCard.Group>
          )
        );
      }}
    />
  );
};
