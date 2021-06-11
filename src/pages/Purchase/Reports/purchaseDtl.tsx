import { purchaseDtl } from '@/services/Purchase';
import {
  billDescColumns,
  billNoColumns,
  bussTypeColumns,
  dateRangeColumns,
  indexColumns,
  memoColumns,
  moneyColumns,
  skuCodeColumns,
  skuIdColumns,
  spuCodeColumns,
  srcOrderColumns,
  srcOrderSearch,
  storeColumns,
  suppColumns,
  TaxColumns,
  unitIdColumns,
} from '@/utils/columns';
import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button } from 'antd';
import React from 'react';
import { useModel, useRequest } from 'umi';
import { BussTypeComponentUrl } from '../components';
import { transProTableParamsToMyRequest } from '@/utils/utils';
import { StatisticCard } from '@ant-design/pro-card';

export default () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const { useTax } = useModel('params', (model) => ({ useTax: model.sysParams?.useTax || 0 }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    dateRangeColumns({
      dataIndex: 'dateStr',
      title: '采购日期',
    }),
    billNoColumns(),
    bussTypeColumns({
      search: false,
    }),
    suppColumns(),
    spuCodeColumns,
    skuIdColumns({
      fixed: false,
    }),
    skuCodeColumns,
    unitIdColumns,
    storeColumns({
      editable: false,
      valueType: 'select',
      valueEnum: storeEnum,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    {
      title: '数量',
      search: false,
      dataIndex: 'qty',
    },
    moneyColumns({
      title: '单价',
      dataIndex: 'price',
    }),

    {
      title: '税率',
      search: false,
      dataIndex: 'taxRate',
      valueType: 'percent',
    },
    moneyColumns({
      title: '采购金额',
      dataIndex: 'amount',
    }),
    ...TaxColumns(useTax),
    srcOrderColumns(
      {
        title: '源购货订单号',
        hideInTable: false,
      },
      'srcGhddBillNo',
      BussTypeComponentUrl.采购订单,
    ),
    billDescColumns(),
    srcOrderSearch(),
    memoColumns(),
  ];
  const { run, data } = useRequest(
    async (params) => {
      const response = await purchaseDtl(transProTableParamsToMyRequest(params));
      return {
        data: {
          data: response.data.rows.rows,
          success: response.code === 0,
          total: response.data.total,
          summary: response.data.rows.summary,
        },
        success: response.code === 0,
        total: response.data.total,
      };
    },
    { manual: true },
  );
  return (
    <ProTable
      rowKey="autoId"
      options={false}
      bordered
      scroll={{ x: 2300, y: 550 }}
      columns={columns}
      footer={() => {
        return (
          !(data?.summary instanceof Array) && (
            <StatisticCard.Group>
              <StatisticCard
                statistic={{
                  title: '采购数量',
                  value: data?.summary?.qty,
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
              {!!useTax && (
                <>
                  <StatisticCard.Divider />
                  <StatisticCard
                    statistic={{
                      title: '税额',
                      value: data?.summary?.tax,
                      suffix: '元',
                    }}
                  />
                  <StatisticCard.Divider />
                  <StatisticCard
                    statistic={{
                      title: '价税合计',
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
      pagination={{
        pageSize: 500,
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
};
