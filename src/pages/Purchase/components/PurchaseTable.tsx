import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { history } from 'umi';
import type { AdvancedSearchFormField } from '@/utils/columns';
import { OrderTableColumns } from '@/utils/columns';
import { AdvancedSearch, AdvancedSearchForm } from '@/utils/columns';
import { showSysInfo } from '@/components/SysInfo';
import { CheckButton, OpenButton } from '../../../components/CheckButton';
import { BussType, BussTypeComponentUrl } from '.';
import Style from '@/global.less';
import { delPurchase } from '@/services/Purchase';
import { PageContainer } from '@ant-design/pro-layout';
import { transProTableParamsToMyRequest } from '@/utils/utils';

export type OrderTableProps<T> = {
  url: string; // 接口地址
  checkUrl: string;
  openCloseFn?: any;
  del: (data: React.Key[]) => Promise<any>;
  queryList: (data: QueryRequest<any>, url?: string) => Promise<RowResponse<T>>;
  componentUrl: string; // 模块地址
  initSearch?: AdvancedSearchFormField; // 初始化搜索条件
  dev?: string;
  bussType: BussType;
};

export default function OrderTable<T extends Record<string, unknown>>(props: OrderTableProps<T>) {
  const { url, checkUrl, openCloseFn, queryList, componentUrl, initSearch, dev, bussType } = props;
  const columns = OrderTableColumns<T>({
    bussType,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues, setAdvancedSearchFormValues] = useState<
    AdvancedSearchFormField | undefined
  >(initSearch);
  return (
    <PageContainer
      title={false}
      content={
        <ProTable<T, AdvancedSearchFormField>
          rowKey="billId"
          rowSelection={{}}
          options={false}
          rowClassName={(record) => {
            if (record.bussType === BussType.采购退货订单) {
              return Style['error-color'];
            }
            return '';
          }}
          scroll={{ x: 2500 }}
          params={advancedSearchFormValues}
          actionRef={actionRef}
          search={AdvancedSearch({
            fn: () => {
              history.push({
                pathname: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
                query: {
                  suppId: (initSearch?.suppId?.[0] || '').toString(),
                },
              });
            },
            jsxList: [
              <AdvancedSearchForm
                key="AdvancedSearchForm"
                value={advancedSearchFormValues}
                onChange={(value) => {
                  setAdvancedSearchFormValues(value);
                }}
                bussType={bussType}
              />,
            ],
            searchConfig: {
              span: 6,
            },
            myReset: () => {
              setAdvancedSearchFormValues(undefined);
            },
          })}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                history.push(`${url}/${record.billId}`);
              },
            };
          }}
          tableAlertOptionRender={({ selectedRowKeys }) => {
            return (
              <Space size={16}>
                <CheckButton
                  url={checkUrl}
                  selectedRowKeys={selectedRowKeys}
                  actionRef={actionRef}
                />
                {openCloseFn && (
                  <OpenButton
                    selectedRowKeys={selectedRowKeys}
                    fn={openCloseFn}
                    actionRef={actionRef}
                  />
                )}

                <Button
                  danger
                  onClick={async () => {
                    const res = await delPurchase(selectedRowKeys, `${url}/del`);
                    showSysInfo(res);
                    actionRef.current?.reload();
                  }}
                >
                  批量删除
                </Button>
              </Space>
            );
          }}
          beforeSearchSubmit={(params) => {
            return {
              ...params,
              status: params.billStatus ?? [],
            };
          }}
          columns={columns}
          request={async (params) => {
            const response = await queryList(
              transProTableParamsToMyRequest({
                ...params,
                dev,
              }),
              `${url}/list`,
            );
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          pagination={{ pageSize: 10 }}
        />
      }
    />
  );
}
