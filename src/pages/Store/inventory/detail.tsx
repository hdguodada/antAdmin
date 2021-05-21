import React, { useEffect, useRef, useState } from 'react';
import { PageContainer } from '@ant-design/pro-layout';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import {
  fixWdithColumns,
  indexColumns,
  qtyColumns,
  skuIdColumns,
  spuCodeColumns,
  storeCdColumns,
  unitIdColumns,
} from '@/utils/columns';
import { queryToPd, stockInventoryInfo } from '@/services/Store';
import moment from 'moment';
import type { FormInstance } from 'antd';
import { InputNumber, message, Modal, Space } from 'antd';
import { Button } from 'antd';
import { DatePicker } from 'antd';
import { useRequest } from '@/.umi/plugin-request/request';
import Style from '@/global.less';
import ProForm, {
  DrawerForm,
  ModalForm,
  ProFormDatePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import { useModel } from '@/.umi/plugin-model/useModel';
import { copyFilterObj } from '@/utils/utils';
import { ProFormCheckBoxZeroAndOne } from '@/utils/form';
import { useParams } from 'react-router';
import GlobalWrapper from '@/components/GlobalWrapper';
import { BussType, BussTypeComponentUrl } from '@/pages/Purchase/components';
import { StoreForm } from '../components';
import { SNTransfer } from '../serNum/serNumDetail';

export const Inventory: React.FC = () => {
  const formRef = useRef<FormInstance<STORE.invOiForm>>();
  const actionRef = useRef<ActionType>();
  const [e, sE] = useState<K[]>([]);
  const { loading, run } = useRequest(
    async (params?: Partial<STORE.invOiForm>, url?: string) => {
      const res = await queryToPd(params, url);
      return {
        data: res.data,
        success: res.code === 0,
      };
    },
    {
      manual: true,
      onSuccess: (values) => {
        formRef.current?.setFieldsValue({
          entries: values.entries,
        });
      },
    },
  );
  /**
   * 盘点单详情
   */
  const stockInventoryUR = useRequest<{ data: STORE.invOiForm }>(
    async (id: K) => {
      const { data, code } = await stockInventoryInfo(id);
      return {
        data,
        success: code === 0,
      };
    },
    {
      manual: true,
    },
  );
  const stockInventoryAdd = useRequest(
    (params) => {
      return {
        url: '/bis/stockInventory/add',
        data: params,
        method: 'POST',
      };
    },
    {
      manual: true,
      onSuccess: () => {
        message.success('保存盘点结果成功');
      },
    },
  );
  const { id } = useParams<{ id: string }>();
  const initialValues: Partial<STORE.invOiForm> = {
    storeCd: '',
    date: moment().format('YYYY-MM-DD'),
    showZero: 0,
  };
  useEffect(() => {
    if (id !== 'new') {
      stockInventoryUR.run(id).then((res) => {
        formRef.current?.setFieldsValue(res);
      });
    }
  }, [id]);
  const { storeOptions } = useModel('store', (model) => ({ storeOptions: model.options }));
  const columns: ProColumns<STORE.invOiEntries>[] = [
    {
      dataIndex: 'date',
      hideInTable: true,
      valueType: 'date',
      title: '日期',
      renderFormItem: () => <DatePicker defaultValue={moment()} style={{ width: '100%' }} />,
    },
    indexColumns,
    storeCdColumns,
    spuCodeColumns,
    {
      title: '商品备注',
      dataIndex: 'memo',
      search: false,
      editable: false,
      width: 150,
    },
    skuIdColumns,
    unitIdColumns,
    qtyColumns({
      title: '系统库存',
      dataIndex: 'qty',
      rest: { editable: false },
    }),
    {
      dataIndex: 'checkInventoryQty',
      title: () => (
        <div>
          <span className="error-color">*</span>盘点库存
        </div>
      ),
      search: false,
      valueType: 'digit',
      width: 200,
      renderFormItem: ({ index }) => {
        const isSerNum = formRef.current?.getFieldValue('isSerNum');
        const entries = formRef.current?.getFieldValue('entries');
        const { skuId } = entries[index as number];
        const { storeCd } = entries[index as number];
        return (
          <SNTransfer
            isSerNum={isSerNum}
            skuId={skuId}
            storeCd={storeCd}
            formRef={formRef}
            entries={entries}
          />
        );
      },
    },
    {
      dataIndex: 'inventoryResult',
      title: '盘盈盘亏',
      search: false,
      editable: false,
      width: 100,
      render: (_, record) => {
        if (record.inventoryResult !== undefined) {
          return (
            <div className={record.inventoryResult < 0 ? Style['error-color'] : ''}>
              {record.inventoryResult}
            </div>
          );
        }
        return '';
      },
    },
    fixWdithColumns(),
  ];
  const NewStockInWithPy: React.FC<{ type: 'py' | 'pk'; inventoryId: K }> = ({
    type,
    inventoryId,
  }) => {
    return inventoryId !== 'new' ? (
      <DrawerForm
        drawerProps={{ placement: 'bottom', height: '70vh' }}
        trigger={<Button children={type === 'py' ? '生成盘盈单' : '生成盘亏单'} />}
      >
        <StoreForm
          bussType={type === 'py' ? BussType.其他入库单 : BussType.其他出库单}
          id="new"
          query={{}}
          inventoryInfo={stockInventoryUR.data}
        />
      </DrawerForm>
    ) : (
      <div />
    );
  };
  return (
    <PageContainer
      title="盘点"
      extra={[
        <Button
          type="primary"
          key="save"
          loading={stockInventoryAdd.loading}
          onClick={async () => {
            await stockInventoryAdd.run(formRef.current?.getFieldsValue());
          }}
        >
          保存盘点结果
        </Button>,
        <NewStockInWithPy type="py" key="newPy" inventoryId={id} />,
        <NewStockInWithPy type="pk" key="pk" inventoryId={id} />,
      ]}
      content={
        <>
          <ProForm<STORE.invOiForm>
            formRef={formRef}
            submitter={false}
            initialValues={initialValues}
          >
            <ProFormText name="billId" hidden />
            <ProFormText name="billNo" hidden />
            <ProForm.Group>
              <ProFormDatePicker name="date" label="日期" width="md" />
              <ProFormSelect
                name="storeCd"
                label="仓库"
                options={[{ value: '', label: '所有仓库' }, ...storeOptions]}
                width="md"
              />
              <ProFormText name="skuName" label="商品" width="md" />
              <ProForm.Item name="showZero" label="零库存">
                <ProFormCheckBoxZeroAndOne />
              </ProForm.Item>
              <ProForm.Item name="isDelete" label="显示禁用商品">
                <ProFormCheckBoxZeroAndOne />
              </ProForm.Item>
              <ProFormRadio.Group
                width="md"
                name="isSerNum"
                initialValue={0}
                label="盘点类型"
                options={[
                  {
                    label: '非序列号盘点',
                    value: 0,
                  },
                  {
                    label: '序列号盘点',
                    value: 1,
                  },
                ]}
              />
            </ProForm.Group>
            <ProForm.Item name="entries">
              <EditableProTable<STORE.invOiEntries, STORE.invOiParams>
                columns={columns}
                rowKey="autoId"
                bordered
                loading={loading}
                onRow={(record) => ({
                  onClick: () => {
                    sE([record.autoId]);
                  },
                })}
                toolbar={{
                  actions: [
                    <Button
                      type="primary"
                      loading={id === 'new' ? loading : stockInventoryUR.loading}
                      onClick={async () => {
                        const filterForm = formRef.current?.getFieldsValue();
                        if (filterForm?.isSerNum) {
                          await run(
                            copyFilterObj(filterForm, ['entries']),
                            '/bis/stockInventory/queryToSeriPd',
                          );
                        } else {
                          await run(copyFilterObj(filterForm, ['entries']));
                        }
                      }}
                      className={Style.buttonColorGreen}
                    >
                      查询
                    </Button>,
                  ],
                }}
                actionRef={actionRef}
                recordCreatorProps={false}
                editable={{
                  editableKeys: e,
                  type: 'multiple',
                  onValuesChange: (record, recordList) => {
                    const isSerNum = formRef.current?.getFieldValue('isSerNum');
                    if (isSerNum) {
                      return;
                    }
                    const recordListCalChange = recordList.map((item) =>
                      item.autoId === record.autoId
                        ? {
                            ...item,
                            inventoryResult: (item.checkInventoryQty || 0) - item.qty,
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
        </>
      }
    />
  );
};

export default () => <GlobalWrapper children={<Inventory />} type="list" />;
