/* eslint-disable @typescript-eslint/consistent-type-imports */
import type { FormInstance } from 'antd';
import { Button, message, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest, history, useParams, useLocation, useModel } from 'umi';
import {
  addPurchase,
  delPurchase,
  getSnapshotQty,
  queryPurchase,
  queryPurchaseInfo,
  queryPurchaseUnStockIn,
  updPurchase,
} from '@/services/Purchase';
import {
  AdvancedSearchFormField,
  bussTypeColumns,
  customerColumns,
  dateRangeColumns,
  qtyWithSNColumns,
  TaxColumns,
  userColumns,
} from '@/utils/columns';
import {
  AdvancedSearch,
  AdvancedSearchForm,
  billNoColumns,
  billStatusColumns,
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
import { queryCustomerAddress } from '@/services/Bas';
import { getCode } from '@/services/Sys';
import { calPrice, transProTableParamsToMyRequest } from '@/utils/utils';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { patternMsg } from '@/utils/validator';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import { AccountSelect, DepSelect, UserSelect } from '@/utils/form';
import { EditableProTableProps } from '@ant-design/pro-table/lib/components/EditableTable';

export type SnapshotQtyProps = {
  skuId: React.Key;
  unitId: React.Key;
  storeCd: React.Key;
  qty?: number;
};
export const SnapshotQty: React.FC<SnapshotQtyProps> = (props) => {
  const { data } = useRequest(async () => {
    return getSnapshotQty(props);
  });
  return <div>{data}</div>;
};

export const XhTableColumns = ({
  bussType,
  userEnum,
}: {
  bussType: BussType;
  userEnum: Map<React.Key, string> | undefined;
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
  ];
  return base.concat([
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      search: false,
      valueType: 'date',
      width: 105,
    },
    bussTypeColumns({
      hideInTable: bussType !== BussType.销售订单,
    }),
    userColumns({
      title: '销售员',
      dataIndex: 'operId',
      render: (_, record) => <div>{(record as any).operName}</div>,
      valueType: 'select',
      valueEnum: userEnum,
    }),
    customerColumns(undefined, { search: false }),
    totalAmountColumns({
      title: '销售金额',
    }),
    {
      title: bussType === BussType.销售单 ? '收款状态' : '退款状态',
      hideInTable: [BussType.销售订单, BussType.销售退货订单].indexOf(bussType) > -1,
      dataIndex: 'hxStateCode',
      valueType: 'select',
      width: 105,
      search: bussType === BussType.销售订单 ? false : undefined,
      valueEnum:
        bussType === BussType.销售单
          ? new Map([
              [1, { text: '未收款', status: 'Warning' }],
              [2, { text: '部分收款', status: 'Processing' }],
              [3, { text: '全部收款', status: 'Success' }],
            ])
          : new Map([
              [1, { text: '未退款', status: 'Warning' }],
              [2, { text: '部分退款', status: 'Processing' }],
              [3, { text: '全部退款', status: 'Success' }],
            ]),
    },
    billStatusColumns(
      BussType.采购订单 === bussType ? 1 : 2,
      [BussType.采购订单, BussType.销售退货订单].indexOf(bussType) < 0,
      [BussType.采购订单, BussType.采购退货订单].indexOf(bussType) > -1 ? undefined : false,
    ),
    checkStatusColumns({
      search: getOrderType(OrderType.购销货).indexOf(bussType) > -1 ? undefined : false,
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
  ]);
};

export type XhTableProps = {
  openCloseFn?: any;
  initSearch?: AdvancedSearchFormField; // 初始化搜索条件
  dev?: string;
  bussType: BussType;
};
export function XhTable(props: XhTableProps) {
  const { userEnum } = useModel('user', (model) => ({ userEnum: model.valueEnum }));
  const { openCloseFn, initSearch, dev, bussType } = props;
  const columns = XhTableColumns({
    bussType,
    userEnum,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues, setAdvancedSearchFormValues] = useState<
    AdvancedSearchFormField | undefined
  >(initSearch);
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
          pagination={{
            pageSize: 10,
          }}
          tableAlertOptionRender={({ selectedRowKeys }) => {
            return (
              <Space size={16}>
                <CheckButton
                  url={`${BussTypeComponentUrl[BussType[bussType]]}/check`}
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
  销售订单 = 'XHDD',
  销售单 = 'XHD',
  销售退货单 = 'XHT',
}

export type XhddEntriesProps = {
  value?: any;
  onChange?: (value: any) => void;
  bussType: BussType;
  checked: boolean;
  formRef: any;
  rest?: EditableProTableProps<PUR.Entries, any>;
};
export const XhddEntries: React.FC<XhddEntriesProps> = ({
  bussType,
  checked,
  formRef,
  value,
  onChange,
  rest,
}) => {
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
  const { useTax } = useModel('params', (model) => ({
    useTax: model.sysParams?.useTax || 0,
    tax: model.sysParams?.tax,
  }));
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
    skuIdColumns({ editable: false }),
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
        if (index !== undefined) {
          if (entries[index].unitList) {
            return (
              <Select
                style={{ width: '216px' }}
                options={entries[index].unitList?.map((unit) => ({
                  label: unit.unitName,
                  value: unit.unitId,
                }))}
              />
            );
          }
        }
        return <div>请先选择商品</div>;
      },
    },
    currentQtyColumns(),
    qtyWithSNColumns(
      value,
      bussType === BussType.销售退货单 ? StockType.入库 : StockType.出库,
      checked,
    ),
    {
      title: () => (
        <div>
          <span className="error-color">*</span>仓库
        </div>
      ),
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
      title: '基本单位',
      dataIndex: 'basUnitId',
      width: 120,
      editable: false,
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
      render: (_, record) => <div>{record.baseUnitName}</div>,
    },
    {
      title: '基本数量',
      dataIndex: 'basQty',
      editable: false,
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
    },

    {
      title: () => (
        <div>
          <span className="error-color">*</span>折扣率(%)
        </div>
      ),
      dataIndex: 'discountRate',
      valueType: 'percent',
    },
    {
      title: '折扣额',
      dataIndex: 'deduction',
      valueType: 'money',
      editable: false,
    },
    {
      title: '折后金额',
      dataIndex: 'beforeDisAmount',
      valueType: 'money',
      editable: false,
    },
    {
      title: calAmountTitle(bussType),
      dataIndex: 'amount',
      valueType: 'money',
      editable: false,
    },
    ...TaxColumns<PUR.Entries>(useTax),
    memoColumns(),
    {
      title: '关联销货订单号',
      dataIndex: 'srcGhddBillNo',
      render: (_, record) => <a>{record.srcGhddBillNo?.[0]?.billNo}</a>,
      editable: false,
      hideInTable: [BussType.销售订单].indexOf(bussType) > -1,
    },
    {
      title: '原销货单号',
      dataIndex: 'srcGhdBillNo',
      render: (_, record) => <a>{record.srcGhdBillNo?.[0]?.billNo}</a>,
      editable: false,
      hideInTable: [BussType.销售单, BussType.销售订单].indexOf(bussType) > -1,
    },
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
      postData={(v) =>
        v.map((i) => ({
          ...i,
          qtyMid: {
            qty: i.qty,
            serNumList: i.serNumList,
          },
        }))
      }
      editable={{
        type: 'multiple',
        editableKeys,
        onChange: setEditableKeys,
        actionRender: (row, config, defaultDom) => [defaultDom.delete],
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
      }}
      value={value}
      {...rest}
    />
  );
};
export type XhFormProps = {
  bussType: BussType; // 业务类型
  dev?: string; // 是否开发
};
export const XhForm = (props: XhFormProps) => {
  const { bussType, dev } = props;
  const formRef = useRef<FormInstance>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [checked, setChecked] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(false);
  const [addressOptions, setAddressOptions] = useState<BAS.CustAddress[]>([]);
  const { run, refresh, data } = useRequest(
    async () => {
      setIsInfo(id !== 'new');
      if (id === 'new') {
        const billNo = (await getCode(BussCodeId[BussType[bussType]])).data;
        const { suppId, contactName, custId } = (location as any).query;
        let res: PUR.Purchase = {
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
        if ([BussType.销售单, BussType.销售退货单].indexOf(bussType) > -1) {
          const { srcXhddBillId, srcXhdBillId } = (location as any).query;
          // srcGhddBillId, srcGhdBillId 只存在一个,
          if (srcXhddBillId) {
            // 如果当前页面是购货单,则是生成购货单, 如果是退货单,则是从购货订单生成退货单
            const ttt =
              bussType === BussType.销售单
                ? `${BussTypeApiUrl.销售订单}/infoUnStockIn`
                : `${BussTypeApiUrl.销售订单}/infoReturnable`;
            const srcXhdd = (
              await queryPurchaseUnStockIn(srcXhddBillId || srcXhdBillId, undefined, ttt)
            ).data;
            const entries = srcXhdd.entries?.map((i) => ({
              ...i,
              autoId: +(Math.random() * 1000000).toFixed(0),
              srcXhddBillNo: [
                {
                  billId: srcXhddBillId,
                  billNo: srcXhdd.billNo,
                },
              ],
              srcDtlId: i.dtlId,
            }));
            res = {
              ...res,
              ...srcXhdd,
              entries,
              billNo,
              bussType,
            };
          }
          if (srcXhdBillId) {
            const ttt = `${BussTypeApiUrl.销售单}/infoReturn`;
            const srcXHD = (
              await queryPurchaseUnStockIn(srcXhddBillId || srcXhdBillId, undefined, ttt)
            ).data;
            const entries = srcXHD.entries?.map((i) => ({
              ...i,
              autoId: +(Math.random() * 1000000).toFixed(0),
              srcGhdBillNo: [
                {
                  billId: srcXhdBillId,
                  billNo: srcXHD.billNo,
                },
              ],
              srcDtlId: i.dtlId,
            }));
            res = {
              ...res,
              ...srcXHD,
              entries,
              billNo,
              bussType,
            };
          }
        }
        return {
          data: res,
          success: true,
        };
      }
      const info = (
        await queryPurchaseInfo(id, `${BussTypeComponentUrl[BussType[bussType]]}/info`, undefined, {
          dev,
        })
      ).data;
      setAddressOptions(
        await (await queryCustomerAddress({ queryFilter: { custId: info.custId } })).data.rows,
      );
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
        if (bussType === BussType.采购单) {
          calPrice(values as any, formRef, true);
        }
      },
      manual: true,
    },
  );
  useEffect(() => {
    run();
  }, [id, run]);
  return (
    <PageContainer
      title={BussType[bussType]}
      footer={[
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
            formRef.current?.submit();
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
    >
      <ProCard bordered style={{ boxShadow: ' 0 1px 3px rgb(0 0 0 / 20%)' }}>
        <ProForm<PUR.Purchase>
          onFinish={async (values) => {
            // 新增或修改时,对序列号商品进行基本单位判断.购货订单无需序列号
            if (bussType !== BussType.销售订单) {
              const ttt = values?.entries?.filter((item) => {
                if (item.isSerNum) {
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
            if (values.cust) {
              const { cust } = values;
              setAddressOptions(
                await (await queryCustomerAddress({ queryFilter: { custId: cust.custId } })).data
                  .rows,
              );
              formRef.current?.setFieldsValue({
                addressId: undefined,
                custId: cust.custId,
                accountPayableSum: cust.accountPayableSum,
              });
            }
            if ([BussType.销售单, BussType.销售退货单].indexOf(bussType) > -1) {
              calPrice(values, formRef, true);
              return;
            }
            calPrice(values, formRef);
          }}
          formRef={formRef}
          submitter={false}
        >
          <ProFormText hidden width="md" name="billId" label="单据编号" disabled />
          <ProFormText hidden width="md" name="custId" label="客户Id" disabled />
          <ProForm.Group>
            <ProFormDependency name={['custName']}>
              {({ custName }) => {
                return (
                  <ProForm.Item
                    name="cust"
                    label="客户"
                    rules={patternMsg.text('客户')}
                    style={{ width: '328px' }}
                  >
                    <CustomerSelect custName={custName} disabled={checked} labelInValue />
                  </ProForm.Item>
                );
              }}
            </ProFormDependency>
            <ProFormDependency name={['custId']}>
              {({ custId }) =>
                custId ? (
                  <ProFormSelect
                    width="lg"
                    name="addressId"
                    label="客户地址"
                    options={addressOptions.map((i) => ({
                      label: i.linkman + i.mobile + i.fullAddress,
                      value: i.addressId,
                    }))}
                  />
                ) : (
                  ''
                )
              }
            </ProFormDependency>
          </ProForm.Group>
          <ProForm.Group>
            <ProFormDatePicker width="md" name="date" label="单据日期" disabled={checked} />
            {bussType === BussType.销售订单 && (
              <ProFormDatePicker
                width="md"
                name="deliveryDate"
                label="交货日期"
                disabled={checked}
              />
            )}
            <ProFormText
              width="md"
              name="billNo"
              label="单据编号"
              disabled
              rules={patternMsg.text('单据编号')}
            />
            <ProForm.Item name="depId" label="销售部门" style={{ width: '328px' }}>
              <DepSelect
                isLeaf
                showNew
                fieldProps={{
                  disabled: checked,
                }}
              />
            </ProForm.Item>
            <UserSelect showNew name="operId" label="销售员" disabled={checked} />
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item name="entries" label="商品" rules={patternMsg.select('商品')}>
              <SkuSelect disabled={checked} multiple labelInValue accumulate />
            </ProForm.Item>
            {
              // 只有在销售订单时展示业务类型,销货或者退货
              bussType === BussType.销售订单 && (
                <ProFormRadio.Group
                  name="bussType"
                  disabled={checked}
                  label="业务类型"
                  initialValue={BussType.销售订单}
                  options={[
                    {
                      label: '销货',
                      value: BussType.销售订单,
                    },
                    {
                      label: '退货',
                      value: BussType.销售退货订单,
                    },
                  ]}
                />
              )
            }
          </ProForm.Group>
          <ProForm.Item name="entries">
            <XhddEntries bussType={bussType} checked={checked} formRef={formRef} />
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
          <ProForm.Group>
            <ProFormText
              width="sm"
              name="disRate"
              label="优惠率"
              disabled={checked}
              fieldProps={{
                type: 'number',
                suffix: '%',
              }}
            />
            <ProFormDigit
              width="sm"
              name="disAmount"
              label={bussType === BussType.销售退货单 ? '退款优惠' : '收款优惠'}
              disabled={checked}
            />
            <ProFormDigit disabled width="sm" name="amount" label="优惠后金额" />
            {
              // 销售单下的表单
              bussType === BussType.销售单 && (
                <>
                  <ProFormDigit width="sm" name="customerFree" label="客户承担费用" />
                  <ProFormDigit width="sm" name="arrears" label="本次欠款" disabled />
                  <ProFormDigit width="sm" name="accountPayableSum" label="客户欠款" disabled />
                  <ProFormDigit width="sm" name="totalArrears" label="总欠款" disabled />
                  <AccountSelect name="accountId" label="结算账户" />
                  <ProFormDigit width="sm" name="rpAmount" label="本次收款" />
                </>
              )
            }
            {
              // 退货单下的表单
              bussType === BussType.销售退货单 && (
                <>
                  <ProFormDigit width="sm" name="arrears" label="本次欠款" disabled />
                  <AccountSelect name="customerFree" label="结算账户" />
                  <ProFormDigit width="sm" name="rpAmount" label="本次退款" />
                </>
              )
            }
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
