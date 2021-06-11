import { useRequest, history } from 'umi';
import { CheckButton, CheckTwoButton, OpenButton } from '@/components/CheckButton';
import {
  BussType,
  BussTypeApiUrl,
  BussTypeComponentUrl,
  CheckAudit,
  GenerateButton,
  SkuSelect,
  StockType,
  StoreSelectChangeCurrentQty,
} from '@/pages/Purchase/components';
import type { XhddEntriesProps } from '@/pages/Sales/components';
import { BussCodeId } from '@/pages/Sales/components';
import {
  queryPurchaseInfo,
  addPurchase,
  updPurchase,
  delPurchase,
  queryPurchase,
} from '@/services/Purchase';
import { getCode } from '@/services/Sys';
import type { AdvancedSearchFormField } from '@/utils/columns';
import { AdvancedSearch } from '@/utils/columns';
import {
  indexColumns,
  skuIdColumns,
  currentQtyColumns,
  qtyWithSNColumns,
  memoColumns,
  totalAmountColumns,
  keywordColumns,
  dateRangeColumns,
  billNoColumns,
  crtNameColumns,
  checkName,
  optionColumns,
  checkStatusColumns,
} from '@/utils/columns';
import { calPrice, transProTableParamsToMyRequest } from '@/utils/utils';
import { patternMsg } from '@/utils/validator';
import ProCard from '@ant-design/pro-card';
import ProForm, {
  ProFormDatePicker,
  ProFormDigit,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { FooterToolbar, PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import ProTable, { EditableProTable } from '@ant-design/pro-table';
import type { FormInstance } from 'antd';
import { Select } from 'antd';
import { Button, Space } from 'antd';
import { Table, Typography, message } from 'antd';
import moment from 'moment';
import React, { useEffect, useRef, useState } from 'react';
import { UserSelect } from '@/utils/form';
import { showSysInfo } from '@/components/SysInfo';

export type ProduceFormProps = {
  bussType: BussType; // 业务类型
  dev?: string; // 是否开发
  id: K; // page params
};
export function ProduceEntries(props: XhddEntriesProps) {
  const { bussType, checked, formRef, value, onChange, rest } = props;
  const actionRef = useRef<ActionType>();
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
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
    currentQtyColumns(),
    qtyWithSNColumns(value, StockType.入库, checked),
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
      title: '入库单价',
      dataIndex: 'price',
      valueType: 'money',
    },
    {
      title: '入库金额',
      dataIndex: 'amount',
      valueType: 'money',
      editable: false,
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
      summary={() => (
        <Table.Summary.Row>
          {columns
            .filter((i) => !i.hideInTable)
            .map((item, index) => {
              if (index === 0) {
                return (
                  <Table.Summary.Cell index={index} key={+index}>
                    合计
                  </Table.Summary.Cell>
                );
              }
              if (item.dataIndex === 'qtyMid') {
                return (
                  <Table.Summary.Cell
                    index={index}
                    key={+index}
                    children={
                      <Typography.Text
                        type="danger"
                        children={formRef.current?.getFieldValue('totalQty')}
                      />
                    }
                  />
                );
              }
              if (item.dataIndex === 'amount') {
                return (
                  <Table.Summary.Cell
                    index={index}
                    key={+index}
                    children={
                      <Typography.Text
                        type="danger"
                        children={formRef.current?.getFieldValue('totalAmount')}
                      />
                    }
                  />
                );
              }
              return <Table.Summary.Cell index={index} key={+index} />;
            })}
        </Table.Summary.Row>
      )}
      value={value}
      {...rest}
    />
  );
}
export function ProduceForm(props: ProduceFormProps) {
  const { bussType, dev, id } = props;
  const formRef = useRef<FormInstance>();
  const [checked, setChecked] = useState<boolean>(false);
  const [isInfo, setIsInfo] = useState<boolean>(false);

  const { run, refresh, data } = useRequest(
    async () => {
      setIsInfo(id !== 'new');
      if (id === 'new') {
        const billNo = (await getCode(BussCodeId[BussType[bussType]])).data;
        const res: PUR.Purchase = {
          billId: '',
          billNo,
          date: moment().format('YYYY-MM-DD'),
          deliveryDate: moment().format('YYYY-MM-DD'),
          disRate: 0,
          disAmount: 0,
          rpAmount: 0,
        };
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
    <ProCard bordered style={{ boxShadow: ' 0 1px 3px rgb(0 0 0 / 20%)' }} title={data?.billNo}>
      <ProForm<PUR.Purchase>
        onFinish={async (values) => {
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
        <ProFormDigit hidden width="sm" name="totalQty" label="单据数量" disabled />
        <ProFormDigit hidden width="sm" name="totalAmount" label="单据总额" disabled />
        <ProForm.Group>
          <ProFormDatePicker width="md" name="date" label="单据日期" disabled={checked} />
          <UserSelect name="packId" label="打包员" />
          <UserSelect name="checkId" label="验收员" />
        </ProForm.Group>
        <ProForm.Group>
          <ProForm.Item name="entries" label="商品" rules={patternMsg.select('商品')}>
            <SkuSelect disabled={checked} multiple labelInValue accumulate needTaxRate={false} />
          </ProForm.Item>
        </ProForm.Group>
        <ProForm.Item name="entries">
          <ProduceEntries bussType={bussType} checked={checked} formRef={formRef} />
        </ProForm.Item>
        <ProFormTextArea name="memo" label="备注" disabled={checked} />
      </ProForm>
    </ProCard>
  );
}

export function ProduceTableColumns({
  bussType,
}: {
  bussType: BussType;
}): ProColumns<PUR.Purchase>[] {
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
    totalAmountColumns({
      title: '金额',
    }),
  ];
  return base;
}

export type ProduceTableProps = {
  initSearch?: AdvancedSearchFormField; // 初始化搜索条件
  dev?: string;
  bussType: BussType;
};
export function ProduceTable(props: ProduceTableProps) {
  const { initSearch, dev, bussType } = props;
  const columns = ProduceTableColumns({
    bussType,
  });
  const actionRef = useRef<ActionType>();
  const [advancedSearchFormValues] = useState<AdvancedSearchFormField | undefined>(initSearch);
  return (
    <PageContainer
      title={false}
      content={
        <ProTable<PUR.Purchase, AdvancedSearchFormField>
          rowKey="billId"
          rowSelection={{}}
          options={false}
          bordered
          params={advancedSearchFormValues}
          actionRef={actionRef}
          search={AdvancedSearch({
            url: `${BussTypeComponentUrl[BussType[bussType]]}/new`,
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
