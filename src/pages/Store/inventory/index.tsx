import React, { useRef } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  baseSearch,
  cateIdColumns,
  dateRangeColumns,
  fixWdithColumns,
  indexColumns,
  optionColumns,
  storeColumns,
} from '@/utils/columns';
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
import { transProTableParamsToMyRequest } from '@/utils/utils';

export const InventoryTable: React.FC = () => {
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<STORE.invOiForm>[] = [
    indexColumns,
    dateRangeColumns({
      dataIndex: 'pdDate',
      title: '盘点时间',
    }),
    storeColumns({
      valueEnum: storeEnum,
      valueType: 'select',
    }),
    cateIdColumns({
      hideInTable: true,
    }),

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
        const res = await queryPdRecordList(transProTableParamsToMyRequest(params));
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
