import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form } from 'antd';
import React, { useRef } from 'react';
import { addCusttype, updCusttype } from '@/services/Bas';
import { useModel } from 'umi';
import { CustTypeSelect, StateForm } from '@/utils/form';

const CustTypeForm: React.FC<FormProps<BAS.CustType>> = (props) => {
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { queryCustTypeTree } = useModel('custType', (model) => ({
    queryCustTypeTree: model.queryCustTypeTree,
  }));
  return (
    <ModalForm<BAS.CustType>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户分类' : `修改客户分类(${initialValues?.custTypeName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCusttype({ ...initialValues, ...values });
        } else {
          await addCusttype(values);
        }
        queryCustTypeTree();
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
        <Form.Item label="上级客户" name="pcustTypeId" style={{ width: '328px' }}>
          <CustTypeSelect />
        </Form.Item>
        <ProFormText width="md" name="custTypeName" label="客户分类名称" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default CustTypeForm;
