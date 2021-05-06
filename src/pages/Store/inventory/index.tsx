import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { baseSearch, indexColumns, optionColumns, srcOrderColumns } from '@/utils/columns';
import type { FormInstance } from 'antd';
import { TreeSelect } from 'antd';
import { queryPdRecordList } from '@/services/Store';
import { DatePicker } from 'antd';
import moment from 'moment';
import GlobalWrapper from '@/components/GlobalWrapper';
import { history, useModel } from 'umi';
import { BussTypeComponentUrl } from '@/pages/Purchase/components';

export const InventoryTable: React.FC = () => {
  const { options } = useModel('store', (model) => ({ options: model.options }));
  const { treeDataSimpleMode } = useModel('productType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const columns: ProColumns<STORE.invOiResponse>[] = [
    indexColumns,
    {
      dataIndex: 'pdDate',
      valueType: 'date',
      title: '盘点时间',
      renderFormItem: () => (
        <DatePicker.RangePicker defaultValue={[moment().startOf('month'), moment()]} />
      ),
    },
    {
      dataIndex: 'storeCd',
      title: '仓库',
      hideInTable: true,
      request: async () => {
        return options;
      },
    },
    {
      dataIndex: 'cateId',
      title: '商品类别',
      hideInTable: true,
      renderFormItem: () => (
        <TreeSelect
          showSearch
          style={{ width: '100%' }}
          dropdownStyle={{ maxHeight: 400, overflow: 'auto' }}
          allowClear
          treeDefaultExpandAll
          treeData={treeDataSimpleMode}
        />
      ),
    },
    {
      dataIndex: 'billNo',
      title: '盘点编号',
      search: false,
    },
    {
      dataIndex: 'locationName',
      title: '盘点仓库',
      search: false,
    },
    srcOrderColumns({
      title: '盘点结果',
      dataIndex: 'pdResult',
      url: '',
      hideInTable: false,
    }),
    optionColumns({
      modify: async ({ record }) => {
        history.push(`${BussTypeComponentUrl.盘点}/${record.billId}`);
      },
      del: async () => {},
    }),
  ];
  const formRef = useRef<FormInstance<STORE.invOiParams>>();

  return (
    <ProTable<STORE.invOiResponse, STORE.invOiParams>
      columns={columns}
      rowKey="billId"
      formRef={formRef}
      options={false}
      pagination={{ pageSize: 10 }}
      request={async (params) => {
        const res = await queryPdRecordList(params);
        return {
          data: res.data.rows,
          success: res.code === 0,
        };
      }}
      search={baseSearch({
        url: `${BussTypeComponentUrl.盘点}/new`,
      })}
    />
  );
};

const Inventory: React.FC = () => {
  return (
    <GlobalWrapper type={'list'}>
      <PageContainer content={<InventoryTable />} />
    </GlobalWrapper>
  );
};
export default Inventory;
