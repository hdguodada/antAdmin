import { ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button, Divider } from 'antd';
import React, { useRef, useState } from 'react';
import { getCode } from '@/services/Sys';
import { PageContainer } from '@ant-design/pro-layout';
import ProCard from '@ant-design/pro-card';
import { useParams } from 'umi';
import {
  delSuppRel,
  querySuppFinanceInfo,
  querySuppliersInfo,
  querySuppRel,
  saveSupplier,
  saveSuppRel,
  saveSuppFinance,
} from '@/services/Bas';
import type { ActionType } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { useRequest } from 'umi';
import ProDescriptions from '@ant-design/pro-descriptions';
import { relColumns } from '@/pages/Bas/customer/detail';
import { BaseSupplierFormGroup, SupplierFinanceGroup } from './addForm';
import { checkStatus } from '@/utils/columns';

export const SaveSuppForm = (props: FormProps<BAS.Supplier>) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<BAS.Supplier>
        initialValues={{ state: 1, checkStatus: 0 }}
        formRef={formRef}
        title={action === 'add' ? '新建供应商' : `修改供应商(${initialValues?.suppName})`}
        visible={visible}
        onFinish={async (values) => {
          await saveSupplier({ ...initialValues, ...values }, undefined, action);
          actionRef?.current?.reload();
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
            if (action === 'add') {
              getCode('BasSupplier').then((res) => {
                formRef.current?.setFieldsValue({
                  suppCd: res.data,
                });
              });
            }
          } else {
            formRef.current?.resetFields();
          }
          setVisible?.(v);
        }}
      >
        <BaseSupplierFormGroup action={'upd'} />
      </ModalForm>
    </>
  );
};

export const SaveSuppFinanceForm = (props: FormProps<BAS.Finance>) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<BAS.Finance>
        initialValues={{ state: 1 }}
        formRef={formRef}
        visible={visible}
        onFinish={async (values) => {
          await saveSuppFinance({ ...initialValues, ...values }, undefined, action);
          actionRef?.current?.reload();
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
          } else {
            formRef.current?.resetFields();
          }
          setVisible?.(v);
        }}
      >
        <SupplierFinanceGroup action={'upd'} />
      </ModalForm>
    </>
  );
};

export default () => {
  const { id } = useParams<{ id: string }>();
  const actionRef = useRef<ActionType>();
  const { data, loading, refresh } = useRequest(async () => {
    const supplier = await querySuppliersInfo(id);
    const supplierFinance = await querySuppFinanceInfo(id);
    return Promise.resolve({
      data: {
        supplier: supplier.data,
        finance: supplierFinance.data,
      },
      success: supplier.code === 0,
    });
  });
  const [visible, setVisible] = useState<boolean>(false);
  const [visible1, setVisible1] = useState<boolean>(false);
  return (
    <PageContainer
      title={data?.supplier.suppName}
      extra={
        <Button
          loading={loading}
          type="primary"
          onClick={() => {
            refresh();
          }}
        >
          刷新
        </Button>
      }
      content={
        <>
          <SaveSuppForm
            action="upd"
            visible={visible}
            setVisible={setVisible}
            initialValues={data?.supplier as BAS.Supplier}
            refresh={refresh}
          />
          <SaveSuppFinanceForm
            action="upd"
            visible={visible1}
            setVisible={setVisible1}
            initialValues={data?.finance}
            refresh={refresh}
          />
          <ProCard
            collapsible
            title="基本信息"
            extra={
              <Button
                onClick={() => {
                  setVisible(true);
                }}
              >
                修改
              </Button>
            }
          >
            <ProDescriptions<BAS.Supplier>
              columns={[
                {
                  dataIndex: 'suppTypeName',
                  title: '供应商类别',
                },
                {
                  dataIndex: 'suppCd',
                  title: '供应商编号',
                  copyable: true,
                },
                {
                  dataIndex: 'suppName',
                  title: '供应商名称',
                },
                {
                  dataIndex: 'address',
                  title: '联系地址',
                },
                {
                  dataIndex: 'memo',
                  title: '备注',
                },
                checkStatus(undefined),
              ]}
              dataSource={data?.supplier}
            />
          </ProCard>
          <Divider />
          <ProCard
            collapsible
            title="财务信息"
            extra={
              <Button
                onClick={() => {
                  setVisible1(true);
                }}
              >
                修改
              </Button>
            }
          >
            <ProDescriptions<BAS.Finance>
              columns={[
                {
                  dataIndex: 'taxInvoice',
                  title: '开票名称',
                },
                {
                  dataIndex: 'taxPayerNo',
                  title: '开票税号',
                },
                {
                  dataIndex: 'taxBank',
                  title: '开户银行',
                },
                {
                  dataIndex: 'taxBankAccount',
                  title: '银行账号',
                },
                {
                  dataIndex: 'taxAddress',
                  title: '开户地址',
                },
                {
                  dataIndex: 'taxTel',
                  title: '开户电话',
                },
                {
                  dataIndex: 'taxEmail',
                  title: '发票邮箱',
                },
                {
                  dataIndex: 'debtTypeId',
                  title: '账期类型',
                },
                {
                  dataIndex: 'initPayable',
                  title: '期初应付款',
                },
                {
                  dataIndex: 'initPerPayable',
                  title: '期初预付款',
                },
              ]}
              dataSource={data?.finance}
            />
          </ProCard>
          <Divider />
          <ProCard collapsible title="联系人">
            <EditableProTable<BAS.Rel>
              rowKey="relId"
              bordered
              columns={relColumns}
              actionRef={actionRef}
              params={{ suppId: id }}
              recordCreatorProps={{
                record: {
                  relId: (Math.random() * 1000000).toFixed(0),
                  action: 'add',
                } as BAS.Rel,
              }}
              editable={{
                onSave: async (key, values) => {
                  await saveSuppRel({
                    ...values,
                    suppId: id,
                    action: values.action || 'upd',
                  });
                  actionRef?.current?.reload();
                },
                onDelete: async (key) => {
                  await delSuppRel([+key]);
                  actionRef?.current?.reload();
                },
              }}
              request={async (params) => {
                const response = await querySuppRel({
                  ...params,
                  pageNumber: -1,
                  queryFilter: {
                    ...params,
                  },
                });
                return {
                  data: response.data.rows,
                  success: response.code === 0,
                  total: response.data.total,
                };
              }}
            />
          </ProCard>
        </>
      }
    />
  );
};
