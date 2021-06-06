import type { FormInstance } from 'antd';
import { Button, message, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest, history, useModel } from 'umi';
import {
  addPurchase,
  delPurchase,
  queryPurchase,
  queryPurchaseInfo,
  updPurchase,
} from '@/services/Purchase';
import type { AdvancedSearchFormField } from '@/utils/columns';
import { bussTypeColumns, dateRangeColumns, qtyWithSNColumns } from '@/utils/columns';
import {
  AdvancedSearch,
  AdvancedSearchForm,
  billNoColumns,
  checkName,
  checkStatusColumns,
  crtNameColumns,
  currentQtyColumns,
  indexColumns,
  keywordColumns,
  memoColumns,
  optionColumns,
  skuIdColumns,
  totalAmountColumns,
} from '@/utils/columns';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import {
  calAmountTitle,
  calPriceTitle,
  CheckAudit,
  GenerateButton,
  SkuSelect,
  StockType,
  StoreSelectChangeCurrentQty,
  SupplierSelect,
} from '@/pages/Purchase/components';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  getOrderType,
  OrderType,
} from '@/pages/Purchase/components';
import Style from '@/global.less';
import { CheckButton, CheckTwoButton, OpenButton } from '@/components/CheckButton';
import { showSysInfo } from '@/components/SysInfo';
import moment from 'moment';
import { getCode } from '@/services/Sys';
import { calPrice, transProTableParamsToMyRequest } from '@/utils/utils';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { patternMsg } from '@/utils/validator';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import type { XhddEntriesProps } from '@/pages/Sales/components';

export const StoreTableColumns = ({
  bussType,
}: {
  bussType: BussType;
}): ProColumns<PUR.Purchase>[] => {
  const base: ProColumns<PUR.Purchase>[] = [
    keywordColumns({ placeholder: '请输入编号或者客户名称查询' }),
    indexColumns,
    dateRangeColumns({
      dataIndex: 'date',
    }),
    billNoColumns({
      fixed: 'left',
      bussType,
    }),
    crtNameColumns(),
    checkName(),
    memoColumns(),
    optionColumns({
      modify: async ({ record }) => {
        history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${record.billId}`);
      },
      del: async ({ record }) => {
        const res = await delPurchase(
          [(record as any).billId],
          `${BussTypeApiUrl[BussType[bussType]]}/del`,
        );
        showSysInfo(res);
      },
    }),
    checkStatusColumns({
      search: false,
    }),
  ];
  return bussType === BussType.调拨单
    ? base.concat([
        {
          title: '调拨信息',
          children: [
            { k: 'skuName', t: '商品' },
            { k: 'qty', t: '数量' },
            { k: 'unitName', t: '单位' },
            { k: 'inStoreName', t: '调入仓库' },
            { k: 'outStoreName', t: '调出仓库' },
            { k: 'memo', t: '分录备注' },
          ].map((i) => ({
            title: i.t,
            dataIndex: 'items',
            align: 'center',
            render: (_, record) => (
              <ProCard ghost split="horizontal">
                {record.items?.map((item) => (
                  <ProCard layout="center" ghost style={{ padding: '3px' }} key={item[i.k]}>
                    {item[i.k]}
                  </ProCard>
                ))}
              </ProCard>
            ),
          })),
        },
      ])
    : base.concat([
        bussTypeColumns(),
        {
          title: () => (bussType === BussType.其他入库单 ? '供应商' : '客户'),
          dataIndex: 'contactName',
          search: false,
          width: 155,
        },
        totalAmountColumns({
          title: '金额',
        }),
      ]);
};

export type StoreTableProps = {
  openCloseFn?: any;
  initSearch?: AdvancedSearchFormField; // 初始化搜索条件
  dev?: string;
  bussType: BussType;
};
export function StoreTable(props: StoreTableProps) {
  const { openCloseFn, initSearch, dev, bussType } = props;
  const columns = StoreTableColumns({
    bussType,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues, setAdvancedSearchFormValues] =
    useState<AdvancedSearchFormField | undefined>(initSearch);
  return (
    <PageContainer
      title={false}
      content={
        <ProTable<PUR.Purchase, AdvancedSearchFormField>
          rowKey="billId"
          rowSelection={{}}
          options={false}
          rowClassName={(record) => {
            if (record.bussType === BussType.采购退货订单) {
              return Style['error-color'];
            }
            return '';
          }}
          bordered
          scroll={{ x: 2500 }}
          params={advancedSearchFormValues}
          actionRef={actionRef}
          search={AdvancedSearch({
            url: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
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
              defaultCollapsed: false,
            },
            myReset: () => {
              setAdvancedSearchFormValues(undefined);
            },
          })}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${record.billId}`);
              },
            };
          }}
          tableAlertOptionRender={({ selectedRowKeys }) => {
            return (
              <Space size={16}>
                <CheckButton
                  url={`${BussTypeApiUrl[BussType[bussType]]}/check`}
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
                    const res = await delPurchase(
                      selectedRowKeys,
                      `${BussTypeApiUrl[BussType[bussType]]}/del`,
                    );
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
            const response = await queryPurchase(
              transProTableParamsToMyRequest({
                ...params,
                dev,
              }),
              `${BussTypeApiUrl[BussType[bussType]]}/list`,
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
}

export enum BussCodeId {
  其他入库单 = 'QTRK',
  其他出库单 = 'QTCK',
  调拨单 = 'TBD',
}

export type StoreFormProps = {
  bussType: BussType; // 业务类型
  dev?: string; // 是否开发
  id: K; // page params
  query: Record<string, string>;
  inventoryInfo?: STORE.invOiForm;
};
export const StoreEntries = ({
  bussType,
  checked,
  formRef,
  value,
  onChange,
  rest,
}: XhddEntriesProps) => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
  const { storeEnum } = useModel('store', (model) => ({ storeEnum: model.valueEnum }));
  const columns: ProColumns<PUR.Entries>[] = [
    indexColumns,
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      fixed: 'left',
      render: (text, record, _index, action) => [
        <Button
          key="editable"
          type="text"
          disabled={checked}
          onClick={() => {
            action.startEditable?.(record.autoId);
          }}
        >
          编辑
        </Button>,
      ],
    },
    skuIdColumns({ search: false, editable: false }),
    {
      title: () => (
        <div>
          <span className="error-color">*</span>单位
        </div>
      ),
      dataIndex: 'unitId',
      render: (_, record) => <div>{record.unitName}</div>,
      renderFormItem: ({ index }) => {
        const entries: PUR.Entries[] = formRef.current?.getFieldValue('entries');
        if (entries[index as number].unitList) {
          return (
            <Select
              style={{ width: '216px' }}
              options={entries[index as number].unitList?.map((unit) => ({
                label: unit.unitName,
                value: unit.unitId,
              }))}
            />
          );
        }
        return <div>{entries[index as number].unitName}</div>;
      },
    },
    {
      dataIndex: 'outStoreCd',
      title: '调出仓库',
      render: (_, record) => <div>{record.outStoreName}</div>,
      renderFormItem: ({ index }) => {
        const entries: PUR.Entries[] = formRef.current?.getFieldValue('entries');
        return index !== undefined ? (
          <StoreSelectChangeCurrentQty entries={entries} index={index} formRef={formRef} />
        ) : (
          ''
        );
      },
      hideInTable: bussType !== BussType.调拨单,
    },
    currentQtyColumns(),
    qtyWithSNColumns(
      value,
      bussType === BussType.其他入库单 ? StockType.入库 : StockType.出库,
      checked,
    ),
    {
      title: () => (
        <div>
          <span className="error-color">*</span>仓库
        </div>
      ),
      width: 150,
      dataIndex: 'storeCd',
      render: (_, record) => <div>{record.storeName}</div>,
      renderFormItem: ({ index }) => {
        const entries: PUR.Entries[] = formRef.current?.getFieldValue('entries');
        return index !== undefined ? (
          <StoreSelectChangeCurrentQty entries={entries} index={index} formRef={formRef} />
        ) : (
          ''
        );
      },
      hideInTable: bussType === BussType.调拨单,
    },
    {
      title: () => (
        <div>
          <span className="error-color">*</span>
          {calPriceTitle(bussType)}
        </div>
      ),
      dataIndex: 'price',
      valueType: 'money',
      hideInTable: bussType === BussType.调拨单,
    },
    {
      title: calAmountTitle(bussType),
      dataIndex: 'amount',
      valueType: 'money',
      editable: false,
      hideInTable: bussType === BussType.调拨单,
    },
    {
      dataIndex: 'inStoreCd',
      title: '调入仓库',
      render: (_, record) => <div>{record.inStoreName}</div>,
      valueType: 'select',
      valueEnum: storeEnum,
      hideInTable: bussType !== BussType.调拨单,
    },
    memoColumns(),
  ];
  useEffect(() => {
    if (value && !checked) {
      setEditableKeys(value.map((item: any) => item.autoId) || []);
    }
  }, [value, checked]);
  return (
    <EditableProTable<PUR.Entries>
      rowKey="autoId"
      bordered
      actionRef={actionRef}
      scroll={
        [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1
          ? undefined
          : { x: 3000 }
      }
      recordCreatorProps={false}
      columns={columns}
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableKeys,
        onValuesChange: (record, recordList) => {
          onChange?.(
            recordList.map((i) => {
              return record?.autoId === i.autoId
                ? {
                    ...i,
                    qty: i.qtyMid?.qty || 0,
                    serNumList: i.qtyMid?.serNumList || [],
                  }
                : i;
            }),
          );
        },
        actionRender: (row, config, defaultDom) => [defaultDom.delete],
      }}
      postData={(v) =>
        v.map((i) => ({
          ...i,
          qtyMid: {
            qty: i.qty,
            serNumList: i.serNumList,
          },
        }))
      }
      value={value}
      {...rest}
    />
  );
};
export const StoreForm = (props: StoreFormProps) => {
  const { bussType, dev, id, query, inventoryInfo } = props;
  const formRef = useRef<FormInstance>();
  const [checked, setChecked] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(false);

  const { run, refresh, data } = useRequest(
    async () => {
      setIsInfo(id !== 'new');
      if (id === 'new') {
        const billNo = (await getCode(BussCodeId[BussType[bussType]])).data;
        const { suppId, contactName, custId } = query;
        const res: PUR.Purchase = {
          billId: '',
          billNo,
          date: moment().format('YYYY-MM-DD'),
          deliveryDate: moment().format('YYYY-MM-DD'),
          disRate: 0,
          disAmount: 0,
          rpAmount: 0,
          suppId,
          custId,
          contactName,
        };
        // 从盘点单生成盘盈盘亏单
        if (inventoryInfo) {
          const pageBussType = bussType === BussType.其他入库单 ? BussType.盘盈 : BussType.盘亏;
          let entries: PUR.Entries[];
          if (inventoryInfo.isSerNum) {
            entries = inventoryInfo.entries
              .filter((i) => {
                return pageBussType === BussType.盘盈
                  ? i.inventoryResult.newSerNum?.length
                  : i.inventoryResult.delSerNum?.length;
              })
              .map((item) => ({
                skuId: item.skuId,
                skuName: item.skuName,
                unitId: item.unitId,
                unitName: item.unitName,
                currentQty: item.qty,
                qty: Math.abs(
                  pageBussType === BussType.盘盈
                    ? item.inventoryResult.newSerNum?.length || 0
                    : item.inventoryResult.delSerNum?.length || 0,
                ),
                storeCd: item.storeCd,
                autoId: item.autoId,
                inventoryId: inventoryInfo.billId,
                unitList: [{ unitId: item.unitId, rate: 1, unitName: item.unitName, autoId: 123 }],
                isSerNum: true,
                serNumList:
                  pageBussType === BussType.盘盈
                    ? item.inventoryResult.newSerNum
                    : item.inventoryResult.delSerNum,
              }));
          } else {
            entries = inventoryInfo.entries
              .filter((i) => {
                // 如果是盘盈 取正值部分,否则取
                return pageBussType === BussType.盘盈
                  ? (i.inventoryResult.length || 0) > 0
                  : (i.inventoryResult.length || 0) < 0;
              })
              .map((item) => ({
                skuId: item.skuId,
                skuName: item.skuName,
                unitId: item.unitId,
                unitName: item.unitName,
                currentQty: item.qty,
                qty: Math.abs(item.inventoryResult.length || 0),
                storeCd: item.storeCd,
                autoId: item.autoId,
                inventoryId: inventoryInfo.billId,
                unitList: item.unitList,
              }));
          }
          return {
            data: {
              ...res,
              bussType: pageBussType,
              entries,
            },
            success: true,
          };
        }
        return {
          data: res,
          success: true,
        };
      }
      const info = (
        await queryPurchaseInfo(id, `${BussTypeApiUrl[BussType[bussType]]}/info`, undefined, {
          dev,
        })
      ).data;
      setChecked(info.checkStatus === 2);
      const entries = info.entries?.map((en) => ({
        ...en,
        autoId: +(Math.random() * 1000000).toFixed(0),
      }));
      return {
        data: {
          ...info,
          entries,
        },
      };
    },
    {
      onSuccess: async (values: any) => {
        formRef.current?.setFieldsValue(values);
      },
      manual: true,
    },
  );
  useEffect(() => {
    run();
  }, [id, run]);
  return (
    <ProCard bordered style={{ boxShadow: ' 0 1px 3px rgb(0 0 0 / 20%)' }}>
      <ProForm<PUR.Purchase>
        onFinish={async (values) => {
          // 新增或修改时,对序列号商品进行基本单位判断.购货订单无需序列号
          const ttt = values?.entries?.filter((item) => {
            if (item.isSerNum && !inventoryInfo) {
              if (item.unitId !== item.baseUnitId) {
                message.error(`商品${item.skuName}录入序列号时，请选择基本计量单位！`);
                return true;
              }
            }
            return false;
          });
          if (ttt?.length) {
            return false;
          }
          if (!isInfo) {
            // 新增
            const res = await addPurchase(
              { ...values, dev },
              `${BussTypeApiUrl[BussType[bussType]]}/add`,
            );
            message.success(res.msg);
            history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${res.data.id}`);
          } else {
            await updPurchase({ ...values, dev }, `${BussTypeApiUrl[BussType[bussType]]}/upd`);
            refresh();
          }
          return false;
        }}
        onValuesChange={async (values) => {
          calPrice(values, formRef);
        }}
        formRef={formRef}
        submitter={{
          render: ({ form }) => (
            <FooterToolbar>
              {[
                <CheckAudit checkStatus={checked} key={'checkImg'} />,
                <Space key="action">
                  {isInfo ? (
                    <>
                      {checked && (
                        <GenerateButton
                          bussType={data?.bussType}
                          billStatus={data?.bussType}
                          billId={data?.billId}
                        />
                      )}
                      <CheckTwoButton
                        key="check"
                        url={`${BussTypeApiUrl[BussType[bussType]]}/check`}
                        selectedRowKeys={[id]}
                        refresh={refresh}
                        checkStatus={checked ? 1 : 2}
                      />
                    </>
                  ) : (
                    <div />
                  )}
                </Space>,
                <Button
                  key="save"
                  type={'primary'}
                  onClick={async () => {
                    form?.submit();
                  }}
                  children={'保存'}
                />,
                <Button key="refresh" type={'dashed'} onClick={refresh} children={'刷新'} />,
                <Button
                  key="print"
                  type="link"
                  target="_blank"
                  href={`#/sys/print/${id}/${bussType}`}
                  children={'打印'}
                />,
              ]}
            </FooterToolbar>
          ),
        }}
      >
        <ProFormText hidden width="md" name="billId" label="单据编号" disabled />
        <ProForm.Group>
          <ProFormDependency name={['contactName']}>
            {({ contactName }) => {
              return (
                bussType === BussType.其他出库单 && (
                  <ProForm.Item name="custId" label="客户">
                    <CustomerSelect custName={contactName} disabled={checked} />
                  </ProForm.Item>
                )
              );
            }}
          </ProFormDependency>
          <ProFormDependency name={['contactName']}>
            {({ contactName }) => {
              return (
                bussType === BussType.其他入库单 && (
                  <ProForm.Item name="custId" label="供应商">
                    <SupplierSelect suppName={contactName} disabled={checked} />
                  </ProForm.Item>
                )
              );
            }}
          </ProFormDependency>
          <ProFormDatePicker width="md" name="date" label="单据日期" disabled={checked} />
          <ProFormText
            width="md"
            name="billNo"
            label="单据编号"
            disabled
            rules={patternMsg.text('单据编号')}
          />
        </ProForm.Group>
        <ProForm.Group>
          <ProForm.Item name="entries" label="商品" rules={patternMsg.select('商品')}>
            <SkuSelect disabled={checked} multiple labelInValue accumulate />
          </ProForm.Item>
          {
            // 其他入库单 盘盈 ,其他入库
            bussType === BussType.其他入库单 && (
              <ProFormRadio.Group
                name="bussType"
                disabled={checked}
                label="业务类型"
                initialValue={BussType.其他入库单}
                options={[
                  {
                    label: '其他入库单',
                    value: BussType.其他入库单,
                  },
                  {
                    label: '盘盈',
                    value: BussType.盘盈,
                  },
                ]}
              />
            )
          }
          {
            // 其他入库单 盘盈 ,其他入库
            bussType === BussType.其他出库单 && (
              <ProFormRadio.Group
                name="bussType"
                disabled={checked}
                label="业务类型"
                initialValue={BussType.其他出库单}
                options={[
                  {
                    label: '其他出库单',
                    value: BussType.其他出库单,
                  },
                  {
                    label: '盘亏',
                    value: BussType.盘亏,
                  },
                ]}
              />
            )
          }
        </ProForm.Group>
        <ProForm.Item name="entries">
          <StoreEntries bussType={bussType} checked={checked} formRef={formRef} />
        </ProForm.Item>
        <ProFormTextArea name="memo" label="备注" disabled={checked} />
        <ProFormDependency name={['totalQty', 'totalAmount']}>
          {({ totalQty, totalAmount }) => (
            <Space size={32}>
              {totalQty > 0 && (
                <ProFormDigit width="sm" name="totalQty" label="单据数量" disabled />
              )}
              {totalAmount > 0 && (
                <ProFormDigit width="sm" name="totalAmount" label="单据总额" disabled />
              )}
            </Space>
          )}
        </ProFormDependency>
      </ProForm>
    </ProCard>
  );
};
