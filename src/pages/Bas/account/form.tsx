import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormDatePicker,
  ProFormDigit,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { StateForm } from '@/utils/form';
import { addAccount, updAccount } from '@/services/Bas/account';
import { useModel } from 'umi';
import { getCode } from '@/services/Sys';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: BAS.Account;
};
export default (props: FormProps) => {
  const { action, visible, setVisible, initialValues, actionRef } = props;
  const formRef = useRef<FormInstance>();
  const { valueEnum } = useModel('options', (model) => ({
    valueEnum: model.valueEnum,
  }));
  return (
    <ModalForm<BAS.Account>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建账户' : `修改账户(${initialValues?.accountName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updAccount({
            ...initialValues,
            ...values,
          });
        } else {
          await addAccount({
            ...values,
          });
        }
        actionRef?.current?.reload();
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue({
            ...initialValues,
          });
          if (action === 'add') {
            getCode('Account').then((res) => {
              formRef.current?.setFieldsValue({
                accountNo: res.data,
              });
            });
          }
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="accountNo" label="账户编号" />
        <ProFormText width="md" name="accountName" label="账户名称" />
        <ProFormSelect
          width="md"
          name="isDeafult"
          label="是否默认"
          valueEnum={
            new Map([
              [1, { text: '是', status: 'Success' }],
              [0, { text: '否', status: 'Error' }],
            ])
          }
        />
        <ProFormDatePicker width="md" name="balanceDate" label="余额日期" />
        <ProFormDigit width="md" name="initBalance" label="期初余额" />
        <ProFormSelect
          width="md"
          name="accountTypeId"
          label="结算账户类别"
          valueEnum={valueEnum('AccountType')}
        />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
