import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addDictType, updDictType } from '@/services/Sys';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.DictType | Record<string, unknown>;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.DictType>
      initialValues={{
        state: 1,
        dictTypeId: initialValues.dictTypeId,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建字典分类' : `修改字典分类(${initialValues.dictTypeName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updDictType({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addDictType(values);
          Modal.confirm({
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
      <ProFormGroup>
        <ProFormText width="md" name="dictTypeName" label="字典分类名称" />
        <ProFormText width="md" name="enumType" label="枚举类型" />
      </ProFormGroup>
      <ProFormRadio.Group
        width="md"
        name="state"
        label="状态"
        options={[
          {
            label: '禁用',
            value: 0,
          },
          {
            label: '正常',
            value: 1,
          },
        ]}
      />
    </ModalForm>
  );
};
