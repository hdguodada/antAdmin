import ProCard from '@ant-design/pro-card';
import React, { useState } from 'react';
import GlobalWrapper from '@/components/GlobalWrapper';
import { PageContainer } from '@ant-design/pro-layout';
import { storeReports } from '@/services/Store/serNum';
import { useModel } from 'umi';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  indexColumns,
  codeColumns,
  skuIdColumns,
  baseUnitIdColumns,
  secondUnitColumns,
  memoColumns,
  cateIdColumns,
  unitIdColumns,
  spuCodeColumns,
  billNoColumns,
} from '@/utils/columns';
import moment from 'moment';
import { BussType, BussTypeEnum } from '@/pages/Purchase/components';

export const InBalance: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const baseColumns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      hideInTable: true,
      initialValue: [moment().startOf('month'), moment()],
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      hideInTable: true,
      valueType: 'select',
      valueEnum,
    },
    indexColumns,
    codeColumns,
    skuIdColumns,
    cateIdColumns,
    baseUnitIdColumns,
    secondUnitColumns,
    memoColumns(),
  ];
  const [columns, setColumns] = useState<ProColumns<PUR.PurchaseOrder>[]>(baseColumns);
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
      request={async (params) => {
        const response = await storeReports(params, undefined, '/bas/store/inBalance');
        const storeColumns: ProColumns<PUR.PurchaseOrder>[] = response.data.columns
          ? response.data.columns.map((s, _index) => {
              return _index === 0
                ? {
                    title: s,
                    children: [
                      {
                        dataIndex: ['storeList', _index, 'qty'],
                        search: false,
                        title: '基本数量',
                      },
                      {
                        dataIndex: ['storeList', _index, 'secondQty'],
                        search: false,
                        title: '副单位数',
                      },
                      {
                        dataIndex: ['storeList', _index, 'unitCost'],
                        search: false,
                        title: '单位成本',
                      },
                      {
                        dataIndex: ['storeList', _index, 'cost'],
                        search: false,
                        title: '成本',
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
                      },
                      {
                        dataIndex: ['storeList', _index, 'secondQty'],
                        search: false,
                        title: '副单位数',
                      },
                    ],
                  };
            })
          : [];
        setColumns(baseColumns.concat(storeColumns));
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};

export const DeliverDetail: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
      render: (_, record) => <div>{record.date}</div>,
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      hideInTable: true,
      valueType: 'select',
      valueEnum,
    },
    indexColumns,
    codeColumns,
    skuIdColumns,
    cateIdColumns,
    {
      dataIndex: 'billNo',
      title: '单据号',
      search: false,
    },
    {
      dataIndex: 'bussType',
      title: '业务类别',
      search: false,
      valueEnum: BussTypeEnum,
    },
    {
      dataIndex: 'buName',
      title: '往来单位',
      search: false,
    },
    unitIdColumns,
    memoColumns(),
    {
      title: '入库',
      children: [
        {
          valueType: 'digit',
          title: '入库数量',
          dataIndex: 'inqty',
        },
        {
          valueType: 'digit',
          title: '基本单位数量',
          dataIndex: 'baseInQty',
        },
        {
          title: '单位成本',
          dataIndex: 'inunitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'incost',
          valueType: 'money',
        },
      ],
    },
    {
      title: '入库',
      children: [
        {
          valueType: 'digit',
          title: '出库数量',
          dataIndex: 'outqty',
        },
        {
          valueType: 'digit',
          title: '基本单位数量',
          dataIndex: 'baseOutQty',
        },
        {
          title: '单位成本',
          dataIndex: 'outunitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'outcost',
          valueType: 'money',
        },
      ],
    },
    {
      title: '结存',
      children: [
        {
          title: '基本单位数量',
          valueType: 'digit',
          dataIndex: 'totalqty',
        },
        {
          title: '单位成本',
          dataIndex: 'totalunitCost',
          valueType: 'money',
        },
        {
          title: '成本',
          dataIndex: 'totalcost',
          valueType: 'money',
        },
      ],
    },
  ];
  return (
    <ProTable
      rowKey="autoId"
      pagination={false}
      bordered
      scroll={{ x: 2500 }}
      options={false}
      columns={columns}
      search={{
        defaultCollapsed: false,
      }}
      request={async (params) => {
        const response = await storeReports(params, undefined, '/bas/store/deliverDetail');
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};

export const DeliverSummary: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    cateIdColumns,
    codeColumns,
    skuIdColumns,
    {
      title: '仓库',
      dataIndex: 'storeCd',
      valueType: 'select',
      valueEnum,
      render: (_, record) => <div>{record.storeName}</div>,
    },
    unitIdColumns,
  ];
  const [fColumns, setFColumns] = useState<ProColumns<PUR.PurchaseOrder>[]>([]);
  return (
    <ProTable
      rowKey="autoId"
      pagination={false}
      bordered
      options={false}
      columns={fColumns}
      search={{
        defaultCollapsed: false,
      }}
      scroll={{ x: 2500 }}
      request={async (params) => {
        const response = await storeReports(params, undefined, '/bas/store/deliverSummary');
        setFColumns(() => {
          return columns.concat(
            response.data.columns?.map((item, index) => ({
              title: item,
              children: [
                {
                  title: '数量',
                  dataIndex: ['summary', index, 'qty'],
                },
                {
                  title: '成本',
                  dataIndex: ['summary', index, 'cost'],
                },
              ],
            })) || [],
          );
        });
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
};

// 序列号跟踪表
export const SerNumDetail: React.FC = () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '单据日期',
      dataIndex: 'date',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      render: (_, record) => <div>{record.date}</div>,
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
    },
    indexColumns,
    codeColumns,
    skuIdColumns,
    spuCodeColumns,
    {
      title: '序列号',
      dataIndex: 'serNum',
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      valueType: 'select',
      valueEnum,
      render: (_, record) => <div>{record.storeName}</div>,
    },

    {
      dataIndex: 'bussType',
      title: '业务类别',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: typeOption('BussType'),
    },
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
      pagination={false}
      bordered
      options={false}
      columns={columns}
      search={{
        defaultCollapsed: false,
      }}
      request={async (params) => {
        const response = await storeReports(params, undefined, '/bas/store/serNumDetail');
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
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.valueEnum }));
  const columns: ProColumns<PUR.PurchaseOrder>[] = [
    indexColumns,
    {
      title: '最后业务日期',
      dataIndex: 'date',
      search: false,
    },
    codeColumns,
    skuIdColumns,
    spuCodeColumns,
    {
      title: '序列号',
      dataIndex: 'serNum',
    },
    {
      dataIndex: 'status',
      title: '状态',
      valueEnum: new Map([
        [1, { text: '在库', status: 'Success' }],
        [0, { text: '已出库', status: 'Processing' }],
      ]),
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      valueType: 'select',
      valueEnum,
      render: (_, record) => <div>{record.storeName}</div>,
    },

    {
      dataIndex: 'bussType',
      title: '业务类别',
      valueType: 'select',
      fieldProps: {
        mode: 'multiple',
      },
      valueEnum: typeOption('BussType'),
    },
    {
      title: '客户/供应商',
      dataIndex: 'contactName',
      search: false,
    },
  ];
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
      request={async (params) => {
        const response = await storeReports(params, undefined, '/bas/store/serNumStatus');
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
          <ProCard tabs={{}}>
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
