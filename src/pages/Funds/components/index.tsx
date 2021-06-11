import { CheckButton, CheckTwoButton } from '@/components/CheckButton';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  BussTypeEnum,
  CheckAudit,
  SupplierSelect,
} from '@/pages/Purchase/components';
import { fundUnHxList } from '@/services/Funds';
import { getCode } from '@/services/Sys';
import {
  baseSearch,
  billNoColumns,
  checkName,
  checkStatusColumns,
  crtNameColumns,
  customerColumns,
  dateRangeColumns,
  indexColumns,
  keywordColumns,
  memoColumns,
  moneyColumns,
  optionColumns,
  suppColumns,
  userColumns,
} from '@/utils/columns';
import { AccountSelect, UserSelect } from '@/utils/form';
import { patternMsg } from '@/utils/validator';
import ProCard, { StatisticCard } from '@ant-design/pro-card';
import type { FormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import type { ActionType, ProColumns, ProTableProps } from '@ant-design/pro-table/lib/typing';
import { Button, message, Modal, Space, Table, Tag, Typography } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { history, request, useModel, useParams, useRequest } from 'umi';
import { transProTableParamsToMyRequest } from '@/utils/utils';
import { delPurchase } from '@/services/Purchase';
import { showSysInfo } from '@/components/SysInfo';
import Styles from '@/global.less';
import type { ButtonProps } from 'antd/es/button';
import lodash from 'lodash';
import ProList from '@ant-design/pro-list';

const { Text } = Typography;

export enum FundTypeCode {
  其他收入单 = 'QTSR',
  其他支出单 = 'QTZC',
  收款单 = 'SKD',
  付款单 = 'FKD',
  核销单 = 'HXD',
  资金转账单 = 'ZJZZD',
}

export enum HxType {
  预收冲应收 = 1,
  预付冲应付 = 2,
  应收冲应付 = 3,
  应收转应收 = 4,
  应付转应付 = 5,
}

export const HxTypeEnum = new Map([
  [1, { text: '预收冲应收' }],
  [2, { text: '预付冲应付' }],
  [3, { text: '应收冲应付' }],
  [4, { text: '应收转应收' }],
  [5, { text: '应付转应付' }],
]);
export const FundsTable: React.FC<
  {
    bussType: BussType;
  } & ProTableProps<FUND.fundItem, any>
> = ({ bussType, ...rest }) => {
  const { run, loading, error } = useRequest(
    (params) => {
      return {
        url: `${BussTypeApiUrl[BussType[bussType]]}/list`,
        data: params,
        method: 'POST',
      };
    },
    {
      manual: true,
    },
  );
  const actionRef = useRef<ActionType>();
  const { settlementIdEnum } = useModel('options', (model) => ({
    settlementIdEnum: model.valueEnum('Settlement'),
  }));
  const { accountEnum } = useModel('account', (model) => ({ accountEnum: model.valueEnum }));

  function FundsColumns(): ProColumns<FUND.fundItem>[] {
    const base: ProColumns<FUND.fundItem>[] = [
      keywordColumns({
        placeholder: '请输入单据号或客户名或备注',
      }),
      indexColumns,
      dateRangeColumns({ dataIndex: 'date' }),
      billNoColumns({ bussType }),
      crtNameColumns(),
      checkName(),
      memoColumns(),
      checkStatusColumns(undefined),
      optionColumns({
        modify: async ({ record }) => {
          history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${record.billId}`);
        },
        del: async () => {},
      }),
    ];
    if ([BussType.其他收入单, BussType.其他支出单].indexOf(bussType) > -1) {
      return base.concat([
        suppColumns(undefined, {
          search: false,
          hideInTable: BussType.其他收入单 === bussType,
        }),
        customerColumns(undefined, {
          search: false,
          hideInTable: BussType.其他支出单 === bussType,
        }),
        moneyColumns({
          title: '金额',
          dataIndex: 'amount',
        }),
        moneyColumns({
          title: [BussType.其他收入单].indexOf(bussType) > -1 ? '已收金额' : '应付金额',
          dataIndex: 'acceptedAmount',
        }),
        {
          title: [BussType.其他收入单].indexOf(bussType) > -1 ? '收款状态' : '付款状态',
          dataIndex: 'billStatus',
          valueType: 'select',
          valueEnum:
            [BussType.其他收入单].indexOf(bussType) > -1
              ? new Map([
                  [1, { text: '未收款', status: 'Processing' }],
                  [2, { text: '部分收款', status: 'Warning' }],
                  [3, { text: '已收款', status: 'Success' }],
                ])
              : new Map([
                  [1, { text: '未付款', status: 'Processing' }],
                  [2, { text: '部分付款', status: 'Warning' }],
                  [3, { text: '已付款', status: 'Success' }],
                ]),
          search: false,
        },
      ]);
    }
    if ([BussType.收款单, BussType.付款单].indexOf(bussType) > -1) {
      return base.concat([
        suppColumns(undefined, {
          search: false,
          hideInTable: BussType.收款单 === bussType,
        }),
        customerColumns(undefined, {
          search: false,
          hideInTable: BussType.付款单 === bussType,
        }),
        moneyColumns({
          title: BussType.收款单 === bussType ? '收款合计' : '付款合计',
          dataIndex: 'amount',
        }),
        moneyColumns({
          title: '本次核销金额',
          dataIndex: 'bDeAmount',
          width: 135,
        }),
        {
          title: '整单折扣',
          dataIndex: 'adjustRate',
          search: false,
          valueType: 'percent',
          width: 105,
        },

        moneyColumns({
          title: bussType === BussType.付款单 ? '本次预付款' : '本次预收款',
          dataIndex: 'deAmount',
          width: 135,
        }),
        userColumns({
          render: (_, record) => <div>{record.operName}</div>,
          search: false,
          title: BussType.收款单 === bussType ? '收款人' : '付款人',
        }),
      ]);
    }
    if ([BussType.核销单].indexOf(bussType) > -1) {
      return base.concat([
        {
          title: '供应商',
          dataIndex: 'suppName',
          search: false,
        },
        {
          title: '客户',
          dataIndex: 'custName',
          search: false,
        },
        {
          title: '核销类型',
          dataIndex: 'hxType',
          valueType: 'select',
          valueEnum: HxType,
          search: false,
        },
        {
          title: '核销金额',
          dataIndex: 'hxAmount',
          valueType: 'money',
          search: false,
        },
      ]);
    }
    if (bussType === BussType.资金转账单) {
      return base.concat([
        {
          title: '转出账户',
          dataIndex: 'payAccountId',
          valueEnum: accountEnum,
          render: (_, record) => (
            <ProCard ghost split="horizontal">
              {record.accounts?.map((item) => (
                <ProCard ghost style={{ padding: '3px' }} key={item.autoId}>
                  {item.payAccountName}
                </ProCard>
              ))}
            </ProCard>
          ),
        },
        {
          title: '转入账户',
          valueType: 'select',
          dataIndex: 'recAccountId',
          valueEnum: accountEnum,
          render: (_, record) => (
            <ProCard ghost split="horizontal">
              {record.accounts?.map((item) => (
                <ProCard ghost style={{ padding: '3px' }} key={item.autoId}>
                  {item.recAccountName}
                </ProCard>
              ))}
            </ProCard>
          ),
        },
        moneyColumns({
          title: '金额',
          render: (_, record) => (
            <ProCard ghost split="horizontal">
              {record.accounts?.map((item) => (
                <ProCard ghost style={{ padding: '3px' }} key={item.autoId}>
                  ￥{item.amount}
                </ProCard>
              ))}
            </ProCard>
          ),
        }),
        moneyColumns({
          dataIndex: 'totalAmount',
          title: '合计金额',
        }),
      ]);
    }
    return [];
  }
  const initProps: ProTableProps<FUND.fundItem, any> = {
    loading,
    request: async (params) => {
      const res = await run(transProTableParamsToMyRequest(params));
      return {
        data: res.rows,
        success: !error,
      };
    },
    actionRef,
    rowSelection: {},
    tableAlertOptionRender: ({ selectedRowKeys }) => {
      return (
        <Space size={16}>
          <CheckButton
            url={`${BussTypeComponentUrl[BussType[bussType]]}/check`}
            selectedRowKeys={selectedRowKeys}
            actionRef={actionRef}
          />
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
    },
    expandable:
      bussType === BussType.资金转账单
        ? undefined
        : {
            expandedRowRender: (record) => {
              return (
                <ProList<FUND.Accounts>
                  grid={{ gutter: 16, column: 4 }}
                  rowKey="autoId"
                  dataSource={record.accounts}
                  metas={{
                    title: {
                      dataIndex: 'accountId',
                      valueType: 'select',
                      valueEnum: accountEnum,
                    },
                    content: {
                      dataIndex: 'settlementNo',
                      render: (_, r) => (
                        <Space size={0}>
                          <Tag color="blue">{r.settlementNo}</Tag>
                          <Tag color="error">￥{r.payment}</Tag>
                          <Text>{r.remark}</Text>
                        </Space>
                      ),
                    },
                    subTitle: {
                      dataIndex: 'settlementId',
                      valueType: 'select',
                      valueEnum: settlementIdEnum,
                    },
                    avatar: {},
                  }}
                />
              );
            },
          },
    options: false,
    search: baseSearch({
      url: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
    }),
    columns: FundsColumns(),
    rowKey: 'billId',
    pagination: false,
    scroll: { x: 1500 },
    footer: (recordList) => {
      if (bussType === BussType.资金转账单) {
        return undefined;
      }
      const amountTotal = recordList.reduce((a, b) => a + (b.amount || 0), 0);
      const bDeAmountTotal = recordList.reduce((a, b) => a + (b.bDeAmount || 0), 0);
      const deAmountTotal = recordList.reduce((a, b) => a + (b.deAmount || 0), 0);
      return (
        <StatisticCard.Group>
          <StatisticCard
            statistic={{
              title: BussType.收款单 === bussType ? '收款合计' : '付款合计',
              value: amountTotal,
              status: 'default',
            }}
          />
          <StatisticCard.Divider />
          <StatisticCard
            statistic={{
              title: '核销金额合计',
              value: bDeAmountTotal,
              status: 'processing',
            }}
          />
          <StatisticCard.Divider />
          <StatisticCard
            statistic={{
              title: '预付款合计',
              value: deAmountTotal,
              status: 'success',
            }}
          />
        </StatisticCard.Group>
      );
    },
  };
  const props = { ...initProps, ...rest };
  return <ProTable<FUND.fundItem> {...props} />;
};

export function FindUnHxListColumns(select = true): ProColumns<FUND.Entries>[] {
  return [
    {
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'dateRange',
      initialValue: [moment().subtract(1, 'month'), moment()],
      title: '日期',
      search: {
        transform: (time) => ({
          beginDate: time[0],
          endDate: time[1],
        }),
      },
    },
    {
      dataIndex: 'billNo',
      title: '源单编号',
      search: false,
      editable: false,
    },
    {
      dataIndex: 'bussType',
      title: '业务类别',
      valueType: 'select',
      valueEnum: BussTypeEnum,
      search: false,
      editable: false,
    },
    {
      dataIndex: 'billDate',
      title: '单据日期',
      valueType: 'date',
      search: false,
      editable: false,
    },
    {
      dataIndex: 'billPrice',
      title: '单据金额',
      valueType: 'money',
      search: false,
      editable: false,
    },
    {
      dataIndex: 'hasCheck',
      title: '已核销金额',
      search: false,
      editable: false,
      valueType: 'money',
    },
    {
      dataIndex: 'notCheck',
      title: '未核销金额',
      search: false,
      editable: false,
      valueType: 'money',
    },
    {
      dataIndex: 'nowCheck',
      title: <div className={Styles['error-color']}>*本次核销金额</div>,
      search: false,
      hideInTable: select,
      valueType: 'money',
    },
    {
      dataIndex: 'remark',
      title: '分录备注',
      search: false,
      editable: false,
      hideInTable: !select,
    },
  ];
}

export const FindUnHxList: React.FC<{
  value?: FUND.Entries[];
  onChange?: (value: FUND.Entries[]) => void;
  disabled?: boolean;
  formRef?: any;
  bussType: BussType;
  buttonProps?: ButtonProps;
  tableProps?: ProTableProps<FUND.Entries, any>;
  setEntriesKeys?: (k: K[]) => void;
}> = ({
  value,
  onChange,
  children,
  formRef,
  bussType,
  tableProps,
  buttonProps,
  setEntriesKeys,
}) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedEntries, setSelectedEntries] = useState<FUND.Entries[]>(value || []);
  const handleOk = (recordList: FUND.Entries[]) => {
    onChange?.(recordList);
    setEntriesKeys?.(recordList.map((i) => i.autoId));
    setVisible(false);
  };
  const [custId, setCustId] = useState<K>();
  const [suppId, setSuppId] = useState<K>();
  return (
    <>
      <Button
        type={'dashed'}
        onClick={() => {
          if (bussType === BussType.收款单) {
            formRef?.current
              .validateFields(['custId'])
              .then(() => {
                setCustId(formRef.current?.getFieldValue('custId'));
                setVisible(true);
              })
              .catch(() => {
                message.error('请选择销货客户');
              });
          } else {
            formRef?.current
              .validateFields(['suppId'])
              .then(() => {
                setSuppId(formRef.current?.getFieldValue('suppId'));
                setVisible(true);
              })
              .catch(() => {
                message.error('请选择供应商');
              });
          }
        }}
        {...buttonProps}
      >
        {children}
      </Button>
      <Modal
        visible={visible}
        width={1000}
        okText={'选中并关闭'}
        cancelText={'关闭'}
        onCancel={async () => {
          setVisible(false);
        }}
        footer={[
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
        ]}
      >
        <ProTable<FUND.Entries>
          pagination={{ pageSize: 5 }}
          onRow={(record) => {
            return {
              onDoubleClick: () => {
                setSelectedEntries([record]);
                handleOk([record]);
                setVisible(false);
              },
            };
          }}
          rowSelection={{
            onChange: (a, b) => {
              setSelectedEntries(b);
            },
          }}
          params={{ custId, bussType, suppId }}
          rowKey="billId"
          options={false}
          columns={FindUnHxListColumns()}
          request={async (params) => {
            const response = await fundUnHxList(transProTableParamsToMyRequest(params));
            return {
              data: response.data.rows,
              success: response.code === 0,
              total: response.data.total,
            };
          }}
          {...tableProps}
        />
      </Modal>
    </>
  );
};

/**
 * 资金单据的金额计算，每种单据的算法根据bussType自行处理，不混合
 * @param entries
 * @param accounts
 * @param rpAmount
 * @param totalAmount
 * @param bussType
 */
export function calFundPrice({
  entries,
  accounts,
  rpAmount,
  bussType,
  discount,
}: {
  entries?: FUND.Entries[];
  rpAmount?: number;
  totalAmount?: number;
  accounts?: FUND.Accounts[];
  discount?: number;
  bussType?: BussType;
}) {
  if (bussType && [BussType.收款单, BussType.付款单].indexOf(bussType) > -1) {
    const accountsPayment = accounts?.reduce((a, b) => a + (b.payment || 0), 0) || 0;
    const entriesNowCheck = entries?.reduce((a, b) => a + (b.nowCheck || 0), 0) || 0;
    return {
      discount,
      payment: accountsPayment - entriesNowCheck + (discount || 0),
      AdvancePaymennt: accountsPayment - entriesNowCheck + (discount || 0),
    };
  }
  if ([BussType.其他收入单, BussType.其他支出单].indexOf(bussType || 0) > -1) {
    const entriesAmount = entries?.reduce((a, b) => a + (b?.amount || 0), 0) || 0;
    return {
      arrears: entriesAmount - (rpAmount || 0),
      totalAmount: entriesAmount,
    };
  }
  if (bussType === BussType.资金转账单) {
    console.log(accounts?.reduce((a, b) => a + (b?.amount || 0), 0) || 0);
    return {
      totalAmount: accounts?.reduce((a, b) => a + (b?.amount || 0), 0) || 0,
    };
  }
  return {};
}

export const FundsForm: React.FC<{
  bussType: BussType;
}> = ({ bussType }) => {
  const { id } = useParams<{ id: string }>();
  const [accountsKeys, setAccountsKeys] = useState<React.Key[]>();
  const [entriesKeys, setEntriesKeys] = useState<React.Key[]>();
  const [checked, setChecked] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();
  const { raccttypeEnum, paccttypeEnum } = useModel('options', (model) => ({
    raccttypeEnum: model.valueEnum('Raccttype'),
    paccttypeEnum: model.valueEnum('Paccttype'),
  }));
  const { accountEnum } = useModel('account', (model) => ({
    accountEnum: model.valueEnum,
  }));
  const { SettlementEnum } = useModel('options', (model) => ({
    SettlementEnum: model.valueEnum('Settlement'),
  }));
  const { run, loading, refresh, data } = useRequest(
    async () => {
      if (id === 'new') {
        const billNo = (await getCode(FundTypeCode[BussType[bussType]])).data;
        const accounts = Array.from({ length: 1 }, () => ({
          autoId: +(Math.random() * 1000000).toFixed(0),
        }));
        setAccountsKeys(accounts.map((item) => item.autoId));
        const res: Partial<FUND.fundItem> = {
          billId: '',
          billNo,
          date: moment().format('YYYY-MM-DD'),
          accounts,
          rpAmount: 0,
          arrears: 0,
          totalAmount: 0,
        };
        return {
          data: res,
          success: true,
        };
      }
      const res: Partial<FUND.fundItem> = (
        await request(`${BussTypeApiUrl[BussType[bussType]]}/info?id=${id}`, {
          method: 'GET',
        })
      ).data;
      setChecked(res.checkStatus === 2);
      if (res.checkStatus !== 2) {
        setAccountsKeys(res.accounts?.map((i) => i.autoId));
        setEntriesKeys(res.entries?.map((i) => i.autoId));
      }
      return {
        data: res,
        success: true,
      };
    },
    {
      manual: true,
      onSuccess: async (values: any) => {
        formRef.current?.setFieldsValue(values);
      },
    },
  );
  const { confirm } = Modal;
  const addUpd = useRequest(
    async (v: FUND.fundItem) => {
      if (id === 'new') {
        const res = await request(`${BussTypeApiUrl[BussType[bussType]]}/add`, {
          data: v,
          method: 'POST',
        });
        return {
          data: res.data.id,
          success: true,
        };
      }
      const res = await request(`${BussTypeApiUrl[BussType[bussType]]}/upd`, {
        data: {
          ...data,
          ...v,
        },
        method: 'POST',
      });
      return {
        data: res.id,
        success: true,
      };
    },
    {
      manual: true,
      onSuccess: (v) => {
        if (id === 'new') {
          confirm({
            content: `新增单据成功`,
            okText: '继续添加',
            onOk: () => {
              history.push(`${BussTypeComponentUrl[BussType[bussType]]}/new`);
            },
            onCancel: () => {
              history.push(`${BussTypeComponentUrl[BussType[bussType]]}/${v}`);
            },
          });
        } else {
          message.success('更新单据成功');
          refresh();
        }
      },
    },
  );
  useEffect(() => {
    run();
  }, [id, run]);

  const columns: ProColumns<FUND.Entries>[] = [
    indexColumns,
    {
      title: '操作',
      valueType: 'option',
      width: 50,
      fixed: 'left',
      render: (text, record, _index, action) => [
        <Button
          key="editable"
          type="link"
          disabled={checked}
          onClick={() => {
            action?.startEditable?.(record.autoId);
          }}
        >
          编辑
        </Button>,
      ],
    },
    {
      dataIndex: 'raccttype',
      title: '收入类别',
      valueType: 'select',
      valueEnum: raccttypeEnum,
      hideInTable: bussType !== BussType.其他收入单,
    },
    {
      dataIndex: 'paccttype',
      title: '支出类别',
      valueType: 'select',
      valueEnum: paccttypeEnum,
      hideInTable: bussType !== BussType.其他支出单,
    },
    {
      dataIndex: 'amount',
      title: '金额',
      valueType: 'money',
    },
    {
      dataIndex: 'memo',
      title: '备注',
    },
    {
      width: '40%',
      editable: false,
    },
  ];
  return (
    <PageContainer
      loading={loading}
      title={false}
      content={
        <ProCard bordered style={{ boxShadow: ' 0 1px 3px rgb(0 0 0 / 20%)' }}>
          <ProForm<FUND.fundItem>
            submitter={{
              render: ({ form }) => (
                <FooterToolbar>
                  {[
                    <CheckAudit checkStatus={checked} key={'checkImg'} />,
                    <Space key="action">
                      {id !== 'new' && (
                        <CheckTwoButton
                          key="check"
                          url={`${BussTypeApiUrl[BussType[bussType]]}/check`}
                          selectedRowKeys={[id]}
                          refresh={refresh}
                          checkStatus={checked ? 1 : 2}
                        />
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
                  ]}
                </FooterToolbar>
              ),
            }}
            formRef={formRef}
            onValuesChange={(values: FUND.fundItem) => {
              if (
                !lodash.isEmpty(
                  lodash.pick(values, ['entries', 'accounts', 'rpAmount', 'bussType', 'discount']),
                )
              ) {
                formRef.current?.setFieldsValue({
                  ...calFundPrice({
                    ...formRef.current?.getFieldsValue(),
                    bussType,
                  }),
                });
              }
            }}
            onFinish={async (v) => {
              addUpd.run(v);
            }}
          >
            <ProFormText hidden width="md" name="billId" label="单据编号" disabled />
            <ProForm.Group>
              {bussType === BussType.核销单 && (
                <ProFormSelect name="hxType" label="业务类型" width="md" valueEnum={HxTypeEnum} />
              )}
              {bussType !== BussType.资金转账单 && (
                <ProFormDependency name={['suppName']}>
                  {({ suppName }) => {
                    if ([BussType.付款单, BussType.其他支出单].indexOf(bussType) > -1) {
                      return (
                        <ProForm.Item
                          name="suppId"
                          label="供应商"
                          style={{ width: '328px' }}
                          rules={
                            [BussType.付款单].indexOf(bussType) > -1
                              ? patternMsg.select('')
                              : undefined
                          }
                        >
                          <SupplierSelect suppName={suppName} disabled={checked} />
                        </ProForm.Item>
                      );
                    }
                    return (
                      <ProForm.Item
                        name="custId"
                        label="客户"
                        style={{ width: '328px' }}
                        rules={
                          [BussType.收款单].indexOf(bussType) > -1
                            ? patternMsg.select('')
                            : undefined
                        }
                      >
                        <CustomerSelect
                          onChange={(v) => {
                            if (v instanceof Object)
                              formRef.current?.setFieldsValue({
                                ...v,
                              });
                          }}
                          custName={suppName}
                          disabled={checked}
                          labelInValue
                        />
                      </ProForm.Item>
                    );
                  }}
                </ProFormDependency>
              )}
              <ProFormDatePicker width="md" name="date" label="单据日期" disabled={checked} />
              <ProFormText
                width="md"
                name="billNo"
                label="单据编号"
                disabled
                rules={patternMsg.text('单据编号')}
              />
            </ProForm.Group>
            {bussType === BussType.收款单 && (
              <ProForm.Group>
                <ProFormDigit name="accountPayableSum" label="总欠款" disabled width="md" />
                <UserSelect showNew name="operId" label="收款人" disabled={checked} />
              </ProForm.Group>
            )}
            {[BussType.其他收入单, BussType.其他支出单].indexOf(bussType) > -1 && (
              <ProForm.Item name="entries" trigger="onValuesChange">
                <EditableProTable<FUND.Entries>
                  rowKey="autoId"
                  bordered
                  recordCreatorProps={{
                    newRecordType: 'dataSource',
                    record: {
                      autoId: +(Math.random() * 1000000).toFixed(0),
                    },
                  }}
                  columns={columns}
                  editable={{
                    type: 'multiple',
                    editableKeys: entriesKeys,
                    onChange: setEntriesKeys,
                    actionRender: (row, config, defaultDom) => [defaultDom.delete],
                  }}
                />
              </ProForm.Item>
            )}

            {[BussType.收款单, BussType.付款单].indexOf(bussType) > -1 && (
              <>
                <ProForm.Item name="accounts" trigger="onValuesChange">
                  <EditableProTable<FUND.Accounts>
                    rowKey="autoId"
                    bordered
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      record: {
                        autoId: +(Math.random() * 1000000).toFixed(0),
                      },
                    }}
                    editable={{
                      type: 'multiple',
                      editableKeys: accountsKeys,
                      onChange: setAccountsKeys,
                      actionRender: (row, config, defaultDom) => [defaultDom.delete],
                    }}
                    columns={[
                      indexColumns,
                      {
                        dataIndex: 'accountId',
                        title: (
                          <Text type="danger">
                            {bussType === BussType.收款单 ? '*收款账户' : '*付款账户'}
                          </Text>
                        ),
                        valueType: 'select',
                        valueEnum: accountEnum,
                      },
                      {
                        dataIndex: 'payment',
                        title: (
                          <Text type="danger">
                            {bussType === BussType.收款单 ? '*收款金额' : '*付款金额'}
                          </Text>
                        ),
                        valueType: 'money',
                      },
                      {
                        dataIndex: 'settlementId',
                        title: '结算方式',
                        valueType: 'select',
                        valueEnum: SettlementEnum,
                      },
                      {
                        dataIndex: 'settlementNo',
                        title: '结算号',
                      },
                      {
                        dataIndex: 'memo',
                        title: '备注',
                      },
                    ]}
                  />
                </ProForm.Item>
                <ProForm.Item name="entries" trigger="onValuesChange">
                  <EditableProTable<FUND.Entries>
                    rowKey="autoId"
                    toolbar={{
                      actions: [
                        <ProForm.Item key="select" name="entries" noStyle>
                          <FindUnHxList
                            buttonProps={{
                              disabled: checked,
                            }}
                            children="选择源单"
                            formRef={formRef}
                            bussType={bussType}
                            setEntriesKeys={setEntriesKeys}
                          />
                        </ProForm.Item>,
                      ],
                    }}
                    bordered
                    recordCreatorProps={false}
                    editable={{
                      type: 'multiple',
                      editableKeys: entriesKeys,
                      onChange: setEntriesKeys,
                      actionRender: (row, config, defaultDom) => [defaultDom.delete],
                    }}
                    columns={FindUnHxListColumns(false)}
                  />
                </ProForm.Item>
                <ProForm.Group>
                  <ProFormDigit name="discount" label="整单折扣" width="md" initialValue={0} />
                  {bussType === BussType.收款单 ? (
                    <ProFormDigit name="payment" label="本次预收款" disabled width="md" />
                  ) : (
                    <ProFormDigit name="AdvancePaymennt" label="本次预付款" disabled width="md" />
                  )}
                </ProForm.Group>
              </>
            )}
            {[BussType.其他收入单, BussType.其他支出单].indexOf(bussType) > -1 && (
              <ProForm.Group>
                <AccountSelect
                  name="accountId"
                  label="结算账户"
                  formRef={formRef}
                  disabled={checked}
                />
                <ProFormDigit width="sm" name="totalAmount" label="合计" disabled />
                <ProFormDigit width="sm" name="arrears" label="本次欠款" disabled />
                <ProFormDependency name={['totalAmount']}>
                  {({ totalAmount }) => (
                    <ProFormDigit width="sm" name="rpAmount" label="收款金额" max={totalAmount} />
                  )}
                </ProFormDependency>
              </ProForm.Group>
            )}

            {bussType === BussType.核销单 && (
              <>
                <ProForm.Item name="entriesA" trigger="onValuesChange">
                  <EditableProTable<FUND.Entries>
                    rowKey="autoId"
                    toolbar={{
                      actions: [
                        <ProForm.Item key="select" name="entries" noStyle>
                          <FindUnHxList children="选择源单" formRef={formRef} bussType={bussType} />
                        </ProForm.Item>,
                      ],
                    }}
                    bordered
                    recordCreatorProps={false}
                    columns={FindUnHxListColumns(false)}
                  />
                </ProForm.Item>

                <ProForm.Item name="entriesB" trigger="onValuesChange">
                  <EditableProTable<FUND.Entries>
                    rowKey="autoId"
                    toolbar={{
                      actions: [
                        <ProForm.Item key="select" name="entries" noStyle>
                          <FindUnHxList children="选择源单" formRef={formRef} bussType={bussType} />
                        </ProForm.Item>,
                      ],
                    }}
                    bordered
                    recordCreatorProps={false}
                    columns={FindUnHxListColumns(false)}
                  />
                </ProForm.Item>
              </>
            )}

            {bussType === BussType.资金转账单 && (
              <>
                <ProForm.Item name="accounts" trigger="onValuesChange">
                  <EditableProTable<FUND.Accounts>
                    rowKey="autoId"
                    bordered
                    recordCreatorProps={{
                      newRecordType: 'dataSource',
                      record: {
                        autoId: +(Math.random() * 1000000).toFixed(0),
                      },
                    }}
                    editable={{
                      type: 'multiple',
                      editableKeys: accountsKeys,
                      onChange: setAccountsKeys,
                      actionRender: (row, config, defaultDom) => [defaultDom.delete],
                    }}
                    columns={[
                      indexColumns,
                      {
                        dataIndex: 'payAccountId',
                        title: '转出账户',
                        valueType: 'select',
                        valueEnum: accountEnum,
                      },
                      {
                        dataIndex: 'recAccountId',
                        title: '转入账户',
                        valueType: 'select',
                        valueEnum: accountEnum,
                      },
                      {
                        dataIndex: 'amount',
                        title: '金额',
                        valueType: 'money',
                      },
                      {
                        dataIndex: 'settlement',
                        title: '结算方式',
                        valueType: 'select',
                        valueEnum: SettlementEnum,
                      },
                      {
                        dataIndex: 'settlementNo',
                        title: '结算号',
                      },
                      {
                        dataIndex: 'remark',
                        title: '分单备注',
                      },
                    ]}
                    summary={(d) => {
                      return (
                        <Table.Summary.Row>
                          <Table.Summary.Cell index={0} colSpan={3}>
                            合计
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={1} colSpan={1}>
                            <Text type="danger">
                              ￥{d.reduce((a, b) => a + (b?.amount || 0), 0)}
                            </Text>
                          </Table.Summary.Cell>
                          <Table.Summary.Cell index={2} colSpan={3} />
                        </Table.Summary.Row>
                      );
                    }}
                  />
                </ProForm.Item>
                <ProFormDigit width="sm" name="totalAmount" label="合计" disabled hidden />
              </>
            )}
            <ProFormTextArea name="memo" label="整单备注" />
          </ProForm>
        </ProCard>
      }
    />
  );
};
