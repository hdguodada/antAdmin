import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addAttr, updAttr } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.Attr | Record<string, unknown>;
  addCb?: () => void;
};
export default (props: FormProps) => {
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
      title={action === 'add' ? '新建规格' : `修改规格(${initialValues.attrName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
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
        message.success('提交成功');
        query({ pageNumber: -1 });
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
        setVisible(v);
      }}
    >
      <ProFormGroup>
        <ProFormText width="md" name="attrName" label="规格名称" />
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
