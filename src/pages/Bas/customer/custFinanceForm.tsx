import { useModel } from 'umi';
import { saveCustomerFinance } from '@/services/Bas';
import { patternMsg } from '@/utils/validator';
import { EditFilled } from '@ant-design/icons';
import ProForm, {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button } from 'antd';
import React, { useRef } from 'react';

export const CustomerFinanceFormFields = ({
  action,
  simple = false,
}: {
  action: 'add' | 'upd';
  simple?: boolean;
}) => {
  const { valueEnum } = useModel('options', (model) => ({
    valueEnum: model.valueEnum,
  }));
  return (
    <>
      <ProFormText
        width="md"
        label="客户"
        hidden
        name={action === 'add' ? ['basCustFinance', 'suppId'] : 'custId'}
      />
      <ProForm.Group>
        <ProFormText
          width="md"
          name={action === 'add' ? ['basCustFinance', 'invoice'] : 'invoice'}
          label="开票名称"
        />
        <ProFormText
          width="md"
          label="开票税号"
          name={action === 'add' ? ['basCustFinance', 'taxNumber'] : 'taxNumber'}
        />
        <ProFormText
          width="md"
          label="开户地址"
          name={action === 'add' ? ['basCustFinance', 'invoiceAddress'] : 'invoiceAddress'}
        />
        {!simple && (
          <>
            <ProFormText
              width="md"
              label="开户银行"
              rules={patternMsg.text('')}
              name={action === 'add' ? ['basCustFinance', 'bank'] : 'bank'}
            />
            <ProFormText
              width="md"
              label="银行账号"
              rules={patternMsg.text('')}
              name={action === 'add' ? ['basCustFinance', 'bankAccount'] : 'bankAccount'}
            />
            <ProFormText
              width="md"
              label="开户电话"
              name={action === 'add' ? ['basCustFinance', 'invoiceTel'] : 'invoiceTel'}
            />
            <ProFormText
              width="md"
              label="支付宝账号"
              name={action === 'add' ? ['basCustFinance', 'alipay'] : 'alipay'}
            />
            <ProFormText
              width="md"
              label="微信账号"
              name={action === 'add' ? ['basCustFinance', 'wxpay'] : 'wxpay'}
            />
            <ProFormSelect
              width="md"
              label="结算方式"
              name={action === 'add' ? ['basCustFinance', 'settlementId'] : 'settlementId'}
              valueEnum={valueEnum('Settlement')}
            />
            <ProFormSelect
              width="md"
              label="账期类型"
              name={action === 'add' ? ['basCustFinance', 'debtTypeId'] : 'debtTypeId'}
              valueEnum={valueEnum('DebtType')}
            />
            <ProFormDatePicker
              width="md"
              label="余额日期"
              name={action === 'add' ? ['basCustFinance', 'initDate'] : 'initDate'}
            />
            <ProFormSelect
              width="md"
              label="对账初始化"
              name={action === 'add' ? ['basCustFinance', 'isInit'] : 'isInit'}
              valueEnum={
                new Map([
                  [0, '否'],
                  [1, '是'],
                ])
              }
            />
            <ProFormDigit
              width="md"
              label="期初应收款"
              name={action === 'add' ? ['basCustFinance', 'initRecv'] : 'initRecv'}
            />
            <ProFormDigit
              width="md"
              label="期初预收款"
              name={action === 'add' ? ['basCustFinance', 'initPerRecv'] : 'initPerRecv'}
            />
            <ProFormDigit
              width="md"
              label="期初其他应收款"
              name={action === 'add' ? ['basCustFinance', 'InitRecvOther'] : 'InitRecvOther'}
            />
            <ProFormDigit
              width="md"
              label="授信额度"
              name={action === 'add' ? ['basCustFinance', 'creditLimit'] : 'creditLimit'}
            />
          </>
        )}
      </ProForm.Group>
    </>
  );
};
export default (props: FormProps<BAS.CustomerFinance>) => {
  const { action, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <>
      <ModalForm<BAS.Finance>
        initialValues={{ state: 1 }}
        trigger={
          <Button type="primary">
            <EditFilled />
            编辑
          </Button>
        }
        formRef={formRef}
        onFinish={async (values) => {
          await saveCustomerFinance({ ...initialValues, ...values }, undefined, action);
          refresh?.();
          return true;
        }}
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
          } else {
            formRef.current?.resetFields();
          }
        }}
      >
        <CustomerFinanceFormFields action={action} />
      </ModalForm>
    </>
  );
};
