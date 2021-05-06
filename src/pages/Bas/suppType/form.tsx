import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addSuppType, updSuppType } from '@/services/Bas';
import { useModel } from 'umi';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: BAS.SuppType;
  addCb?: () => void;
};
export default (props: FormProps) => {
  const { action, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode, query } = useModel('suppType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    query: model.query,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.SuppType>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      draggable
      title={action === 'add' ? '新建供应商分类' : `修改供应商分类(${initialValues?.suppTypeName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updSuppType({ ...initialValues, ...values });
        } else {
          await addSuppType(values);
        }
        query();
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
        <Form.Item
          label="上级供应商类别"
          name="psuppTypeId"
          style={{ width: '328px' }}
          rules={patternMsg.select('')}
        >
          <TreeSelect
            showSearch
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
            treeData={treeDataSimpleMode}
            treeDataSimpleMode={true}
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <ProFormText
          width="md"
          name="suppTypeName"
          label="供应商类别"
          rules={patternMsg.text('')}
        />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};
