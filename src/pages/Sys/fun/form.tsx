import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { updFuns, addFuns } from '@/services/Sys';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';

const { confirm } = Modal;

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.Fun | Record<string, unknown>;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.Fun>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建操作功能' : `修改操作功能(${initialValues.funName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updFuns({ ...initialValues, ...values });
        } else {
          await addFuns(values);
          confirm({
            content: '新增字典成功,是否继续添加?',
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
        <ProFormText
          width="md"
          name="funName"
          label="操作名称"
          rules={patternMsg.text('操作名称')}
        />
        <ProFormText width="md" name="funDesc" label="操作描述" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
