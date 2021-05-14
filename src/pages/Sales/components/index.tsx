/* eslint-disable @typescript-eslint/consistent-type-imports */
import { DashOutlined } from '@ant-design/icons';
import type { FormInstance } from 'antd';
import { Button, Input, InputNumber, message, Modal, Select, Space } from 'antd';
import React, { useEffect, useRef, useState } from 'react';
import { CustomerTable } from '@/pages/Bas/customer';
import { useRequest, history, useParams, useLocation } from 'umi';
import {
  addPurchase,
  delPurchase,
  getSnapshotQty,
  queryPurchase,
  queryPurchaseInfo,
  queryPurchaseUnStockIn,
  updPurchase,
} from '@/services/Purchase';
import type { OrderTableProps } from '@/pages/Purchase/components/OrderTable';
import type { AdvancedSearchFormField } from '@/utils/columns';
import {
  AdvancedSearch,
  AdvancedSearchForm,
  billNoColumns,
  billStatusColumns,
  checkName,
  checkStatusColumns,
  crtNameColumns,
  currentQtyColumns,
  hxStateCodeColumns,
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
  NewOrderFormProps,
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
import { SN } from '@/pages/Store/serNum/serNumDetail';
import { queryCustomerAddress, querySuppliersInfo } from '@/services/Bas';
import { getCode } from '@/services/Sys';
import { calPrice } from '@/utils/utils';
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
import { DepSelect, UserSelect } from '@/utils/form';

export const CustSelect: React.FC<{
  value?: React.Key;
  suppName?: string;
  disabled?: boolean;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange, disabled, suppName }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const handleCancel = () => {
    setVisible(false);
  };
  const [inputValue, setInputValue] = useState<string>(() => {
    if (value && suppName) {
      return suppName;
    }
    return '';
  });
  const handleChange = (ttt: BAS.Customer) => {
    onChange?.(ttt.custId);
    setInputValue(ttt.custName);
    handleCancel();
  };
  useEffect(() => {
    setInputValue(suppName || '');
  }, [suppName]);
  return (
    <>
      <Input
        value={inputValue}
        onClick={() => {
          setVisible(true);
        }}
        style={{ width: '328px' }}
        disabled={disabled}
        suffix={
          <DashOutlined
            onClick={() => {
              setVisible(true);
            }}
          />
        }
      />
      <Modal visible={visible} width={1000} footer={false} onCancel={handleCancel}>
        <CustomerTable select={{ state: 1 }} onChange={handleChange} />
      </Modal>
    </>
  );
};

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

export const XhTableColumns = <T extends Record<string, unknown>>({
  bussType,
}: {
  bussType: BussType;
}): ProColumns<T>[] => {
  const base: ProColumns<T>[] = [
    keywordColumns({ placeholder: '请输入编号或者客户名称查询' }),
    indexColumns,
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
      dataIndex: 'date',
      title: '单据日期',
      valueType: 'date',
      search: false,
    },
    billNoColumns((record) => {
      history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${record?.billId}`);
    }),
  ];
  return base.concat([
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      search: false,
      valueType: 'date',
    },
    {
      dataIndex: 'bussType',
      title: '业务类别',
      search: false,
      valueType: 'select',
      valueEnum: BussType,
      hideInTable: [BussType.采购单, BussType.采购退货单, BussType.调拨单].indexOf(bussType) > -1,
    },
    {
      title: '销售员',
      dataIndex: 'operId',
      search: false,
      render: (_, record) => <div>{(record as any).operName}</div>,
    },
    {
      title: '客户',
      dataIndex: 'contactName',
      search: false,
    },
    totalAmountColumns({
      title: '销售金额',
    }),
    hxStateCodeColumns(
      bussType === BussType.采购单 ? 1 : 2,
      [BussType.采购单, BussType.采购退货单].indexOf(bussType) < 0,
      getOrderType(OrderType.购销货).indexOf(bussType) > -1 ? undefined : false,
    ),
    billStatusColumns(
      BussType.采购订单 === bussType ? 1 : 2,
      [BussType.采购订单, BussType.销售退货订单].indexOf(bussType) < 0,
      [BussType.采购订单, BussType.采购退货订单].indexOf(bussType) > -1 ? undefined : false,
    ),
    checkStatusColumns(getOrderType(OrderType.购销货).indexOf(bussType) > -1 ? undefined : false),
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
  const { openCloseFn, initSearch, dev, bussType } = props;
  const columns = XhTableColumns<PUR.Purchase>({
    bussType,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues, setAdvancedSearchFormValues] = useState<
    AdvancedSearchFormField | undefined
  >(initSearch);
  return (
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
      scroll={{ x: 1500 }}
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
            history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${record.billId}`);
          },
        };
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
          {
            ...params,
            pageNumber: params.current,
            queryFilter: params,
            dev,
          },
          `${BussTypeApiUrl[BussType[bussType]]}/list`,
        );
        return {
          data: response.data.rows,
          success: response.code === 0,
          total: response.data.total,
        };
      }}
    />
  );
}

export enum BussCodeId {
  销售订单 = 'XHDD',
  销售单 = 'XHD',
}

export type XhFormProps = {
  bussType: BussType; // 业务类型
  dev?: string; // 是否开发
  stockType?: StockType; // In 是入库单 Out 出库单
};
export const XhForm = (props: XhFormProps) => {
  const { bussType, dev, stockType } = props;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const { id } = useParams<{ id: string }>();
  const location = useLocation();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
  const [checked, setChecked] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(false);
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
    skuIdColumns,
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
              options={entries[index as number].unitList.map((unit) => ({
                label: unit.unitName,
                value: unit.unitId,
              }))}
            />
          );
        }
        return <div>请先选择商品</div>;
      },
    },
    currentQtyColumns(),
    {
      title: () => (
        <div>
          <span className="error-color">*</span>数量
        </div>
      ),
      dataIndex: 'qty',
      valueType: 'digit',
      renderFormItem: ({ index }) => {
        const entries: PUR.Entries[] = formRef.current?.getFieldValue('entries');
        if (
          getOrderType(OrderType.订单).indexOf(bussType) < 0 &&
          entries[index as number].isSerNum
        ) {
          return (
            <SN
              entries={entries}
              index={index as number}
              formRef={formRef}
              stockType={StockType.出库}
            />
          );
        }
        return <InputNumber min={0} style={{ width: 104 }} />;
      },
    },
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
      title: '含税单价',
      dataIndex: 'taxPrice',
      editable: false,
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
      title: stockType === 'In' ? '优惠前金额' : '折后金额',
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
    {
      title: '税率',
      dataIndex: 'taxRate',
      valueType: 'percent',
    },
    {
      title: '税额',
      dataIndex: 'tax',
      valueType: 'money',
      editable: false,
    },
    {
      title: '价税合计',
      dataIndex: 'taxAmount',
      valueType: 'money',
      editable: false,
    },
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
  const getSuppAccountPayableSum = async (suppId: React.Key) => {
    const supp = (await querySuppliersInfo(suppId)).data;
    formRef.current?.setFieldsValue({
      accountPayableSum: supp.accountPayableSum,
    });
  };
  const { run, refresh, data } = useRequest(
    async () => {
      setIsInfo(id !== 'new');
      if (id === 'new') {
        const billNo = (await getCode(initialValues.codeId)).data;
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
        if ([BussType.采购单, BussType.采购退货单].indexOf(bussType) > -1) {
          const { srcGhddBillId, srcGhdBillId } = (location as any).query;
          // srcGhddBillId, srcGhdBillId 只存在一个,
          if (srcGhddBillId) {
            // 如果当前页面是购货单,则是生成购货单, 如果是退货单,则是从购货订单生成退货单
            const ttt =
              bussType === BussType.采购单
                ? '/bis/purcOrder/infoUnStockIn'
                : '/bis/purcOrder/infoReturnable';
            const srcGhdd = (
              await queryPurchaseUnStockIn(srcGhddBillId || srcGhdBillId, undefined, ttt)
            ).data;
            const entries = srcGhdd.entries?.map((i) => ({
              ...i,
              autoId: +(Math.random() * 1000000).toFixed(0),
              srcGhddBillNo: [
                {
                  billId: srcGhddBillId,
                  billNo: srcGhdd.billNo,
                },
              ],
              srcDtlId: i.dtlId,
            }));
            setEditableKeys(entries?.map((i) => i.autoId));
            res = {
              ...res,
              ...srcGhdd,
              entries,
              billNo,
              bussType,
            };
          }
          if (srcGhdBillId) {
            // 从购货单生成退货单
            const ttt = '/bis/purchase/infoReturn';
            const srcGHD = (
              await queryPurchaseUnStockIn(srcGhddBillId || srcGhdBillId, undefined, ttt)
            ).data;
            const entries = srcGHD.entries?.map((i) => ({
              ...i,
              autoId: +(Math.random() * 1000000).toFixed(0),
              srcGhdBillNo: [
                {
                  billId: srcGhdBillId,
                  billNo: srcGHD.billNo,
                },
              ],
              srcDtlId: i.dtlId,
            }));
            setEditableKeys(entries?.map((i) => i.autoId));
            res = {
              ...res,
              ...srcGHD,
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
      const info = (await queryPurchaseInfo(id, `${initialValues.url}/info`, undefined, { dev }))
        .data;
      setChecked(info.checkStatus === 2);
      const entries = info.entries?.map((en) => ({
        ...en,
        autoId: +(Math.random() * 1000000).toFixed(0),
      }));
      if (info.checkStatus !== 2) {
        setEditableKeys(entries?.map((i) => i.autoId));
      }
      return {
        data: {
          ...info,
          entries,
        },
      };
    },
    {
      onSuccess: async (values: any) => {
        if (values.suppId) {
          await getSuppAccountPayableSum(values.suppId);
        }
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
            if (bussType !== BussType.采购订单) {
              const ttt = values?.entries?.filter((item) => {
                if (item.isSerNum) {
                  if (item.unitId !== item.baseUnitId) {
                    message.error(`商品${item.spuName}录入序列号时，请选择基本计量单位！`);
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
            if ([BussType.采购单, BussType.采购退货单].indexOf(bussType) > -1) {
              if (values.suppId) {
                await getSuppAccountPayableSum(values.suppId);
              }
              calPrice(values, formRef, true);
              return;
            }
            calPrice(values, formRef);
          }}
          formRef={formRef}
          submitter={false}
        >
          <ProFormText hidden width="md" name="billId" label="单据编号" disabled />
          <ProForm.Group>
            <ProFormDependency name={['contactName']}>
              {({ contactName }) => {
                return (
                  <ProForm.Item name="custId" label="客户" rules={patternMsg.text('客户')}>
                    <CustomerSelect custName={contactName} disabled={checked} />
                  </ProForm.Item>
                );
              }}
            </ProFormDependency>
            <ProFormDependency name={['custId']}>
              {({ custId }) =>
                custId ? (
                  <ProFormSelect
                    width="md"
                    name="addressId"
                    label="客户地址"
                    request={async () => {
                      return (
                        await queryCustomerAddress({
                          queryFilter: { custId },
                          pageNumber: -1,
                        })
                      ).data.rows.map((i) => ({
                        label: i.address,
                        value: i.addressId,
                      }));
                    }}
                  />
                ) : (
                  ''
                )
              }
            </ProFormDependency>

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
            <DepSelect name="depId" label="销售部门" showNew disabled={checked} />
            <UserSelect showNew name="operId" label="销售员" disabled={checked} />
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item name="entries" label="商品" rules={patternMsg.select('商品')}>
              <SkuSelect
                setEditableKeys={setEditableKeys}
                disabled={checked}
                multiple
                labelInValue
              />
            </ProForm.Item>
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
          </ProForm.Group>
          <ProForm.Item name="entries" trigger="onValuesChange">
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
                actionRender: (row, config, defaultDom) => [defaultDom.delete],
              }}
            />
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
              label={bussType === BussType.采购退货单 ? '退款优惠' : '优惠金额'}
              disabled={checked}
            />
            <ProFormDigit disabled width="sm" name="amount" label="优惠后金额" />
          </ProForm.Group>
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
