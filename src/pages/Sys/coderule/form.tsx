import ProForm, { ProFormText, ModalForm, ProFormDigit, ProFormSwitch } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCodeRule, updCodeRule } from '@/services/Sys';
import { StateForm } from '@/utils/form';

const { confirm } = Modal;
type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: SYS.CodeRule;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<SYS.CodeRule>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建编码规则' : `修改编码规则(${initialValues?.codeName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCodeRule({ ...initialValues, ...values });
        } else {
          await addCodeRule(values);
          confirm({
            content: '新建编码规则,是否继续添加?',
            onCancel() {
              setVisible(false);
            },
            onOk() {
              formRef?.current?.resetFields();
            },
          });
          actionRef?.current?.reload();
          return false;
        }
        actionRef?.current?.reload();
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="codeName" label="编码名称" />
        <ProFormText width="md" name="prefix" label="前缀" />
        <ProFormDigit width="md" name="len" label="编码长度" />
        <ProFormDigit width="md" name="startNo" label="起始编号" />
        <ProFormSwitch
          name="yyyy"
          label="年"
          fieldProps={{
            onChange: (e) => {
              formRef.current?.setFieldsValue({
                yyyy: e ? 1 : 0,
              });
            },
          }}
        />
        <ProFormSwitch
          name="mm"
          label="月"
          fieldProps={{
            onChange: (e) => {
              formRef.current?.setFieldsValue({
                mm: e ? 1 : 0,
              });
            },
          }}
        />
        <ProFormSwitch
          name="dd"
          label="日"
          fieldProps={{
            onChange: (e) => {
              formRef.current?.setFieldsValue({
                dd: e ? 1 : 0,
              });
            },
          }}
        />
        <ProFormSwitch
          name="isRandom"
          label="是否随机"
          fieldProps={{
            onChange: (e) => {
              formRef.current?.setFieldsValue({
                isRandom: e ? 1 : 0,
              });
            },
          }}
        />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
