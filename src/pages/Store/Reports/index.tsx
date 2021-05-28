import ProCard from '@ant-design/pro-card';
import React, { useState } from 'react';
import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import { storeReports, storeRowResponseReports } from '@/services/Store/serNum';
import { useModel } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  indexColumns,
  skuIdColumns,
  baseUnitIdColumns,
  secondUnitColumns,
  memoColumns,
  cateIdColumns,
  unitIdColumns,
  spuCodeColumns,
  billNoColumns,
  skuCodeColumns,
  storeColumns,
  bussTypeColumns,
  dateRangeColumns,
} from '@/utils/columns';
import { Table, Typography } from 'antd';
import { transProTableParamsToMyRequest } from '@/utils/utils';

const { Text } = Typography;
export const InBalance: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const baseColumns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns(),
    storeColumns({
      valueType: 'select',
      valueEnum,
      hideInTable: true,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    indexColumns,
    skuCodeColumns,
    skuIdColumns({}),
    cateIdColumns(),
    baseUnitIdColumns,
    secondUnitColumns,
    memoColumns(),
  ];
  const [columns, setColumns] = useState<ProColumns<PUR.PurchaseOrder>[]>(baseColumns);
  const [scrollX, setScrollX] = useState<number>(2500);
  const [summary, setSummary] = useState<Record<string, number>[]>();
  const [stockColumns, setStockColumns] = useState<string[]>();
  return (
    <ProTable
      rowKey="autoId"
      pagination={false}
      bordered
      options={false}
      columns={columns}
      search={{
        defaultCollapsed: false,
      }}
      scroll={{ x: scrollX }}
      request={async (params) => {
        const response = await storeReports(
          {
            queryFilter: params,
          },
          undefined,
          '/report/stock/invBalanceDetail',
        );
        const scs: ProColumns<PUR.PurchaseOrder>[] = response.data.columns
          ? response.data.columns.map((s, _index) => {
              return _index === 0
                ? {
                    title: s,
                    children: [
                      {
                        dataIndex: ['storeList', _index, 'qty'],
                        search: false,
                        title: '基本数量',
                        width: 105,
                      },
                      {
                        dataIndex: ['storeList', _index, 'secondQty'],
                        search: false,
                        title: '副单位数',
                        width: 105,
                      },
                      {
                        dataIndex: ['storeList', _index, 'unitCost'],
                        search: false,
                        title: '单位成本',
                        width: 105,
                      },
                      {
                        dataIndex: ['storeList', _index, 'cost'],
                        search: false,
                        title: '成本',
                        width: 105,
                      },
                    ],
                  }
                : {
                    title: s,
                    children: [
                      {
                        dataIndex: ['storeList', _index, 'qty'],
                        search: false,
                        title: '基本数量',
                        width: 105,
                      },
                      {
                        dataIndex: ['storeList', _index, 'secondQty'],
                        search: false,
                        title: '副单位数',
                        width: 105,
                      },
                    ],
                  };
            })
          : [];
        setStockColumns(response.data.columns);
        setColumns(baseColumns.concat(scs));
        setScrollX(scs.length * 400 + 1000);
        if (response.data.summary instanceof Array) {
          setSummary(response.data.summary);
        }
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
      summary={() => {
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0}>合计</Table.Summary.Cell>
            <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={4} />
            {stockColumns?.map((s, i) =>
              i === 0 ? (
                <>
                  <Table.Summary.Cell index={10 + i}>
                    <Text type="danger">{summary?.[i].qty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={10 + i} />
                  <Table.Summary.Cell index={10 + i}>
                    <Text type="danger">{summary?.[i].unitCost}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={10 + i}>
                    <Text type="danger">{summary?.[i].cost}</Text>
                  </Table.Summary.Cell>
                </>
              ) : (
                <>
                  <Table.Summary.Cell index={10 + i}>
                    <Text type="danger">{summary?.[i].qty}</Text>
                  </Table.Summary.Cell>
                  <Table.Summary.Cell index={10 + i} />
                </>
              ),
            )}
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export const DeliverDetail: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns(),
    storeColumns({
      valueType: 'select',
      valueEnum,
      hideInTable: true,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    indexColumns,
    skuIdColumns({}),
    cateIdColumns(),
    billNoColumns(),
    bussTypeColumns(),

    {
      dataIndex: 'buName',
      title: '往来单位',
      search: false,
      width: 155,
    },
    unitIdColumns,
    memoColumns(),
    {
      title: '入库',
      key: 'in',
      children: [
        {
          valueType: 'digit',
          title: '入库数量',
          dataIndex: 'inQty',
        },
        {
          valueType: 'digit',
          title: '基本单位数量',
          dataIndex: 'baseInQty',
        },
        {
          title: '单位成本',
          dataIndex: 'inUnitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'inCost',
          valueType: 'money',
        },
      ],
    },
    {
      title: '出库',
      key: 'out',
      children: [
        {
          valueType: 'digit',
          title: '出库数量',
          dataIndex: 'outQty',
        },
        {
          valueType: 'digit',
          title: '基本单位数量',
          dataIndex: 'baseOutQty',
        },
        {
          title: '单位成本',
          dataIndex: 'outUnitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'outCost',
          valueType: 'money',
        },
      ],
    },
    {
      title: '结存',
      key: 'jc',
      children: [
        {
          title: '基本单位数量',
          valueType: 'digit',
          dataIndex: 'totalQty',
        },
        {
          title: '单位成本',
          dataIndex: 'totalUnitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'totalCost',
          valueType: 'money',
        },
      ],
    },
  ];
  const [summary, setSummary] = useState<Record<string, number>>();
  return (
    <ProTable
      rowKey="autoId"
      pagination={{ pageSize: 500 }}
      bordered
      scroll={{ x: 2500, y: 500 }}
      options={false}
      columns={columns}
      request={async (params) => {
        const response = await storeRowResponseReports(
          {
            pageNumber: params.current,
            pageSize: params.pageSize,
            queryFilter: params,
          },
          undefined,
          '/report/stock/deliverDetail',
        );
        setSummary(response.data.rows.summary);
        return {
          data: response.data.rows.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
      postData={(v) => v.filter((i) => i.autoId)}
      summary={() => {
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={5} />
            <Table.Summary.Cell index={3} />
            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.baseInQty}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} />

            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.inCost}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} />
            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.baseOutQty}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} />

            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.outCost}</Text>
            </Table.Summary.Cell>

            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.totalQty}</Text>
            </Table.Summary.Cell>
            <Table.Summary.Cell index={4} />
            <Table.Summary.Cell index={4}>
              <Text type="danger">{summary?.totalCost}</Text>
            </Table.Summary.Cell>
          </Table.Summary.Row>
        );
      }}
    />
  );
};

export const DeliverSummary: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    cateIdColumns(),
    skuIdColumns(),
    storeColumns({
      valueType: 'select',
      valueEnum,
      hideInTable: true,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    unitIdColumns,
  ];
  const [fColumns, setFColumns] = useState<ProColumns<PUR.PurchaseOrder>[]>([]);
  const [summary, setSummary] = useState<Record<string, number>[]>();

  return (
    <ProTable
      rowKey="autoId"
      pagination={false}
      bordered
      options={false}
      columns={fColumns}
      scroll={{ x: 2500, y: 500 }}
      request={async (params) => {
        const response = await storeReports(
          transProTableParamsToMyRequest(params),
          undefined,
          '/report/stock/deliverSummary',
        );
        setFColumns(() => {
          return columns.concat(
            response.data.columns?.map((item, index) => ({
              title: item,
              children: [
                {
                  title: '数量',
                  dataIndex: ['bussTypeList', index, 'qty'],
                },
                {
                  title: '成本',
                  dataIndex: ['bussTypeList', index, 'cost'],
                },
              ],
            })) || [],
          );
        });
        if (response.data.summary instanceof Array) {
          setSummary(response.data.summary);
        }
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
      summary={() => {
        return (
          <Table.Summary.Row>
            <Table.Summary.Cell index={0} />
            <Table.Summary.Cell index={1}>合计</Table.Summary.Cell>
            <Table.Summary.Cell index={2} colSpan={3} />
            {summary?.map((s) => (
              <>
                <Table.Summary.Cell index={3}>
                  <Text type={'danger'}>{s.qty}</Text>
                </Table.Summary.Cell>
                <Table.Summary.Cell index={3}>
                  <Text type={'danger'}>{s.cost}</Text>
                </Table.Summary.Cell>
              </>
            ))}
          </Table.Summary.Row>
        );
      }}
    />
  );
};

// 序列号跟踪表
export const SerNumDetail: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    dateRangeColumns(),
    indexColumns,
    skuIdColumns(),
    spuCodeColumns,
    {
      title: '序列号',
      dataIndex: 'serNum',
      fixed: 'left',
      search: false,
    },
    storeColumns({
      valueType: 'select',
      valueEnum,
      search: false,
    }),
    bussTypeColumns({
      fieldProps: {
        mode: 'multiple',
      },
    }),
    {
      title: '客户/供应商',
      dataIndex: 'contactName',
      search: false,
    },
    billNoColumns(),
    {
      dataIndex: 'status',
      title: '状态',
      valueEnum: new Map([
        [1, { text: '在库', status: 'Success' }],
        [0, { text: '已出库', status: 'Processing' }],
      ]),
    },
  ];
  return (
    <ProTable
      rowKey="autoId"
      pagination={{ pageSize: 10 }}
      bordered
      options={false}
      columns={columns}
      request={async (params) => {
        const response = await storeReports(
          transProTableParamsToMyRequest(params),
          undefined,
          '/report/stock/serNumTrace',
        );
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};
// 序列号状态表
export const SerNumStatus: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    cateIdColumns({
      hideInTable: true,
    }),
    indexColumns,
    {
      title: '最后业务日期',
      dataIndex: 'dateStr',
      search: false,
    },
    skuIdColumns({}),
    spuCodeColumns,
    {
      title: '序列号',
      dataIndex: 'serNum',
      fixed: 'left',
      search: false,
    },
    {
      dataIndex: 'status',
      title: '状态',
      initialValue: 1,
      valueEnum: new Map([
        [1, { text: '在库', status: 'Success' }],
        [0, { text: '已出库', status: 'Processing' }],
      ]),
    },
    storeColumns({
      valueType: 'select',
      valueEnum,
      fieldProps: {
        mode: 'multiple',
      },
    }),
    bussTypeColumns({
      search: false,
    }),
    {
      title: '客户/供应商',
      dataIndex: 'contactName',
      search: false,
    },
  ];
  return (
    <ProTable
      rowKey="autoId"
      pagination={{ pageSize: 10 }}
      bordered
      options={false}
      columns={columns}
      request={async (params) => {
        const response = await storeReports(
          transProTableParamsToMyRequest(params),
          undefined,
          '/report/stock/serNumStatus',
        );
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};

export default () => {
  return (
    <GlobalWrapper type={'list'}>
      <PageContainer
        content={
          <ProCard
            tabs={{
              defaultActiveKey: 'tab5',
            }}
          >
            <ProCard.TabPane key="tab1" tab="商品库存余额表">
              <InBalance />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab2" tab="商品收发明细表">
              <DeliverDetail />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab3" tab="商品收发汇总表">
              <DeliverSummary />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab4" tab="序列号跟踪表">
              <SerNumDetail />
            </ProCard.TabPane>
            <ProCard.TabPane key="tab5" tab="序列号状态表">
              <SerNumStatus />
            </ProCard.TabPane>
          </ProCard>
        }
      />
    </GlobalWrapper>
  );
};
