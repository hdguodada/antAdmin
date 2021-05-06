import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { addAttr, updAttr } from '@/services/Bas';
import { useModel } from 'umi';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';

export default (props: FormProps<BAS.Attr>) => {
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { query } = useModel('attr', (model) => ({
    query: model.query,
  }));

  return (
    <ModalForm<BAS.Attr>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建规格' : `修改规格(${initialValues?.attrName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updAttr({
            ...initialValues,
            ...values,
          });
        } else {
          await addAttr({
            ...values,
          });
        }
        query();
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
        <ProFormText
          width="md"
          name="attrName"
          label="规格名称"
          rules={patternMsg.text('规格名称')}
        />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
