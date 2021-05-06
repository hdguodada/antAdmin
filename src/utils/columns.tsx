import { DownOutlined, EditFilled, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Button, DatePicker, Dropdown, Menu, Space, Tooltip } from 'antd';
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
  getOrderType,
  OrderType,
  SkuSelect,
  SupplierSelect,
} from '@/pages/Purchase/components';
import { ProductTypeTreeSelect, UserSelect } from './form';
import moment from 'moment';
import { delPurchase } from '@/services/Purchase';
import { showSysInfo } from '@/components/SysInfo';

export const checkStatusValueEnum = new Map([
  [1, { text: '未审核', status: 'Processing' }],
  [2, { text: '已审核', status: 'Success' }],
  [3, { text: '审核未通过', status: 'Error' }],
]);
/**
 * 审核状态
 */
export const checkStatus = <T extends unknown>(search: undefined | false): ProColumns<T> => {
  return {
    title: '审核状态',
    dataIndex: 'checkStatus',
    valueType: 'select',
    valueEnum: checkStatusValueEnum,
    search,
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
]);

/**
 * 出入库状态
 * @param type
 * @param hideInTable
 * @param search
 */
export const billStatus = <T extends unknown>(
  type: number,
  hideInTable = false,
  search: false | undefined,
): ProColumns<T> => ({
  title: '订单状态',
  dataIndex: 'billStatus',
  valueType: 'select',
  fieldProps: {
    mode: 'multiple',
  },
  valueEnum: billStatusValueEnum.get(type),
  hideInTable,
  search,
});

export const skuIdColumns: ProColumns = {
  title: '商品',
  dataIndex: 'skuId',
  render: (_, record) => <div>{record.skuName || record.spuName}</div>,
  search: false,
  editable: false,
  copyable: true,
};

export const memoColumns = <T extends unknown>(): ProColumns<T> => ({
  title: '备注',
  dataIndex: 'memo',
  search: false,
  editable: false,
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
});
export const checkName = <T extends unknown>(): ProColumns<T> => ({
  title: '审核人',
  dataIndex: 'checkName',
  search: false,
});

export const indexColumns: ProColumns = {
  dataIndex: 'index',
  valueType: 'index',
  width: 50,
  align: 'center',
  fixed: 'left',
};

export const cateIdColumns: ProColumns = {
  title: '商品类别',
  dataIndex: 'cateId',
  render: (_, record) => <div>{record.cateName}</div>,
  renderFormItem: () => <ProductTypeTreeSelect />,
};

export const unitIdColumns: ProColumns = {
  title: '单位',
  dataIndex: 'unitId',
  render: (_, record) => <div>{record.unitName}</div>,
  search: false,
  editable: false,
};

export const baseUnitIdColumns: ProColumns = {
  title: '单位',
  dataIndex: 'baseUnitId',
  render: (_, record) => <div>{record.baseUnitName}</div>,
  search: false,
};

export const secondUnitColumns: ProColumns = {
  title: '副单位',
  dataIndex: 'secondUnit',
  search: false,
};

export const codeColumns: ProColumns = {
  title: '商品编号',
  dataIndex: 'code',
  search: false,
  copyable: true,
  ellipsis: true,
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

export const qtyColumns = <T extends unknown>({
  title = '数量',
  dataIndex = 'totalQty',
  hideInTable = false,
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    valueType: 'digit',
    hideInTable,
  };
};

export const suppColumns = <T extends unknown>({
  title = '供应商',
  dataIndex = 'suppId',
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          history.push(`/bas/supplier/${(record as any).suppId}`);
        }}
      >
        {(record as any).suppName}
      </Button>
    ),
  };
};
export const customerColumns = <T extends unknown>({
  title = '客户',
  dataIndex = 'custId',
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    render: (_, record) => (
      <Button
        type="link"
        onClick={() => {
          history.push(`/bas/customer/${(record as any).custId}`);
        }}
      >
        {(record as any).custName}
      </Button>
    ),
  };
};

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
};
export const stateColumns: ProColumns = {
  title: '状态',
  search: false,
  dataIndex: 'state',
  valueType: 'select',
  valueEnum: () => {
    return {
      1: {
        text: '正常',
        status: 'Success',
      },
      0: {
        text: '禁用',
        status: 'Error',
      },
    };
  },
};

export const billNoColumns = <T extends unknown>(fn: (record?: T) => void): ProColumns<T> => {
  return {
    title: '订单编号',
    dataIndex: 'billNo',
    search: false,
    render: (_, record) => (
      <Button
        onClick={() => {
          fn(record);
        }}
        type={'link'}
      >
        {_}
      </Button>
    ),
  };
};

export const srcOrderColumns = <T extends unknown>({
  title,
  dataIndex,
  url,
  hideInTable,
}: {
  title: string;
  dataIndex: string;
  url: string;
  hideInTable: boolean;
}): ProColumns<T> => {
  return {
    title,
    dataIndex,
    search: false,
    hideInTable,
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
                    history.push(`${url}/${item.billId}`);
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
  };
};

export const totalAmountColumns = <T extends unknown>({
  title = '购货金额',
  hideInTable = false,
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex: 'totalAmount',
    search: false,
    valueType: 'money',
    hideInTable,
  };
};

export const rpAmountColumns = <T extends unknown>({
  title = '已付款',
  hideInTable = true,
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex: 'rpAmount',
    search: false,
    valueType: 'money',
    hideInTable,
  };
};

export const amountColumns = <T extends unknown>({
  title = '优惠后金额',
  hideInTable = true,
} = {}): ProColumns<T> => {
  return {
    title,
    dataIndex: 'amount',
    search: false,
    valueType: 'money',
    hideInTable,
  };
};

export const hxStateCodeColumns = <T extends unknown>(
  key = 1,
  hideInTable = true,
  search: false | undefined,
): ProColumns<T> => {
  const title = key === 1 ? '付款状态' : '退款状态';
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
    title,
    dataIndex: 'hxStateCode',
    valueType: 'select',
    valueEnum,
    hideInTable,
    search,
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
export const optionColumns = <T extends unknown>({
  modify,
  del,
  width = 65,
  fixed = 'right',
  jsxList = [],
}: {
  modify?: ({
    record,
    _index,
    action,
  }: {
    record: T;
    _index: number;
    action: any;
  }) => Promise<void>;
  del?: ({ record, _index, action }: { record: T; _index: number; action: any }) => Promise<void>;
  width?: number;
  fixed?: 'left' | 'right';
  jsxList?: JSX.Element[];
}): ProColumns<T> => {
  return {
    title: '操作',
    valueType: 'option',
    width,
    fixed,
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
              action.reload();
            }}
          />
        )}
      </div>,
      <div key="jsxList">{jsxList}</div>,
    ],
  };
};
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
}: {
  fn?: () => void;
  url?: string;
  jsxList?: JSX.Element[];
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
      return jsxList ? base.concat(jsxList) : base;
    },
  };
};

export type AdvancedSearchFormField = Partial<{
  begin1: string;
  endDate: string;
  crtId: React.Key;
  updId: React.Key;
  checkId: React.Key;
  checkStatus: number;
  entryDesc: string;
  beginArriveDate: string;
  endArriveDate: string;
  bussType: BussType[];
  suppId: React.Key;
  skuId: React.Key;
  storeCd: React.Key;
  status: number;
  srcGhdNo: string;
  srcXhddNo: string;
  skuIdList: any[];
  date: [string, string];
  deliveryDate: [string, string];
  billStatus: any[];
  suppIdMid: BAS.Supplier;
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
      initialValues={value}
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
            skuId: values.skuIdList[0].skuId,
          });
        }
        if (values.suppIdMid) {
          formRef.current?.setFieldsValue({
            suppId: values.suppIdMid.suppId,
            suppName: values.suppIdMid.suppName,
          });
        }
      }}
      onFinish={async (values) => {
        onChange?.(values);
        return true;
      }}
    >
      <ProFormText name="beginDate" hidden />
      <ProFormText name="endDate" hidden />
      <ProFormText name="suppId" hidden />
      <ProFormText name="suppName" hidden />
      {/* <ProFormText name="beginArriveDate" hidden />
      <ProFormText name="endArriveDate" hidden /> */}
      <ProFormText name="skuId" hidden />
      <ProForm.Group>
        <ProFormDateRangePicker
          initialValue={[
            moment().startOf('month').format('YYYY-MM-DD'),
            moment().format('YYYY-MM-DD'),
          ]}
          width="md"
          label="单据日期"
          name="date"
        />
        {/* <ProFormDateRangePicker width="md" label="交货日期" name="deliveryDate" /> */}
        <ProFormText label="分录备注" width="md" name="entryDesc" />
        {/* <ProFormText label="关联销货订单" width="md" name="srcXhddNo" />
        <ProFormText label="关联购货单" width="md" name="srcGhdNo" /> */}
        <ProFormSelect
          label="订单状态"
          width="md"
          name="status"
          mode="multiple"
          hidden={getOrderType(OrderType.其他出入库).indexOf(bussType) > -1}
          valueEnum={billStatusValueEnum.get(1)}
        />
        <ProFormDependency name={['suppName']}>
          {({ suppName }) => (
            <ProForm.Item label="供应商" name="suppIdMid">
              <SupplierSelect labelInValue suppName={suppName} />
            </ProForm.Item>
          )}
        </ProFormDependency>

        <ProForm.Item label="商品" name="skuIdList">
          <SkuSelect type="single" />
        </ProForm.Item>
        <ProFormSelect label="仓库" width="md" name="storeCd" options={options} />
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
 */
export const AdvancedSearch = ({
  fn,
  url,
  jsxList,
  other,
  myReset,
}: {
  fn?: () => void;
  url?: string;
  jsxList?: JSX.Element[];
  other?: any;
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
    ...other,
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
    fieldProps: {
      placeholder,
    },
  };
};

export const OrderTableColumns = <T extends Record<string, unknown>>({
  url = '',
  componentUrl = '',
  bussType,
}: {
  url: string;
  componentUrl: string;
  stockType?: StockType;
  money?: 'S' | 'B';
  bussType: BussType;
}): ProColumns<T>[] => {
  const base: ProColumns<T>[] = [
    keywordColumns({ placeholder: '请输入编号或者客户名称查询' }),
    indexColumns,
    {
      dataIndex: 'date',
      title: '单据日期',
      valueType: 'date',
      renderFormItem: () => (
        <DatePicker.RangePicker defaultValue={[moment().startOf('month'), moment()]} />
      ),
    },
    billNoColumns((record) => {
      history.push(`${componentUrl}/${record?.billId}`);
    }),
  ];
  return base.concat([
    {
      title: '交货日期',
      dataIndex: 'deliveryDate',
      search: false,
      valueType: 'date',
      hideInTable: getOrderType(OrderType.订单).indexOf(bussType) < 0,
    },
    {
      dataIndex: 'bussType',
      title: '业务类别',
      search: false,
      valueType: 'select',
      valueEnum: BussType,
      hideInTable: [BussType.购货单, BussType.购货退货单, BussType.调拨单].indexOf(bussType) > -1,
    },
    {
      dataIndex: 'inStoreName',
      title: '调入仓库',
      search: false,
      hideInTable: BussType.调拨单 !== bussType,
    },
    {
      dataIndex: 'outStoreName',
      title: '调出仓库',
      search: false,
      hideInTable: BussType.调拨单 !== bussType,
    },
    {
      title: '供应商',
      dataIndex: 'suppName',
      search: false,
      hideInTable:
        [BussType.其他入库单, BussType.调拨单, ...getOrderType(OrderType.购货)].indexOf(bussType) >
        -1,
    },
    {
      title: () => {
        if (getOrderType(OrderType.购货).indexOf(bussType) > -1) {
          return '采购员';
        }
        if (getOrderType(OrderType.销货).indexOf(bussType) > -1) {
          return '销售员';
        }
        return '';
      },
      dataIndex: 'operId',
      search: false,
      render: (_, record) => <div>{(record as any).operName}</div>,
      hideInTable: getOrderType(OrderType.其他出入库).indexOf(bussType) > -1,
    },
    {
      title: '客户',
      dataIndex: 'custName',
      search: false,
      hideInTable:
        [BussType.其他出库单, BussType.调拨单, ...getOrderType(OrderType.销货)].indexOf(bussType) >
        -1,
    },
    srcOrderColumns({
      title: '关联购货单号',
      dataIndex: 'srcGhdBillNo',
      url: '/bis/purchase',
      hideInTable: [BussType.购货订单, BussType.购货退货单].indexOf(bussType) < 0,
    }),
    srcOrderColumns({
      title: '关联购货退货单号',
      dataIndex: 'srcThdBillNo',
      url: '/bis/Thd',
      hideInTable: bussType !== BussType.购货单,
    }),
    srcOrderColumns({
      title: '关联购货订单号',
      dataIndex: 'srcGhddBillNo',
      url: '/bis/purcOrder',
      hideInTable: [BussType.购货单, BussType.购货退货单].indexOf(bussType) < 0,
    }),
    qtyColumns({
      title: '原购货数量',
      dataIndex: 'srcQty',
      hideInTable: bussType !== BussType.购货退货单,
    }),
    qtyColumns(),
    totalAmountColumns({
      title: '金额',
    }),
    amountColumns({
      hideInTable: [BussType.购货单, BussType.购货退货单].indexOf(bussType) < 0,
    }),
    rpAmountColumns({
      title: bussType === BussType.购货单 ? '已付款' : '已退款',
      hideInTable: [BussType.购货单, BussType.购货退货单].indexOf(bussType) < 0,
    }),
    hxStateCodeColumns(
      bussType === BussType.购货单 ? 1 : 2,
      [BussType.购货单, BussType.购货退货单].indexOf(bussType) < 0,
      getOrderType(OrderType.购销货).indexOf(bussType) > -1 ? undefined : false,
    ),
    billStatus(
      BussType.购货订单 === bussType ? 1 : 2,
      [BussType.购货订单, BussType.销货退货订单].indexOf(bussType) < 0,
      [BussType.购货订单, BussType.购货退货订单].indexOf(bussType) > -1 ? undefined : false,
    ),
    checkStatus(getOrderType(OrderType.购销货).indexOf(bussType) > -1 ? undefined : false),
    crtNameColumns(),
    checkName(),
    memoColumns(),
    optionColumns({
      modify: async ({ record }) => {
        history.push(`${componentUrl}/${record.billId}`);
      },
      del: async ({ record }) => {
        const res = await delPurchase([(record as any).billId], `${url}/del`);
        showSysInfo(res);
      },
    }),
  ]);
};
