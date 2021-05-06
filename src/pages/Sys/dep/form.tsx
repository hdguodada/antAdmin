import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { addDep, updDep } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';
import { DepSelect, StateForm } from '@/utils/form';

const DepForm: React.FC<FormProps<API.Dep>> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.Dep>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建部门' : `修改部门(${initialValues?.depName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updDep({ ...initialValues, ...values });
        } else {
          await addDep(values);
        }
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
      <ProForm.Group>
        <ProFormText
          width="md"
          name="depName"
          label="部门名称"
          rules={patternMsg.text('部门名称')}
        />
        <DepSelect name="pDepId" label="上级部门" showNew={false} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="leader" label="部门负责人" />
        <ProFormText width="md" name="phone" label="手机号码" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default DepForm;
