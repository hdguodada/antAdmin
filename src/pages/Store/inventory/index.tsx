import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { baseSearch, fixWdithColumns, indexColumns, optionColumns } from '@/utils/columns';
import type { FormInstance } from 'antd';
import { Button, Dropdown, Menu, Space } from 'antd';
import { TreeSelect } from 'antd';
import { delPdRecordList, queryPdRecordList } from '@/services/Store';
import moment from 'moment';
import GlobalWrapper from '@/components/GlobalWrapper';
import { history, useModel } from 'umi';
import { BussTypeComponentUrl } from '@/pages/Purchase/components';
import { DownOutlined } from '@ant-design/icons';
import { showSysInfo } from '@/components/SysInfo';
import { delPurchase } from '@/services/Purchase';

export const InventoryTable: React.FC = () => {
  const { treeDataSimpleMode } = useModel('productType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<STORE.invOiForm>[] = [
    indexColumns,
    {
      dataIndex: 'pdDate',
      title: '盘点时间',
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
      render: (_, record) => <div>{record.pdDateStr}</div>,
      search: {
        transform: (value) => ({
          beginDate: value[0],
          endDate: value[1],
        }),
      },
      width: 105,
    },
    {
      title: '仓库',
      dataIndex: 'storeCd',
      editable: false,
      render: (_, record) => <div>{record.storeName}</div>,
      width: 105,
      valueEnum: storeEnum,
      valueType: 'select',
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
      width: 105,
    },

    {
      title: '盘点结果',
      hideInTable: false,
      width: 255,
      dataIndex: 'pdResult',
      render: (_, record) => {
        if (record && record.pdResult && record.pdResult.length > 0) {
          const menu = (
            <Menu>
              {record.pdResult.map((item) => (
                <Menu.Item key={item.billId}>
                  <a
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => {
                      if (item.billNo.startsWith('盘盈')) {
                        history.push(`${BussTypeComponentUrl.其他入库单}/${item.billId}`);
                      }
                      if (item.billNo.startsWith('盘亏')) {
                        history.push(`${BussTypeComponentUrl.其他出库单}/${item.billId}`);
                      }
                      return false;
                    }}
                  >
                    {item.billNo}
                  </a>
                </Menu.Item>
              ))}
            </Menu>
          );
          return (
            <Dropdown overlay={menu}>
              <div>
                {record.pdResult[0].billNo}
                <DownOutlined />
              </div>
            </Dropdown>
          );
        }
        return '-';
      },
    },

    optionColumns({
      modify: async ({ record }) => {
        history.push(`${BussTypeComponentUrl.盘点}/${record.billId}`);
      },
      del: async ({ record }) => {
        await delPdRecordList([record.billId]);
      },
    }),
    fixWdithColumns(),
  ];
  const formRef = useRef<FormInstance<STORE.invOiParams>>();
  const actionRef = useRef<ActionType>();

  return (
    <ProTable<STORE.invOiForm, STORE.invOiParams>
      columns={columns}
      rowKey="billId"
      formRef={formRef}
      actionRef={actionRef}
      options={false}
      rowSelection={{}}
      tableAlertOptionRender={({ selectedRowKeys }) => {
        return (
          <Space size={16}>
            <Button
              danger
              onClick={async () => {
                const res = await delPurchase(selectedRowKeys, `/bis/stockInventory/del`);
                showSysInfo(res);
                actionRef.current?.reload();
              }}
            >
              批量删除
            </Button>
          </Space>
        );
      }}
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
      <PageContainer title={false} content={<InventoryTable />} />
    </GlobalWrapper>
  );
};
export default Inventory;
