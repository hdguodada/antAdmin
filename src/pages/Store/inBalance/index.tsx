import { inBalance } from '@/services/Store/serNum';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import React, { useState } from 'react';
import {
  baseUnitIdColumns,
  cateIdColumns,
  codeColumns,
  indexColumns,
  memoColumns,
  secondUnitColumns,
  skuIdColumns,
} from '@/utils/columns';
import { useModel } from '@@/plugin-model/useModel';

export default () => {
  const { valueEnum } = useModel('store', (model) => ({ valueEnum: model.valueEnum }));
  const baseColumns: ProColumns<PUR.PurchaseOrder>[] = [
    {
      title: '库存日期',
      dataIndex: 'date',
      valueType: 'date',
      hideInTable: true,
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
    <PageContainer
      content={
        <ProTable
          rowKey="autoId"
          pagination={false}
          columns={columns}
          search={{
            defaultCollapsed: false,
            span: 5,
          }}
          request={async (params) => {
            const response = await inBalance(params);
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
      }
    ></PageContainer>
  );
};
