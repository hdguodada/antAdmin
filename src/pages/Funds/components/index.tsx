import { CheckTwoButton } from '@/components/CheckButton';
import CustomerSelect from '@/pages/Bas/customer/customerSelect';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  CheckAudit,
} from '@/pages/Purchase/components';
import { fundUnHxList } from '@/services/Funds';
import { getCode } from '@/services/Sys';
import {
  baseSearch,
  billNoColumns,
  checkName,
  crtNameColumns,
  indexColumns,
  keywordColumns,
  memoColumns,
  optionColumns,
} from '@/utils/columns';
import { AccountSelect, UserSelect } from '@/utils/form';
import { patternMsg } from '@/utils/validator';
import ProCard from '@ant-design/pro-card';
import type { FormInstance } from '@ant-design/pro-form';
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
}
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
  const FundsColumns: ProColumns<FUND.fundItem>[] = [
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
    {
      title: [BussType.其他收入单, BussType.收款单].indexOf(bussType) > -1 ? '客户' : '供应商',
      dataIndex: 'contactName',
      search: false,
    },
    {
      title: '金额',
      dataIndex: 'amount',
      search: false,
      valueType: 'money',
    },
    {
      title: '收款方式',
      dataIndex: 'amount',
      search: false,
      valueType: 'money',
    },
    crtNameColumns(),
    checkName(),
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
    memoColumns(),
    optionColumns({
      modify: async ({ record }) => {
        history.push(`${BussTypeComponentUrl.其他收入单}/${record.billId}`);
      },
      del: async () => {},
    }),
  ];
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
      options={false}
      search={baseSearch({
        url: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
      })}
      columns={FundsColumns}
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
      hideInTable: !select,
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
  const { run, loading, refresh } = useRequest(
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
        >
          <ProFormText hidden width="md" name="billId" label="单据编号" disabled />
          <ProForm.Group>
            <ProFormDependency name={['contactName']}>
              {({ contactName }) => {
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
        </ProForm>
      </ProCard>
    </PageContainer>
  );
};
