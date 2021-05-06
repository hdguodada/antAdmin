import AuditImage from '@/images/audit.png';
import { Supplier } from '@/pages/Bas/supplier';
import { querySkuList, querySuppliersInfo } from '@/services/Bas';
import React, { useEffect, useRef } from 'react';
import { useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable from '@ant-design/pro-table';
import Modal from 'antd/lib/modal/Modal';
import type { FormInstance } from 'antd';
import { Button, Input, message, Select, Space } from 'antd';
import { DashOutlined, SearchOutlined } from '@ant-design/icons';
import {
  currentQtyColumns,
  indexColumns,
  keywordColumns,
  memoColumns,
  qtyColumns,
  skuIdColumns,
  storeCdColumns,
} from '@/utils/columns';
import { getCode } from '@/services/Sys';
import { calPrice } from '@/utils/utils';
import { patternMsg } from '@/utils/validator';
import { AccountSelect, DepSelect, UserSelect } from '@/utils/form';
import { useModel, useParams, useRequest, history, useLocation } from 'umi';
import { PageContainer } from '@ant-design/pro-layout';
import moment from 'moment';
import ProForm, {
  ModalForm,
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { ProFormTextArea } from '@ant-design/pro-form';
import { EditableProTable } from '@ant-design/pro-table';
import { CheckTwoButton } from '@/components/CheckButton';
import { SN } from '@/pages/Store/serNum/serNumDetail';
import { queryPurchaseUnStockIn } from '@/services/Purchase';
import { InputNumber } from 'antd';
import { getCurrentStock, getSkuStock } from '@/services/Store';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';

export const CheckAudit = ({ checkStatus }: { checkStatus: boolean }) => {
  return checkStatus ? <img src={AuditImage} alt="" style={{ marginRight: '100px' }} /> : <div />;
};

export const SupplierSelect: React.FC<{
  value?: React.Key;
  suppName?: string;
  disabled?: boolean;
  onChange?: (value: React.Key | BAS.Supplier) => void;
  labelInValue?: boolean;
}> = ({ value, onChange, disabled, suppName, labelInValue }) => {
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
  const handleChange = (supplier: BAS.Supplier) => {
    if (labelInValue) {
      onChange?.(supplier);
    } else {
      onChange?.(supplier.suppId);
    }
    setInputValue(supplier.suppName);
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
        <Supplier
          select={true}
          onChange={handleChange}
          selectParams={{ checkStatus: 2, state: 1 }}
        />
      </Modal>
    </>
  );
};

export const SkuSelect: React.FC<{
  value?: PUR.Entries[];
  onChange?: (value: PUR.Entries[]) => void;
  setEditableKeys?: (value: React.Key[]) => void;
  disabled?: boolean;
  type?: 'single' | 'multiple';
}> = ({ value, onChange, setEditableKeys, disabled, type = 'multiple' }) => {
  const formRef = useRef<FormInstance>();
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedEntries, setSelectedEntries] = useState<PUR.Entries[]>();
  const handleOk = (recordList: PUR.Entries[]) => {
    const v =
      recordList?.map((item) => ({
        ...item,
        autoId: +(Math.random() * 1000000).toFixed(0),
        unitId: item.inLocationUnitId,
        rate: item.inLocationUnitRate,
        discountRate: 0,
        taxRate: 0,
        outStoreCd: item.storeCd,
      })) || [];
    const onChangeValue = type === 'multiple' ? value?.concat(v) ?? v : v;
    onChange?.(onChangeValue);
    setEditableKeys?.(onChangeValue.map((i) => i.autoId));
    setVisible(false);
  };
  const columns: ProColumns<PUR.Entries>[] = [
    keywordColumns({
      placeholder: '请输入商品名称或编码',
    }),
    indexColumns,
    {
      title: '编码',
      dataIndex: 'code',
      search: false,
    },
    {
      dataIndex: 'cateName',
      title: '商品类别',
      search: false,
    },
    {
      dataIndex: 'skuName',
      title: '商品名称',
      search: false,
    },
    currentQtyColumns(),
    {
      dataIndex: 'isSerNum',
      title: '是否序列号管理',
      search: false,
      valueType: 'select',
      // @ts-ignore
      valueEnum: new Map([
        [false, { text: '否', status: 'Error' }],
        [true, { text: '是', status: 'Success' }],
      ]),
    },
    {
      title: '操作',
      key: 'action',
      valueType: 'option',
      width: 120,
      render: (_, record) => {
        return [
          <a
            key="editable"
            onClick={async () => {
              setSelectedEntries([record]);
              handleOk([record]);
            }}
          >
            选择
          </a>,
        ];
      },
    },
  ];
  return (
    <>
      {type === 'multiple' ? (
        <Button
          type={'dashed'}
          disabled={disabled}
          onClick={() => {
            setVisible(true);
          }}
        >
          选择商品
        </Button>
      ) : (
        <Input
          value={value?.[0]?.skuName || value?.[0].spuName}
          style={{ width: '328px' }}
          disabled={disabled}
          onClick={() => {
            setVisible(true);
          }}
          suffix={
            <DashOutlined
              onClick={() => {
                setVisible(true);
              }}
            />
          }
        />
      )}
      <Modal
        visible={visible}
        width={1000}
        okText={'选中并关闭'}
        cancelText={'关闭'}
        onCancel={async () => {
          setVisible(false);
        }}
        footer={
          type === 'multiple'
            ? [
                <Button
                  type={'primary'}
                  key="back"
                  onClick={() => {
                    handleOk(selectedEntries || []);
                  }}
                >
                  选中并关闭
                </Button>,
                <Button
                  key="submit"
                  onClick={() => {
                    setVisible(false);
                  }}
                >
                  关闭
                </Button>,
              ]
            : null
        }
      >
        <ProTable<PUR.Entries>
          pagination={{ pageSize: 5 }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                setSelectedEntries([record]);
                formRef.current?.submit();
              },
            };
          }}
          rowSelection={
            type === 'multiple'
              ? {
                  onChange: (a, b) => {
                    setSelectedEntries(b);
                  },
                }
              : false
          }
          rowKey={'skuId'}
          options={false}
          columns={columns}
          request={async (params) => {
            const response = await querySkuList({
              ...params,
              pageNumber: params.current,
              queryFilter: params,
            });
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
        />
      </Modal>
    </>
  );
};

export enum BussType {
  购货订单 = 10,
  购货退货订单 = 11,
  购货单 = 12,
  购货退货单 = 13,
  销货订单 = 20,
  销货退货订单 = 21,
  销货单 = 22,
  销货退货单 = 23,
  其他入库单 = 40,
  盘盈 = 41,
  其他出库单 = 42,
  盘亏 = 43,
  调拨单 = 44,
}
export enum StockType {
  入库 = 'In',
  出库 = 'Out',
}

export enum OrderType {
  其他入库,
  其他出库,
  其他出入库,
  购货,
  销货,
  购销货,
  购销货退货单,
  订单,
  调拨单,
  入库单,
  出库单,
}

export enum BussTypeApiUrl {
  购货订单 = '/bis/purcOrder',
  购货单 = '/bis/purchase',
  购货退货单 = '/bis/purcReturn',
  其他入库单 = '/bis/stockIn',
  其他出库单 = '/bis/stockOut',
  调拨单 = '/bas/stock/stockChange',
}

export enum BussTypeComponentUrl {
  购货订单 = '/bis/purcOrder',
  购货单 = '/bis/purchase',
  购货退货单 = '/bis/Thd',
  其他入库单 = '/stock/stockIn',
  其他出库单 = '/stock/stockOut',
  调拨单 = '/stock/stockChange',
  盘点 = '/stock/inventory',
}

export function getOrderType(orderType: OrderType) {
  if (orderType === OrderType.其他入库) {
    return [BussType.其他入库单, BussType.盘盈];
  }
  if (orderType === OrderType.其他出库) {
    return [BussType.其他出库单, BussType.盘亏];
  }
  if (orderType === OrderType.其他出入库) {
    return [BussType.其他入库单, BussType.盘盈, BussType.其他出库单, BussType.盘亏];
  }
  if (orderType === OrderType.购货) {
    return [BussType.购货订单, BussType.购货退货订单, BussType.购货单, BussType.购货退货单];
  }
  if (orderType === OrderType.销货) {
    return [BussType.销货订单, BussType.销货退货订单, BussType.销货单, BussType.销货退货单];
  }
  if (orderType === OrderType.购销货) {
    return [
      BussType.购货订单,
      BussType.购货退货订单,
      BussType.购货单,
      BussType.购货退货单,
      BussType.销货订单,
      BussType.销货退货订单,
      BussType.销货单,
      BussType.销货退货单,
    ];
  }
  if (orderType === OrderType.购销货退货单) {
    return [BussType.购货退货订单, BussType.购货退货单, BussType.销货退货订单, BussType.销货退货单];
  }
  if (orderType === OrderType.订单) {
    return [BussType.购货订单, BussType.购货退货订单, BussType.销货订单, BussType.销货退货订单];
  }
  return [];
}

export function calPriceTitle(bussType: BussType) {
  if (getOrderType(OrderType.其他入库).indexOf(bussType) > -1) {
    return '入库单价';
  }
  if (getOrderType(OrderType.其他出库).indexOf(bussType) > -1) {
    return '出库单价';
  }
  if (getOrderType(OrderType.购货).indexOf(bussType) > -1) {
    return '购货单价';
  }
  if (getOrderType(OrderType.销货).indexOf(bussType) > -1) {
    return '销货单价';
  }
  return '';
}

export function calAmountTitle(bussType: BussType) {
  if (getOrderType(OrderType.其他入库).indexOf(bussType) > -1) {
    return '入库金额';
  }
  if (getOrderType(OrderType.其他出库).indexOf(bussType) > -1) {
    return '出库金额';
  }
  if (getOrderType(OrderType.购货).indexOf(bussType) > -1) {
    return '购货金额';
  }
  if (getOrderType(OrderType.销货).indexOf(bussType) > -1) {
    return '销货金额';
  }
  return '';
}

export const BussTypeFormField = ({ bussType }: { bussType: BussType }) => {
  const { valueEnum } = useModel('options', (model) => ({ valueEnum: model.valueEnum }));
  if (getOrderType(OrderType.其他入库).indexOf(bussType) > -1) {
    return (
      <ProFormRadio.Group
        width="md"
        name="bussType"
        label="业务类型"
        initialValue={BussType.其他入库单}
        options={[
          {
            label: '盘盈',
            value: BussType.盘盈,
          },
          {
            label: '其他入库单',
            value: BussType.其他入库单,
          },
        ]}
      />
    );
  }
  if (getOrderType(OrderType.其他出库).indexOf(bussType) > -1) {
    return (
      <ProFormRadio.Group
        width="md"
        name="bussType"
        label="业务类型"
        initialValue={BussType.其他出库单}
        options={[
          {
            label: '盘亏',
            value: BussType.盘亏,
          },
          {
            label: '其他出库单',
            value: BussType.其他出库单,
          },
        ]}
      />
    );
  }
  if (getOrderType(OrderType.订单).indexOf(bussType) > -1) {
    return (
      <ProFormRadio.Group
        name="bussType"
        label="业务类型"
        initialValue={BussType.购货订单}
        options={[
          {
            label: '购货',
            value: BussType.购货订单,
          },
          {
            label: '退货',
            value: BussType.购货退货订单,
          },
        ]}
      />
    );
  }
  return (
    <ProFormSelect
      valueEnum={valueEnum('BussType')}
      name="bussType"
      disabled
      label="业务类型"
      initialValue={bussType}
    />
  );
};

export const SkuStock: React.FC<{
  skuId: React.Key;
  skuName: string;
}> = ({ skuId, skuName }) => {
  return (
    <ModalForm
      title="商品库存查询"
      trigger={<SearchOutlined style={{ fontSize: 18 }} />}
      width={480}
      onFinish={async () => true}
    >
      <ProTable
        rowKey="storeCd"
        headerTitle={skuName}
        search={false}
        options={false}
        pagination={false}
        columns={[indexColumns, storeCdColumns, qtyColumns({ title: '数量', dataIndex: 'qty' })]}
        request={async () => {
          const res = await getSkuStock({ skuId });
          return {
            success: res.code === 0,
            data: res.data,
          };
        }}
      />
    </ModalForm>
  );
};

export const StoreSelectChangeCurrentQty: React.FC<{
  value?: React.Key;
  onChange?: (value: React.Key) => void;
  entries: PUR.Entries[];
  formRef: any;
  index: number;
}> = ({ value, onChange, entries, formRef, index }) => {
  const { storeOptions } = useModel('store', (model) => ({
    storeOptions: model.options,
  }));
  const { run } = useRequest(
    async (skuId, storeCd) => {
      const res = await getCurrentStock({
        skuId,
        storeCd,
      });
      return {
        data: res.data,
        success: true,
      };
    },
    {
      manual: true,
    },
  );
  return (
    <Space>
      <SkuStock skuId={entries[index].skuId} skuName={entries[index].skuName} />
      <Select
        options={storeOptions}
        style={{ width: '216px' }}
        value={value}
        onChange={async (e) => {
          if (index !== undefined && entries) {
            const res = await run(entries[index].skuId, e);
            formRef?.current.setFieldsValue({
              entries: entries?.map((item, _index) =>
                _index === index ? { ...item, currentQty: res } : item,
              ),
            });
          }
          onChange?.(e as React.Key);
        }}
      />
    </Space>
  );
};

type NewOrderFormProps = {
  queryInfo: (
    id: React.Key,
    url: string,
    headers?: any,
    data?: any,
  ) => Promise<InfoResponse<PUR.Purchase>>; // 获取info函数
  bussType: BussType; // 业务类型
  add: (values: PUR.Purchase, url: string) => Promise<any>; // 新增函数
  upd: (values: PUR.Purchase, url: string) => Promise<any>; // 更新函数
  dev?: boolean; // 是否开发
  url?: string; // 接口地址
  componentUrl?: string; // 组件地址
  stockType?: StockType; // In 是入库单 Out 出库单
};
const generateInitValuesFromBussType = (bussType: BussType, url: string, componentUrl: string) => {
  const base = {
    checkButton: {
      url: `${url}/check`,
    },
    url,
    componentUrl,
    title: BussType[bussType],
  };
  let other: {
    codeId: string;
  } = {
    codeId: 'GHDD',
  };
  if (bussType === BussType.购货单) {
    other = {
      codeId: 'GHD',
    };
  }
  if ([BussType.其他入库单, BussType.盘盈].indexOf(bussType) > -1) {
    other = {
      codeId: 'QTRK',
    };
  }
  if ([BussType.其他出库单, BussType.盘亏].indexOf(bussType) > -1) {
    other = {
      codeId: 'QTCK',
    };
  }
  if (bussType === BussType.购货退货单) {
    other = {
      codeId: 'THD',
    };
  }

  if (bussType === BussType.销货订单) {
    other = {
      codeId: 'XHDD',
    };
  }

  if (bussType === BussType.调拨单) {
    other = {
      codeId: 'TBD',
    };
  }

  return {
    ...base,
    ...other,
  };
};

export const GenerateButton: React.FC<{
  bussType: BussType;
  billStatus: number;
  billId?: React.Key;
}> = ({ bussType, billStatus, billId }) => {
  let url = '';
  let children = '';
  if (bussType === BussType.购货订单) {
    url = `${BussTypeComponentUrl.购货单}/new?srcGhddBillId=`;
    children = '生成购货单';
  }
  if (bussType === BussType.购货退货订单) {
    url = `${BussTypeComponentUrl.购货退货单}/new?srcGhddBillId=`;
    children = '生成退货单';
  }
  if (bussType === BussType.购货单) {
    url = `${BussTypeComponentUrl.购货退货单}/new?srcGhdBillId=`;
    children = '生成退货单';
  }
  return (
    <Button
      key="generate"
      onClick={async () => {
        if (billStatus === (3 || 4)) {
          message.error('该订单已入库或已关闭,无法生成购货单');
          return;
        }
        history.push(`${url}${billId}`);
      }}
      children={children}
    />
  );
};
export const NewOrderForm = (props: NewOrderFormProps) => {
  const {
    queryInfo,
    bussType,
    add,
    upd,
    dev = false,
    url = '',
    componentUrl = '',
    stockType = StockType.入库,
  } = props;
  const actionRef = useRef<ActionType>();
  const formRef = useRef<FormInstance>();
  const initValues = generateInitValuesFromBussType(bussType, url, componentUrl);
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
            <SN entries={entries} index={index as number} formRef={formRef} stockType={stockType} />
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
      title: () => (
        <div>
          <span className="error-color">*</span>调出仓库
        </div>
      ),
      dataIndex: 'outStoreCd',
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
    {
      title: () => (
        <div>
          <span className="error-color">*</span>调入仓库
        </div>
      ),
      dataIndex: 'inStoreCd',
      render: (_, record) => <div>{record.inStoreName}</div>,
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
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
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
      title: '含税单价',
      dataIndex: 'taxPrice',
      editable: false,
      valueType: 'money',
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    {
      title: () => (
        <div>
          <span className="error-color">*</span>折扣率(%)
        </div>
      ),
      dataIndex: 'discountRate',
      valueType: 'percent',
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    {
      title: '折扣额',
      dataIndex: 'deduction',
      valueType: 'money',
      editable: false,
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    {
      title: stockType === 'In' ? '优惠前金额' : '折后金额',
      dataIndex: 'beforeDisAmount',
      valueType: 'money',
      editable: false,
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    {
      title: calAmountTitle(bussType),
      dataIndex: 'amount',
      valueType: 'money',
      editable: false,
      hideInTable: bussType === BussType.调拨单,
    },
    {
      title: '税率',
      dataIndex: 'taxRate',
      valueType: 'percent',
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    {
      title: '税额',
      dataIndex: 'tax',
      valueType: 'money',
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
      editable: false,
    },
    {
      title: '价税合计',
      dataIndex: 'taxAmount',
      valueType: 'money',
      editable: false,
      hideInTable: [BussType.调拨单, ...getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1,
    },
    memoColumns(),
    {
      title: '关联购货订单号',
      dataIndex: 'srcGhddBillNo',
      render: (_, record) => <a>{record.srcGhddBillNo?.[0]?.billNo}</a>,
      editable: false,
      hideInTable:
        [
          BussType.购货订单,
          BussType.其他入库单,
          BussType.盘盈,
          BussType.其他出库单,
          BussType.盘亏,
          BussType.调拨单,
        ].indexOf(bussType) > -1,
    },
    {
      title: '原购货单号',
      dataIndex: 'srcGhdBillNo',
      render: (_, record) => <a>{record.srcGhdBillNo?.[0]?.billNo}</a>,
      editable: false,
      hideInTable:
        [
          BussType.购货单,
          BussType.购货订单,
          BussType.其他入库单,
          BussType.盘盈,
          BussType.其他出库单,
          BussType.盘亏,
          BussType.调拨单,
        ].indexOf(bussType) > -1,
    },
  ];
  const getSuppAccountPayableSum = async (suppId: React.Key) => {
    const supp = (await querySuppliersInfo(suppId)).data;
    formRef.current?.setFieldsValue({
      accountPayableSum: supp.accountPayableSum,
    });
  };
  const { loading, run, refresh, data } = useRequest(
    async () => {
      setIsInfo(id !== 'new');
      if (id === 'new') {
        const billNo = (await getCode(initValues.codeId)).data;
        let res: PUR.Purchase = {
          billId: '',
          billNo,
          date: moment().format('YYYY-MM-DD'),
          deliveryDate: moment().format('YYYY-MM-DD'),
          disRate: 0,
          disAmount: 0,
          rpAmount: 0,
        };
        if ([BussType.购货单, BussType.购货退货单].indexOf(bussType) > -1) {
          const { srcGhddBillId, srcGhdBillId } = (location as any).query;
          // srcGhddBillId, srcGhdBillId 只存在一个,
          if (srcGhddBillId) {
            // 如果当前页面是购货单,则是生成购货单, 如果是退货单,则是从购货订单生成退货单
            const ttt =
              bussType === BussType.购货单
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
            const srcGhdd = (
              await queryPurchaseUnStockIn(srcGhddBillId || srcGhdBillId, undefined, ttt)
            ).data;
            const entries = srcGhdd.entries?.map((i) => ({
              ...i,
              autoId: +(Math.random() * 1000000).toFixed(0),
              srcGhdBillNo: [
                {
                  billId: srcGhdBillId,
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
        }
        return {
          data: res,
          success: true,
        };
      }
      const info = (await queryInfo(id, `${initValues.url}/info`, undefined, { dev })).data;
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
        if (bussType === BussType.购货单) {
          calPrice(values as any, formRef, true);
        }
      },
      manual: true,
    },
  );
  useEffect(() => {
    run();
  }, [id]);
  return (
    <PageContainer
      title={initValues.title}
      loading={loading}
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
                url={initValues.checkButton.url}
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
      ]}
      content={
        <ProForm<PUR.Purchase>
          onFinish={async (values) => {
            // 新增或修改时,对序列号商品进行基本单位判断.购货订单无需序列号
            if (bussType !== BussType.购货订单) {
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
              const res = await add({ ...values, dev }, `${url}/add`);
              message.success(res.msg);
              history.push(`${initValues.componentUrl}/${res.data.id}`);
            } else {
              await upd({ ...values, dev }, `${url}/upd`);
              refresh();
            }
            return false;
          }}
          onValuesChange={async (values) => {
            if ([BussType.购货单, BussType.购货退货单].indexOf(bussType) > -1) {
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
            {[BussType.其他入库单, ...getOrderType(OrderType.购货)].indexOf(bussType) > -1 && (
              <ProFormDependency name={['suppName']}>
                {({ suppName }) => (
                  <ProForm.Item
                    name="suppId"
                    label="供应商"
                    rules={
                      [BussType.其他入库单, BussType.盘盈].indexOf(bussType) > -1
                        ? undefined
                        : patternMsg.text('供应商')
                    }
                  >
                    <SupplierSelect disabled={checked} suppName={suppName} />
                  </ProForm.Item>
                )}
              </ProFormDependency>
            )}
            {[BussType.其他出库单, ...getOrderType(OrderType.销货)].indexOf(bussType) > -1 && (
              <ProFormDependency name={['suppName']}>
                {({ custName }) => (
                  <ProForm.Item name="custId" label="客户" rules={patternMsg.text('客户')}>
                    <CustomerSelect custName={custName} />
                  </ProForm.Item>
                )}
              </ProFormDependency>
            )}
            <ProFormDatePicker width="md" name="date" label="单据日期" disabled={checked} />
            {bussType === BussType.购货订单 && (
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
            {getOrderType(OrderType.购货).indexOf(bussType) > -1 && (
              <>
                <DepSelect name="depId" label="采购部门" showNew disabled={checked} />
                <UserSelect name="operId" label="采购员" disabled={checked} />
              </>
            )}
            {getOrderType(OrderType.销货).indexOf(bussType) > -1 && (
              <>
                <DepSelect name="depId" label="销售部门" showNew disabled={checked} />
                <UserSelect name="operId" label="销售员" disabled={checked} />
              </>
            )}
          </ProForm.Group>
          <ProForm.Group>
            <ProForm.Item name="entries" label="商品" rules={patternMsg.select('商品')}>
              <SkuSelect setEditableKeys={setEditableKeys} disabled={checked} />
            </ProForm.Item>
            <BussTypeFormField bussType={bussType} />
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
          {!([BussType.调拨单, getOrderType(OrderType.其他出入库)].indexOf(bussType) > -1) && (
            <>
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
                  label={bussType === BussType.购货退货单 ? '退款优惠' : '优惠金额'}
                  disabled={checked}
                />
                <ProFormDigit disabled width="sm" name="amount" label="优惠后金额" />
              </ProForm.Group>
              {[BussType.购货单, BussType.购货退货单].indexOf(bussType) > -1 && (
                <ProForm.Group>
                  <ProFormDigit width="sm" name="arrears" label="本次欠款" disabled />
                  <ProFormDigit width="sm" name="accountPayableSum" label="供应商欠款" disabled />
                  <ProFormDigit width="sm" name="totalArrears" label="总欠款" disabled />
                  <AccountSelect
                    name="accountId"
                    label="结算账户"
                    formRef={formRef}
                    disabled={checked}
                  />
                  <ProFormDigit
                    width="sm"
                    name="rpAmount"
                    label={bussType === BussType.购货单 ? '本次付款' : '本次退款'}
                    min={0}
                    disabled={checked}
                    fieldProps={{ precision: 2 }}
                  />
                </ProForm.Group>
              )}
            </>
          )}
        </ProForm>
      }
    />
  );
};
