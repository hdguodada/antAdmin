import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { addUnit, updUnit } from '@/services/Bas';
import { StateForm } from '@/utils/form';

export default (props: FormProps<BAS.Unit>) => {
  const { action, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();

  return (
    <ModalForm<BAS.Unit>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建计量单位' : `修改计量单位(${initialValues?.unitName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updUnit({
            ...initialValues,
            ...values,
          });
        } else {
          await addUnit({
            ...values,
          });
        }
        refresh?.();
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue({
            ...initialValues,
          });
        } else {
          formRef.current?.resetFields();
        }
        setVisible?.(v);
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="unitName" label="计量单位" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
