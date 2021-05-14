import { CheckTwoButton } from '@/components/CheckButton';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
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
  indexColumns,
  keywordColumns,
  memoColumns,
  optionColumns,
} from '@/utils/columns';
import { AccountSelect, UserSelect } from '@/utils/form';
import { patternMsg } from '@/utils/validator';
import ProCard from '@ant-design/pro-card';
import { FormInstance, ProFormTextArea } from '@ant-design/pro-form';
import { ProFormSelect } from '@ant-design/pro-form';
import ProForm, {
  ProFormDatePicker,
  ProFormDependency,
  ProFormDigit,
  ProFormText,
} from '@ant-design/pro-form';
import { PageContainer } from '@ant-design/pro-layout';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table/lib/typing';
import { Button, message, Modal, Space } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { useRequest, history, useParams, request, useModel } from 'umi';

export enum FundTypeCode {
  其他收入单 = 'QTSR',
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
export const FundsTable: React.FC<{
  bussType: BussType;
}> = ({ bussType }) => {
  const { run, loading, error } = useRequest(
    (params) => {
      return {
        url: `${BussTypeApiUrl[BussType[bussType]]}/list`,
        data: {
          ...params,
          quryFilter: params,
          dev: 'funds',
        },
        method: 'POST',
      };
    },
    {
      manual: true,
    },
  );
  function FundsColumns(): ProColumns<FUND.fundItem>[] {
    const base: ProColumns<FUND.fundItem>[] = [
      keywordColumns({
        placeholder: '请输入单据号或客户名或备注',
      }),
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
      billNoColumns(),
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
        {
          title: '供应商',
          dataIndex: 'suppName',
          search: false,
          hideInTable: BussType.其他收入单 === bussType,
        },
        {
          title: '客户',
          dataIndex: 'custName',
          search: false,
          hideInTable: BussType.其他支出单 === bussType,
        },
        {
          title: '金额',
          dataIndex: 'amount',
          search: false,
          valueType: 'money',
        },

        {
          title: [BussType.其他收入单].indexOf(bussType) > -1 ? '已收金额' : '应付金额',
          dataIndex: 'acceptedAmount',
          valueType: 'money',
          search: false,
        },
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
        {
          title: '供应商',
          dataIndex: 'suppName',
          search: false,
          hideInTable: BussType.收款单 === bussType,
        },
        {
          title: '客户',
          dataIndex: 'custName',
          search: false,
          hideInTable: BussType.付款单 === bussType,
        },
        {
          title: BussType.收款单 === bussType ? '收款信息' : '付款信息',
          children: [
            {
              title: '结算账户',
              search: false,
              render: (_, record) => (
                <Space direction="vertical">
                  {record.accounts?.map((item) => (
                    <div key={item.accountId}>{item.accountName}</div>
                  ))}
                </Space>
              ),
            },
            {
              title: BussType.收款单 === bussType ? '收款金额' : '付款金额',
              search: false,
              render: (_, record) => (
                <Space direction="vertical">
                  {record.accounts?.map((item) => (
                    <div key={item.accountId}>{item.payment}</div>
                  ))}
                </Space>
              ),
            },
            {
              title: BussType.收款单 === bussType ? '收款方式' : '付款方式',
              search: false,
              render: (_, record) => (
                <Space direction="vertical">
                  {record.accounts?.map((item) => (
                    <div key={item.accountId}>{item.settlementName}</div>
                  ))}
                </Space>
              ),
            },
            {
              title: '结算号',
              search: false,
              render: (_, record) => (
                <Space direction="vertical">
                  {record.accounts?.map((item) => (
                    <div key={item.accountId}>{item.settlementNo}</div>
                  ))}
                </Space>
              ),
            },
            {
              title: '分录备注',
              search: false,
              render: (_, record) => (
                <Space direction="vertical">
                  {record.accounts?.map((item) => (
                    <div key={item.accountId}>{item.remark}</div>
                  ))}
                </Space>
              ),
            },
            {
              title: BussType.收款单 === bussType ? '收款合计' : '付款合计',
              dataIndex: 'amount',
              search: false,
              valueType: 'money',
            },
          ],
        },
        {
          title: '本次核销金额',
          dataIndex: 'bDeAmount',
          search: false,
          valueType: 'money',
        },
        {
          title: '整单折扣',
          dataIndex: 'adjustRate',
          search: false,
          valueType: 'percent',
        },
        {
          title: '本次预收款',
          dataIndex: 'deAmount',
          search: false,
          valueType: 'money',
        },
        {
          title: BussType.收款单 === bussType ? '收款人' : '付款人',
          dataIndex: 'operName',
          search: false,
        },
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
          dataIndex: 'billDate',
          title: '转账日期',
          search: false,
        },
        {
          title: '转账信息',
          children: [
            {
              title: '转出账户',
              render: (_, record) => (
                <ProCard ghost split="horizontal">
                  {record.accounts?.map((item) => (
                    <ProCard layout="center" ghost style={{ padding: '3px' }} key={item.autoId}>
                      {item.payAccountName}
                    </ProCard>
                  ))}
                </ProCard>
              ),
            },
            {
              title: '转入账户',
              align: 'center',
              render: (_, record) => (
                <ProCard ghost split="horizontal">
                  {record.accounts?.map((item) => (
                    <ProCard ghost layout="center" style={{ padding: '3px' }} key={item.autoId}>
                      {item.recAccountName}
                    </ProCard>
                  ))}
                </ProCard>
              ),
            },
            {
              title: '金额',
              render: (_, record) => (
                <ProCard ghost split="horizontal">
                  {record.accounts?.map((item) => (
                    <ProCard ghost layout="center" style={{ padding: '3px' }} key={item.autoId}>
                      ￥{item.amount}
                    </ProCard>
                  ))}
                </ProCard>
              ),
            },
          ],
        },
        {
          dataIndex: 'totalAmount',
          title: '合计金额',
          search: false,
        },
      ]);
    }
    return [];
  }
  return (
    <ProTable<FUND.fundItem>
      loading={loading}
      request={async (params) => {
        const res = await run(params);
        return {
          data: res.rows,
          success: !error,
        };
      }}
      bordered
      className="proCardNoPadding"
      options={false}
      search={baseSearch({
        url: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
      })}
      columns={FundsColumns()}
      rowKey="billId"
      pagination={{ pageSize: 10 }}
    />
  );
};

export function FindUnHxListColumns(select = true): ProColumns<FUND.Entries>[] {
  return [
    {
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'dateRange',
      initialValue: [moment().startOf('month'), moment()],
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
      valueEnum: BussType,
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
    },
    {
      dataIndex: 'notCheck',
      title: '未核销金额',
      search: false,
      editable: false,
    },
    {
      dataIndex: 'nowCheck',
      title: '本次核销金额',
      search: false,
      hideInTable: select,
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
}> = ({ value, onChange, children, formRef, bussType }) => {
  const [visible, setVisible] = useState<boolean>(false);
  const [selectedEntries, setSelectedEntries] = useState<FUND.Entries[]>(value || []);
  const handleOk = (recordList: FUND.Entries[]) => {
    onChange?.(recordList);
    setVisible(false);
  };
  const [custId, setCustId] = useState<React.Key>();
  return (
    <>
      <Button
        type={'dashed'}
        onClick={() => {
          formRef?.current
            .validateFields(['custId'])
            .then(() => {
              setCustId(formRef.current?.getFieldValue('custId'));
              setVisible(true);
            })
            .catch(() => {
              message.error('请选择销货客户');
            });
        }}
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
              },
            };
          }}
          rowSelection={{
            onChange: (a, b) => {
              setSelectedEntries(b);
            },
          }}
          params={{ custId, bussType }}
          rowKey="billId"
          options={false}
          columns={FindUnHxListColumns()}
          request={async (params) => {
            const response = await fundUnHxList({
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

export function calFundPrice({
  entries,
  rpAmount,
  totalAmount,
}: {
  entries?: FUND.Entries[];
  rpAmount?: number;
  totalAmount?: number;
}) {
  if (entries) {
    let t = 0;
    entries.forEach((item) => {
      t += item?.amount || 0;
    });
    return {
      arrears: 0,
      totalAmount: t,
      rpAmount: t,
    };
  }
  if (rpAmount && totalAmount) {
    return {
      arrears: totalAmount - rpAmount,
    };
  }
  return {};
}
export const FundsForm: React.FC<{
  bussType: BussType;
}> = ({ bussType }) => {
  const { id } = useParams<{ id: string }>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
  const [checked, setChecked] = useState<boolean>(false);
  const formRef = useRef<FormInstance>();
  const { raccttypeEnum } = useModel('options', (model) => ({
    raccttypeEnum: model.valueEnum('Raccttype'),
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
        const entries = [
          {
            autoId: +(Math.random() * 1000000).toFixed(0),
          },
        ];
        setEditableKeys(entries.map((item) => item.autoId));
        const res: Partial<FUND.fundItem> = {
          billId: '',
          billNo,
          date: moment().format('YYYY-MM-DD'),
          entries,
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
          data: {
            dev: 'funds',
          },
          method: 'GET',
        })
      ).data;
      const data = {
        ...res,
        entries: res.entries?.map((item) => ({
          ...item,
          autoId: +(Math.random() * 1000000).toFixed(0),
        })),
      };
      setChecked(data.checkStatus === 2);
      if (data.checkStatus !== 2) {
        setEditableKeys(data.entries?.map((i) => i.autoId));
      }
      return {
        data,
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
  const addUpd = useRequest(
    async (v: FUND.fundItem) => {
      if (id === 'new') {
        const res = await request(`${BussTypeApiUrl[BussType[bussType]]}/add`, {
          data: {
            ...v,
            dev: 'funds',
          },
          method: 'POST',
        });
        return {
          data: res.id,
          success: true,
        };
      }
      const res = await request(`${BussTypeApiUrl[BussType[bussType]]}/upd`, {
        data: {
          ...data,
          ...v,
          dev: 'funds',
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
            action.startEditable?.(record.autoId);
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
      footer={[
        <CheckAudit checkStatus={checked} key={'checkImg'} />,
        <Space key="action">
          {id !== 'new' ? (
            <>
              <CheckTwoButton
                key="check"
                url={'initialValues.checkButton.url'}
                selectedRowKeys={[id]}
                refresh={'refresh'}
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
    >
      <ProCard bordered style={{ boxShadow: ' 0 1px 3px rgb(0 0 0 / 20%)' }}>
        <ProForm<FUND.fundItem>
          submitter={false}
          formRef={formRef}
          onValuesChange={(values: FUND.fundItem) => {
            if (values.entries) {
              formRef.current?.setFieldsValue({
                ...calFundPrice({ entries: values.entries }),
              });
            }
            if (values.rpAmount) {
              formRef.current?.setFieldsValue({
                ...calFundPrice({
                  rpAmount: values.rpAmount,
                  totalAmount: formRef.current?.getFieldValue('totalAmount'),
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
              <ProFormDependency name={['contactName']}>
                {({ contactName }) => {
                  if ([BussType.付款单, BussType.其他支出单].indexOf(bussType) > -1) {
                    return (
                      <ProForm.Item
                        name="suppId"
                        label="供应商"
                        rules={
                          [BussType.付款单].indexOf(bussType) > -1
                            ? patternMsg.select('')
                            : undefined
                        }
                      >
                        <SupplierSelect suppName={contactName} disabled={checked} />
                      </ProForm.Item>
                    );
                  }
                  return (
                    <ProForm.Item
                      name="custId"
                      label="客户"
                      rules={
                        [BussType.收款单].indexOf(bussType) > -1 ? patternMsg.select('') : undefined
                      }
                    >
                      <CustomerSelect custName={contactName} disabled={checked} />
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
              <ProFormDigit name="totalArrears" label="总欠款" disabled width="md" />
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
                  editableKeys,
                  onChange: setEditableKeys,
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
                    editableKeys,
                    onChange: setEditableKeys,
                    actionRender: (row, config, defaultDom) => [defaultDom.delete],
                  }}
                  columns={[
                    indexColumns,
                    {
                      dataIndex: 'accountId',
                      title: '结算账户',
                      valueType: 'select',
                      valueEnum: accountEnum,
                    },
                    {
                      dataIndex: 'payment',
                      title: '收款金额',
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
                      dataIndex: 'memo',
                      title: '备注',
                    },
                  ]}
                />
              </ProForm.Item>
              <ProForm.Item name="entries">
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
                    editableKeys,
                    onChange: setEditableKeys,
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
                      title: '备注',
                    },
                  ]}
                />
              </ProForm.Item>
            </>
          )}
          <ProFormTextArea name="memo" label="备注" />
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
