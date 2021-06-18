import { DownOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import type { ProColumns, ProColumnType } from '@ant-design/pro-table';
import { FormInstance, Typography } from 'antd';
import { message } from 'antd';
import { Button, Dropdown, Menu, Space, Tooltip } from 'antd';
import React, { useRef } from 'react';
import DelButton from '@/components/DelPopconfirm/next';
import type { SearchConfig } from '@ant-design/pro-table/lib/components/Form/FormRender';
import { history, useModel } from 'umi';
import Style from '@/global.less';
import { SnapshotQty } from '@/pages/Sales/components';
import ProForm, {
  ModalForm,
  ProFormDateRangePicker,
  ProFormDependency,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { StockType } from '@/pages/Purchase/components';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  BussTypeEnum,
  getOrderType,
  OrderType,
  SkuSelect,
  SupplierSelect,
} from '@/pages/Purchase/components';
import { ProductTypeTreeSelect, UserSelect } from './form';
import moment from 'moment';
import { delPurchase } from '@/services/Purchase';
import { showSysInfo } from '@/components/SysInfo';
import type { CustomerSelectProps } from '@/pages/Bas/customer/customerSelect';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import { SN } from '@/pages/Store/serNum/serNumDetail';

export const checkStatusValueEnum = new Map([
  [1, { text: '未审核', status: 'Processing' }],
  [2, { text: '已审核', status: 'Success' }],
  [3, { text: '审核未通过', status: 'Error' }],
]);
/**
 * 审核状态
 */
export const checkStatusColumns = (props?: ProColumnType): ProColumns => {
  return {
    title: '审核状态',
    dataIndex: 'checkStatus',
    valueType: 'select',
    valueEnum: checkStatusValueEnum,
    width: 105,
    index: 105,
    order: -1,
    ...props,
  };
};

const billStatusValueEnum = new Map([
  [
    1,
    new Map([
      [1, { text: '未入库', status: 'Processing' }],
      [2, { text: '部分入库', status: 'Warning' }],
      [3, { text: '已入库', status: 'Success' }],
      [4, { text: '已关闭', status: 'Default' }],
    ]),
  ],
  [
    2,
    new Map([
      [1, { text: '未出库', status: 'Processing' }],
      [2, { text: '部分出库', status: 'Warning' }],
      [3, { text: '已出库', status: 'Success' }],
      [4, { text: '已关闭', status: 'Default' }],
    ]),
  ],
  [
    3,
    new Map([
      [1, { text: '未收款', status: 'Processing' }],
      [2, { text: '部分收款', status: 'Warning' }],
      [3, { text: '已收款', status: 'Success' }],
    ]),
  ],
]);

/**
 * 出入库状态
 * @param type
 * @param hideInTable
 * @param search
 */
export const billStatusColumns = <T extends unknown>(
  type: number,
  hideInTable = false,
  search: false | undefined,
): ProColumns<T> => ({
  title: type === 3 ? '收款状态' : '订单状态',
  dataIndex: 'billStatus',
  valueType: 'select',
  fieldProps: {
    mode: 'multiple',
  },
  width: 105,
  valueEnum: billStatusValueEnum.get(type),
  hideInTable,
  search,
});

export function skuIdColumns(props?: ProColumnType): ProColumns {
  return {
    title: '商品',
    dataIndex: 'skuId',
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          if (record.spuId) {
            history.push(`/bas/product/${record.spuId}`);
          }
          return false;
        }}
      >
        {record.skuName}
      </Button>
    ),
    renderFormItem: () => <SkuSelect type="input" multiple />,
    copyable: true,
    fixed: 'left',
    width: 250,
    ...props,
  };
}

export const memoColumns = <T extends unknown>(): ProColumns<T> => ({
  title: '备注',
  dataIndex: 'memo',
  search: false,
  index: 200,
});

export const fixWdithColumns = <T extends unknown>(): ProColumns<T> => ({
  index: 10000,
  editable: false,
  search: false,
  fixed: 'right',
});

export enum StatusEnum {
  不可用,
  可用,
}
export const statusColumns = <T extends unknown>(): ProColumns<T> => ({
  title: '在库状态',
  dataIndex: 'status',
  search: false,
  editable: false,
  valueEnum: StatusEnum,
});
export const crtNameColumns = <T extends unknown>(): ProColumns<T> => ({
  title: '制单人',
  dataIndex: 'crtName',
  search: false,
  width: 105,
  index: 100,
});
export const checkName = <T extends unknown>(): ProColumns<T> => ({
  title: '审核人',
  dataIndex: 'checkName',
  search: false,
  width: 105,
  index: 101,
});

export const indexColumns: ProColumns = {
  dataIndex: 'index',
  valueType: 'index',
  width: 50,
  align: 'center',
  fixed: 'left',
  key: 'index',
};

export function cateIdColumns(props?: ProColumnType): ProColumns {
  return {
    title: '商品类别',
    dataIndex: 'cateId',
    width: 105,
    render: (_, record) => <div>{record.cateName}</div>,
    renderFormItem: () => <ProductTypeTreeSelect isLeaf />,
    ...props,
  };
}

export const unitIdColumns: ProColumns = {
  title: '单位',
  dataIndex: 'unitId',
  render: (_, record) => <div>{record.unitName}</div>,
  search: false,
  editable: false,
  width: 75,
};

export const baseUnitIdColumns: ProColumns = {
  title: '单位',
  dataIndex: 'baseUnitId',
  width: 105,
  render: (_, record) => <div>{record.baseUnitName}</div>,
  search: false,
};

export const secondUnitColumns: ProColumns = {
  title: '副单位',
  dataIndex: 'secondUnit',
  search: false,
  width: 105,
};

export const spuCodeColumns: ProColumns = {
  title: '商品编号',
  dataIndex: 'spuCode',
  search: false,
  editable: false,
  width: 150,
};

export const skuCodeColumns: ProColumns = {
  title: '商品条码',
  dataIndex: 'skuCode',
  search: false,
  width: 100,
  editable: false,
};

export const dateColumns = <T extends unknown>({
  title = '创建日期',
  dataIndex = 'crtDate',
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    valueType: 'date',
  };
};

export function qtyColumns(props?: ProColumnType): ProColumns {
  return {
    title: '数量',
    dataIndex: 'totalQty',
    search: false,
    valueType: 'digit',
    hideInTable: false,
    width: 105,
    ...props,
  };
}

export function qtyWithSNColumns(
  entries: PUR.Entries[],
  stockType: StockType,
  checked: boolean,
  props?: ProColumnType,
): ProColumns {
  return {
    title: () => (
      <div>
        <span className="error-color">*</span>数量
      </div>
    ),
    dataIndex: 'qtyMid',
    valueType: 'digit',
    width: 155,
    formItemProps: {
      required: true,
    },
    renderFormItem: ({ index }) => {
      if (index !== undefined) {
        const record = entries[index];
        return (
          <SN
            sku={record}
            disabled={checked}
            initValue={{
              qty: record.qty || 0,
              serNumList: record.serNumList || [],
            }}
            stockType={stockType}
          />
        );
      }
      return <div />;
    },
    render: (_, record) => <Typography.Text type="danger">{record.qty}</Typography.Text>,
    ...props,
  };
}

export function customerColumns(
  { title = '客户', dataIndex = 'custId' } = {},
  props?: ProColumnType,
  c?: CustomerSelectProps,
): ProColumns {
  return {
    title,
    dataIndex,
    width: 155,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          history.push(`/bas/customer/${(record as any).custId}`);
        }}
      >
        {record.custName || record.contactName || '-'}
      </Button>
    ),
    renderFormItem: () => <CustomerSelect {...c} />,
    ...props,
  };
}

export function suppColumns(
  { title = '供应商', dataIndex = 'suppId', renderName = 'suppName', multiple = true } = {},
  props?: ProColumnType,
): ProColumns {
  return {
    title,
    dataIndex,
    width: 205,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          history.push(`/bas/supplier/${record.suppId}`);
        }}
      >
        {record[renderName]}
      </Button>
    ),
    renderFormItem: () => <SupplierSelect multiple={multiple} />,
    ...props,
  };
}
export function userColumns<T extends unknown>(props: ProColumnType<T>): ProColumns<T> {
  return {
    dataIndex: 'userId',
    title: '用户',
    width: 105,
    ...props,
  };
}

export function suppTypeColumns(suppEnum: Map<K, string> | undefined): ProColumns {
  return {
    title: '供应商类别',
    dataIndex: 'suppTypeId',
    valueType: 'select',
    valueEnum: suppEnum,
    render: (_, record) => <div>{record.suppTypeName}</div>,
  };
}

export function dateRangeColumns(
  { title = '单据日期', dataIndex = 'dateStr' } = {},
  props?: ProColumnType,
): ProColumns {
  return {
    width: 105,
    title,
    dataIndex,
    valueType: 'dateRange',
    initialValue: [moment().subtract(1, 'month'), moment()],
    render: (_, record) => <div>{moment(record[dataIndex]).format('YYYY-MM-DD')}</div>,
    search: {
      transform: (value) => ({
        beginDate: value[0],
        endDate: value[1],
      }),
    },
    ...props,
  };
}

export const currentQtyColumns = <T extends unknown>({
  title = '可用库存',
  dataIndex = 'currentQty',
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    editable: false,
    valueType: 'digit',
    width: 104,
  };
};

export const storeCdColumns: ProColumns = {
  title: '仓库',
  dataIndex: 'storeCd',
  editable: false,
  render: (_, record) => <div>{record.storeName}</div>,
  width: 100,
};

export function storeColumns(props?: ProColumnType): ProColumns {
  return {
    title: '仓库',
    dataIndex: 'storeCd',
    render: (_, record) => <div>{record.storeName}</div>,
    width: 155,
    ...props,
  };
}
export const stateColumns: ProColumns = {
  title: '状态',
  dataIndex: 'state',
  valueType: 'select',
  initialValue: 1,
  valueEnum: new Map([
    [1, { text: '正常', status: 'Success' }],
    [0, { text: '禁用', status: 'Error' }],
  ]),
  index: 300,
};

export function billNoColumns(props?: ProColumnType & { bussType: BussType }): ProColumns {
  return {
    title: '订单编号',
    dataIndex: 'billNo',
    search: false,
    render: (_, record) => (
      <Button
        onClick={() => {
          if (props?.bussType) {
            history.push(`${BussTypeComponentUrl[BussType[props?.bussType]]}/${record.billId}`);
          } else {
            message.error('unknow bussType');
          }
        }}
        type="link"
      >
        {_}
      </Button>
    ),
    width: 155,
    ...props,
  };
}

export function bussTypeColumns(props?: ProColumnType): ProColumns {
  return {
    title: '业务类型',
    dataIndex: 'bussType',
    valueEnum: BussTypeEnum,
    valueType: 'select',
    width: 155,
    ...props,
  };
}

export const srcOrderColumns = <T extends unknown>(
  props: ProColumnType<T>,
  dataIndex: K,
  url?: string,
): ProColumns<T> => {
  return {
    dataIndex,
    width: 155,
    render: (_, record) => {
      if (record && record[dataIndex] && record[dataIndex].length > 0) {
        const menu = (
          <Menu>
            {record[dataIndex].map((item: any) => (
              <Menu.Item key={item.billId}>
                <a
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    if (url) {
                      history.push(`${url}/${item.billId}`);
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
            <a onClick={(e) => e.preventDefault()}>
              {record[dataIndex][0].billNo}
              <DownOutlined />
            </a>
          </Dropdown>
        );
      }
      return '-';
    },
    ...props,
  };
};

export const srcOrderSearch = <T extends unknown>({ title = '源订单号' } = {}): ProColumns<T> => {
  return {
    title,
    dataIndex: 'srcOrder',
    hideInTable: true,
  };
};

export const totalAmountColumns = (
  { title = '购货金额', dataIndex = 'totalAmount', hideInTable = false } = {},
  props?: ProColumnType,
): ProColumns => {
  return {
    title,
    dataIndex,
    search: false,
    valueType: 'money',
    className: Style['error-color'],
    hideInTable,
    width: 105,
    ...props,
  };
};

export function moneyColumns<T = unknown>(props?: ProColumnType<T>): ProColumnType<T> {
  return {
    title: '金额',
    dataIndex: 'amount',
    valueType: 'money',
    search: false,
    width: 135,
    className: Style['error-color'],
    ...props,
  };
}

export function TaxColumns<T extends unknown>(useTax: number): ProColumnType<T>[] {
  return [
    moneyColumns({
      title: '含税单价',
      dataIndex: 'taxPrice',
      editable: false,
      hideInTable: !useTax,
      search: false,
    }),
    {
      title: '税率',
      dataIndex: 'taxRate',
      valueType: 'percent',
      hideInTable: !useTax,
      width: 105,
      search: false,
    },
    moneyColumns({
      title: '税额',
      dataIndex: 'tax',
      editable: false,
      hideInTable: !useTax,
      search: false,
    }),
    moneyColumns({
      title: '价税合计',
      dataIndex: 'taxAmount',
      editable: false,
      hideInTable: !useTax,
      search: false,
    }),
  ];
}

export const billDescColumns = <T extends unknown>({
  title = '整单备注',
  hideInTable = true,
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex: 'billDesc',
    hideInTable,
  };
};

export const rpAmountColumns = (props: ProColumnType): ProColumns => {
  return {
    title: '已付款',
    dataIndex: 'rpAmount',
    search: false,
    width: 105,
    valueType: 'money',
    hideInTable: true,
    ...props,
  };
};

export const amountColumns = (props?: ProColumnType): ProColumns => {
  return {
    title: '优惠后金额',
    dataIndex: 'amount',
    search: false,
    valueType: 'money',
    hideInTable: true,
    width: 105,
    ...props,
  };
};

export const hxStateCodeColumns = (props?: ProColumnType, key = 1): ProColumns => {
  const valueEnum =
    key === 1
      ? new Map([
          [1, { text: '未付款', status: 'Warning' }],
          [2, { text: '部分付款', status: 'Processing' }],
          [3, { text: '全部付款', status: 'Success' }],
        ])
      : new Map([
          [1, { text: '未退款', status: 'Warning' }],
          [2, { text: '部分退款', status: 'Processing' }],
          [3, { text: '全部退款', status: 'Success' }],
        ]);
  return {
    title: '付款状态',
    dataIndex: 'hxStateCode',
    valueType: 'select',
    width: 105,
    valueEnum,
    ...props,
  };
};

export const isDeafultColumns = <T extends unknown>(): ProColumns<T> => {
  return {
    title: '默认',
    dataIndex: 'isDeafult',
    search: false,
    valueType: 'select',
    valueEnum: new Map([
      [1, { text: '是', status: 'Success' }],
      [0, { text: '否', status: 'Error' }],
    ]),
  };
};

/**
 * 修改删除列
 * @param modify 修改函数
 * @param del 删除函数
 * @param width
 * @param fixed
 * @param jsxList
 * @returns
 */
interface optionColumnsProps extends ProColumnType {
  modify?: ({
    record,
    _index,
    action,
  }: {
    record: any;
    _index: number;
    action: any;
  }) => Promise<void>;
  del?: ({ record, _index, action }: { record: any; _index: number; action: any }) => Promise<void>;
  width?: number;
  fixed?: 'left' | 'right';
  jsxList?: JSX.Element[];
}
export function optionColumns({
  modify,
  del,
  jsxList = [],
  ...rest
}: optionColumnsProps): ProColumns {
  return {
    title: '操作',
    valueType: 'option',
    fixed: 'right',
    width: 55,
    render: (_, record, _index, action) => [
      <div key="modify">
        {modify && (
          <Tooltip title="修改" key="modify">
            <EditFilled
              key="edit"
              style={{ cursor: 'pointer' }}
              className={Style.myLink}
              onClickCapture={async () => {
                await modify({ record, _index, action });
              }}
            />
          </Tooltip>
        )}
      </div>,
      <div key="del">
        {del && (
          <DelButton
            onConfirm={async () => {
              await del({ record, _index, action });
              action?.reload();
            }}
          />
        )}
      </div>,
      <div key="jsxList">{jsxList}</div>,
    ],
    ...rest,
  };
}
/**
 *
 * @param fn 新增按钮的点击函数
 * @param url 新增按钮的跳转链接
 * @param jsxList // 其他按钮
 */
export const baseSearch = ({
  fn,
  url,
  jsxList,
  submit,
}: {
  fn?: () => void;
  url?: string;
  jsxList?: JSX.Element[];
  submit?: (params: any) => void;
}): false | SearchConfig => {
  return {
    optionRender: ({ searchText, resetText }, { form }) => {
      const base = [
        <Button
          key="search"
          type={'primary'}
          className={Style.buttonColorCyan}
          onClick={() => {
            form?.submit();
            submit?.(form?.getFieldsValue());
          }}
        >
          {searchText}
        </Button>,
        <Button
          key="rest"
          onClick={() => {
            form?.resetFields();
          }}
        >
          {resetText}
        </Button>,
        <div key="new">
          {(fn || url) && (
            <Button
              key="new"
              type="primary"
              onClick={() => {
                fn?.();
                if (url) {
                  history.push(url);
                }
              }}
            >
              <PlusOutlined />
              新建
            </Button>
          )}
        </div>,
      ];
      return [...(jsxList || []), ...base];
    },
  };
};

export type AdvancedSearchFormField = Partial<{
  beginDate: string;
  endDate: string;
  crtId: K;
  updId: K;
  checkId: K;
  checkStatus: number;
  entryDesc: string;
  beginArriveDate: string;
  endArriveDate: string;
  bussType: BussType[];
  suppId: K[];
  custId: K[];
  skuId: K;
  storeCd: K;
  status: number;
  srcGhdNo: string;
  srcXhddNo: string;
  skuIdList: any[];
  date: [string, string];
  deliveryDate: [string, string];
  billStatus: any[];
  suppIdMid: Partial<BAS.Supplier>[];
  custIdMid: Partial<BAS.Customer>[];
}>;
type AdvancedSearchFormProps = {
  value?: AdvancedSearchFormField;
  onChange?: (value: AdvancedSearchFormField) => void;
  bussType: BussType;
};
export const AdvancedSearchForm = (props: AdvancedSearchFormProps) => {
  const { value, onChange, bussType } = props;
  const formRef = useRef<FormInstance>();
  const { options } = useModel('store', (model) => ({ options: model.options }));
  return (
    <ModalForm<AdvancedSearchFormField>
      trigger={<Button type="dashed">高级搜索</Button>}
      initialValues={{
        date: [moment().startOf('month').format('YYYY-MM-DD'), moment().format('YYYY-MM-DD')],
        ...value,
      }}
      formRef={formRef}
      onValuesChange={(values: AdvancedSearchFormField) => {
        if (values.date) {
          formRef.current?.setFieldsValue({
            beginDate: values.date[0],
            endDate: values.date[1],
          });
        }
        if (values.deliveryDate) {
          formRef.current?.setFieldsValue({
            beginArriveDate: values.deliveryDate[0],
            endArriveDate: values.deliveryDate[1],
          });
        }
        if (values.skuIdList) {
          formRef.current?.setFieldsValue({
            skuId: values.skuIdList.map((i) => i.skuId),
            skuName: values.skuIdList.map((i) => i.skuCode).join(', '),
          });
        }
        if (values.suppIdMid) {
          formRef.current?.setFieldsValue({
            suppId: values.suppIdMid.map((i) => i.suppId),
            suppName: values.suppIdMid.map((i) => i.suppCd).join(', '),
          });
        }
        if (values.custIdMid) {
          formRef.current?.setFieldsValue({
            custId: values.custIdMid.map((i) => i.custId),
            custName: values.custIdMid.map((i) => i.custCd).join(', '),
          });
        }
      }}
      onFinish={async (values) => {
        onChange?.(values);
        return true;
      }}
    >
      <ProFormText name="suppId" hidden />
      <ProFormText name="suppName" hidden />
      <ProFormText name="custId" hidden />
      <ProFormText name="custName" hidden />
      <ProFormText name="skuId" hidden />
      <ProForm.Group>
        <ProFormText label="分录备注" width="md" name="entryDesc" />
        {getOrderType(OrderType.其他出入库).indexOf(bussType) < 0 && (
          <ProFormSelect
            label="订单状态"
            width="md"
            name="status"
            mode="multiple"
            valueEnum={billStatusValueEnum.get(1)}
          />
        )}
        {getOrderType(OrderType.购货).concat(getOrderType(OrderType.其他入库)).indexOf(bussType) >
          -1 && (
          <ProFormDependency name={['suppName']}>
            {({ suppName }) => (
              <ProForm.Item label="供应商" name="suppIdMid" style={{ width: '328px' }}>
                <SupplierSelect labelInValue suppName={suppName} multiple />
              </ProForm.Item>
            )}
          </ProFormDependency>
        )}

        {getOrderType(OrderType.销货).concat(getOrderType(OrderType.其他出库)).indexOf(bussType) >
          -1 && (
          <ProFormDependency name={['custName']}>
            {({ custName }) => (
              <ProForm.Item label="客户" name="custIdMid" style={{ width: '328px' }}>
                <CustomerSelect labelInValue custName={custName} multiple />
              </ProForm.Item>
            )}
          </ProFormDependency>
        )}

        <ProForm.Item label="商品" name="skuIdList" style={{ width: '328px' }}>
          <SkuSelect type="input" multiple labelInValue />
        </ProForm.Item>
        {bussType === BussType.调拨单 ? (
          <>
            <ProFormSelect
              label="调入仓库"
              width="md"
              name="storeCd"
              options={options}
              fieldProps={{ mode: 'multiple' }}
            />
            <ProFormSelect
              label="调出仓库"
              width="md"
              name="storeCd"
              options={options}
              fieldProps={{ mode: 'multiple' }}
            />
          </>
        ) : (
          <ProFormSelect
            label="仓库"
            width="md"
            name="storeCd"
            options={options}
            fieldProps={{ mode: 'multiple' }}
          />
        )}

        <UserSelect label="制单人" name="crtId" />
        <UserSelect label="最后修改人" name="updId" />
        <UserSelect label="审核人" name="checkId" />
        <ProFormSelect
          label="审核状态"
          width="md"
          name="checkStatus"
          valueEnum={checkStatusValueEnum}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
/**
 *
 * @param fn 新增按钮的点击函数
 * @param url 新增按钮的跳转链接
 * @param jsxList // 其他按钮
 * @param searchConfig
 * @param myReset
 */
export const AdvancedSearch = ({
  fn,
  url,
  jsxList,
  searchConfig,
  myReset,
}: {
  fn?: () => void;
  url?: string;
  jsxList?: JSX.Element[];
  searchConfig?: SearchConfig;
  myReset?: () => void;
}): false | SearchConfig => {
  return {
    optionRender: ({ searchText, resetText }, { form }) => {
      const base = [
        <Button
          key="search"
          type={'primary'}
          className={Style.buttonColorCyan}
          onClick={() => {
            form?.submit();
          }}
        >
          {searchText}
        </Button>,
        <Button
          key="rest"
          onClick={() => {
            form?.resetFields();
            myReset?.();
          }}
        >
          {resetText}
        </Button>,
        <Button
          key="new"
          type="primary"
          onClick={() => {
            fn?.();
            if (url) {
              history.push(url);
            }
          }}
        >
          <PlusOutlined />
          新建
        </Button>,
      ];
      return jsxList ? jsxList.concat(base) : base;
    },
    ...searchConfig,
  };
};

/**
 * 表格顶部 刷新和新增按钮
 */
export const refreshAndNew = ({
  fn,
  url,
  jsxList,
  refresh,
}: {
  fn?: () => void;
  url?: string;
  jsxList?: JSX.Element[];
  refresh?: () => void;
}) => {
  const base = [
    <Button
      type={'dashed'}
      key="search"
      onClick={() => {
        refresh?.();
      }}
    >
      刷新
    </Button>,
    <Button
      key="new"
      type="primary"
      onClick={() => {
        fn?.();
        if (url) {
          history.push(url);
        }
      }}
    >
      <PlusOutlined />
      新建
    </Button>,
  ];
  return jsxList ? base.concat(jsxList) : base;
};

export const tableAlertOptionRenderDom = (dom: JSX.Element[]) => {
  return <Space size={16}>{dom.map((i) => i)}</Space>;
};
/**
 * 获取可用库存
 * @param
 * @returns
 */
export const snapshotQtyColumns = <T extends unknown>(): ProColumns<T> => {
  return {
    title: '可用库存',
    dataIndex: 'snapshotQty',
    search: false,
    render: (_, record) => {
      // @ts-ignore
      return <SnapshotQty {...record} />;
    },
  };
};

export const keywordColumns = <T extends unknown>({ placeholder = '' }): ProColumns<T> => {
  return {
    dataIndex: 'keyword',
    title: '快速查找',
    hideInTable: true,
    order: 1,
    fieldProps: {
      placeholder,
    },
  };
};

export const OrderTableColumns = <T extends Record<string, unknown>>({
  bussType,
}: {
  stockType?: StockType;
  money?: 'S' | 'B';
  bussType: BussType;
}): ProColumns<T>[] => {
  const base: ProColumns<T>[] = [
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
      hideInTable: getOrderType(OrderType.订单).indexOf(bussType) < 0,
      width: 105,
    },
    bussTypeColumns({
      hideInTable: [BussType.采购单, BussType.采购退货单, BussType.调拨单].indexOf(bussType) > -1,
      search: false,
    }),
    suppColumns({ renderName: 'contactName' }, { search: false }),
    userColumns({
      title: '销售员',
      dataIndex: 'operId',
      search: false,
      render: (_, record) => <div>{(record as any).operName}</div>,
    }),
    srcOrderColumns(
      {
        title: '关联购货单号',
        hideInTable: [BussType.采购订单, BussType.采购退货单].indexOf(bussType) < 0,
        search: false,
      },
      'srcGhdBillNo',
      BussTypeComponentUrl.采购单,
    ),
    srcOrderColumns(
      {
        title: '关联购货退货单号',
        hideInTable: bussType !== BussType.采购单,
        search: false,
      },
      'srcThdBillNo',
      BussTypeComponentUrl.采购退货单,
    ),
    srcOrderColumns(
      {
        title: '关联购货订单号',
        dataIndex: 'srcGhddBillNo',
        hideInTable: [BussType.采购单, BussType.采购退货单].indexOf(bussType) < 0,
        search: false,
      },
      'srcGhddBillNo',
      BussTypeComponentUrl.采购订单,
    ),
    qtyColumns({
      title: '原购货数量',
      dataIndex: 'srcQty',
      hideInTable: bussType !== BussType.采购退货单,
    }),
    qtyColumns(),
    totalAmountColumns({
      title: '金额',
    }),
    amountColumns({
      hideInTable: [BussType.采购单, BussType.采购退货单].indexOf(bussType) < 0,
    }),
    rpAmountColumns({
      title: bussType === BussType.采购单 ? '已付款' : '已退款',
      hideInTable: [BussType.采购单, BussType.采购退货单].indexOf(bussType) < 0,
    }),
    hxStateCodeColumns(
      {
        hideInTable: [BussType.采购单, BussType.采购退货单].indexOf(bussType) < 0,
        search: bussType === BussType.采购订单 ? false : undefined,
      },
      bussType === BussType.采购单 ? 1 : 2,
    ),
    billStatusColumns(
      BussType.采购订单 === bussType ? 1 : 2,
      [BussType.采购订单, BussType.销售退货订单].indexOf(bussType) < 0,
      [BussType.采购订单, BussType.采购退货订单].indexOf(bussType) > -1 ? undefined : false,
    ),
    checkStatusColumns(),
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
