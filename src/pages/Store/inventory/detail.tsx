import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import {
  codeColumns,
  indexColumns,
  memoColumns,
  skuIdColumns,
  storeCdColumns,
  unitIdColumns,
} from '@/utils/columns';
import { queryToPd } from '@/services/Store';
import moment from 'moment';
import { Button, FormInstance } from 'antd';
import { DatePicker } from 'antd';
import { useRequest } from '@/.umi/plugin-request/request';
import Style from '@/global.less';
import ProForm, {
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormSwitch,
  ProFormText,
} from '@ant-design/pro-form';
import { useModel } from '@/.umi/plugin-model/useModel';
import { copyFilterObj } from '@/utils/utils';
import { SNTransfer } from '../serNum/serNumDetail';
import { patternMsg } from '@/utils/validator';

export const Inventory: React.FC = () => {
  const [editableKeys, setEditableKeys] = useState<React.Key[]>();
  const formRef = useRef<FormInstance<STORE.invOiPdForm>>();

  const { loading, run } = useRequest(
    async (params: STORE.invOiParams) => {
      const res = await queryToPd(params);
      setEditableKeys(res.data.rows.map((i) => i.storeCd));
      return {
        data: res.data.rows,
        success: res.code === 0,
      };
    },
    {
      manual: true,
      onSuccess: (values) => {
        formRef.current?.setFieldsValue({
          entries: values,
        });
      },
    },
  );
  const { storeOptions } = useModel('store', (model) => ({ storeOptions: model.options }));
  const columns: ProColumns<STORE.invOiResponse>[] = [
    {
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'date',
      title: '日期',
      renderFormItem: () => <DatePicker defaultValue={moment()} style={{ width: '100%' }} />,
    },
    indexColumns,
    storeCdColumns,
    codeColumns,
    skuIdColumns,
    memoColumns(),
    unitIdColumns,
    {
      title: '系统库存',
      dataIndex: 'qty',
      editable: false,
      valueType: 'digit',
    },
    {
      dataIndex: 'checkInventory',
      title: '盘点库存',
      search: false,
      renderFormItem: () => {
        const isSerNum = formRef.current?.getFieldValue('isSerNum');
        return <SNTransfer isSerNum={isSerNum} />;
      },
    },
    {
      dataIndex: 'change',
      title: '盘盈盘亏',
      search: false,
      editable: false,
      render: (_, record) => {
        if (record.change !== undefined) {
          return (
            <div className={record.change < 0 ? Style['error-color'] : ''}>{record.change}</div>
          );
        }
        return '';
      },
    },
  ];
  const initialValues: STORE.invOiParams = {
    storeCd: -1,
    date: moment().format('YYYY-MM-DD'),
    showZero: false,
    isSerNum: false,
  };
  useEffect(() => {
    run(initialValues);
  }, []);
  return (
    <PageContainer
      title="盘点"
      extra={[
        <Button type="primary" key="save">
          保存盘点结果
        </Button>,
        <Button type="primary" key="generate">
          生成盘点单据
        </Button>,
      ]}
      content={
        <ProForm<STORE.invOiPdForm>
          formRef={formRef}
          submitter={false}
          initialValues={initialValues}
          onValuesChange={async (values: STORE.invOiPdForm) => {
            if (values.isSerNum !== undefined) {
              const filterForm = formRef.current?.getFieldsValue();
              formRef.current?.setFieldsValue({
                entries: await run(copyFilterObj(filterForm, ['entries'])),
              });
            }
          }}
        >
          <ProForm.Group>
            <ProFormDatePicker name="date" label="日期" width="md" />
            <ProFormSelect
              name="storeCd"
              label="仓库"
              options={[{ value: -1, label: '所有仓库' }, ...storeOptions]}
              width="md"
            />
            <ProFormText name="skuName" label="商品" width="md" />
            <ProFormSwitch name="showZero" label="零库存" />
          </ProForm.Group>
          <ProForm.Item name="entries">
            <EditableProTable<STORE.invOiResponse, STORE.invOiParams>
              columns={columns}
              rowKey="storeCd"
              bordered
              loading={loading}
              headerTitle={[
                <ProFormRadio.Group
                  rules={patternMsg.select('请选择盘点类型')}
                  key="isSerNum"
                  name="isSerNum"
                  label="盘点类型"
                  options={[
                    {
                      label: '普通盘点',
                      value: false,
                    },
                    {
                      label: '序列号盘点',
                      value: true,
                    },
                  ]}
                />,
              ]}
              toolbar={{
                actions: [
                  <Button
                    type="dashed"
                    onClick={async () => {
                      const filterForm = formRef.current?.getFieldsValue();
                      formRef.current?.setFieldsValue({
                        entries: await run(copyFilterObj(filterForm, ['entries'])),
                      });
                    }}
                  >
                    刷新
                  </Button>,
                ],
              }}
              recordCreatorProps={false}
              editable={{
                editableKeys,
                type: 'multiple',
                onValuesChange: (record, recordList) => {
                  const recordListCalChange = recordList.map((item) =>
                    item.storeCd === record.storeCd
                      ? {
                          ...item,
                          change: (item.checkInventory || 0) - item.qty,
                        }
                      : item,
                  );
                  formRef.current?.setFieldsValue({
                    entries: recordListCalChange,
                  });
                },
              }}
            />
          </ProForm.Item>
        </ProForm>
      }
    />
  );
};

export default Inventory;
