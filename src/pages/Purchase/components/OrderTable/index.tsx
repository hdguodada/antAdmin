import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import { Button, Space } from 'antd';
import { PageContainer } from '@ant-design/pro-layout';
import { history } from 'umi';
import type { AdvancedSearchFormField } from '@/utils/columns';
import { OrderTableColumns } from '@/utils/columns';
import { AdvancedSearch, AdvancedSearchForm } from '@/utils/columns';
import { showSysInfo } from '@/components/SysInfo';
import { CheckButton, OpenButton } from '../../../../components/CheckButton';
import moment from 'moment';
import { BussType } from '..';
import Style from '@/global.less';
import { delPurchase } from '@/services/Purchase';

export type OrderTableProps<T> = {
  url: string; // 接口地址
  checkUrl: string;
  openCloseFn: any;
  del: (data: React.Key[]) => Promise<any>;
  queryList: (data: QueryRequest<any>, url?: string) => Promise<RowResponse<T>>;
  componentUrl: string; // 模块地址
  initSearch?: {
    bussType: BussType[];
  }; // 初始化搜索条件
  dev?: boolean;
  bussType: BussType;
};

export default <T extends Record<string, unknown>>(props: OrderTableProps<T>) => {
  const {
    url,
    checkUrl,
    openCloseFn,
    queryList,
    componentUrl,
    initSearch,
    dev = false,
    bussType,
  } = props;
  const columns = OrderTableColumns<T>({
    url,
    componentUrl,
    bussType,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues, setAdvancedSearchFormValues] = useState<
    AdvancedSearchFormField | undefined
  >(initSearch);
  return (
    <PageContainer
      content={
        <ProTable<T, AdvancedSearchFormField>
          rowKey="billId"
          rowSelection={{}}
          options={false}
          rowClassName={(record) => {
            if (record.bussType === BussType.购货退货订单) {
              return Style['error-color'];
            }
            return '';
          }}
          params={advancedSearchFormValues}
          actionRef={actionRef}
          search={AdvancedSearch({
            url: `${componentUrl || url}/new`,
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
            other: {
              defaultCollapsed: false,
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
                <OpenButton
                  selectedRowKeys={selectedRowKeys}
                  fn={openCloseFn}
                  actionRef={actionRef}
                />
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
              beginDate: params.date?.[0] ?? moment().startOf('month').format('YYYY-MM-DD'),
              endDate: params.date?.[1] ?? moment().format('YYYY-MM-DD'),
              status: params.billStatus ?? [],
            };
          }}
          columns={columns}
          request={async (params) => {
            const response = await queryList(
              {
                ...params,
                pageNumber: params.current,
                queryFilter: params,
                dev,
              },
              `${url}/list`,
            );
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
        />
      }
    />
  );
};