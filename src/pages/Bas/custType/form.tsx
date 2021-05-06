import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCusttype, updCusttype } from '@/services/Bas';
import { useModel } from 'umi';
import { StateForm } from '@/utils/form';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.CustType | Record<string, unknown>;
};
const DepForm: React.FC<FormProps> = (props) => {
  const { action, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode } = useModel('custType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const formRef = useRef<FormInstance>();
  const { queryCustTypeTree, queryCustType } = useModel('custType', (model) => ({
    queryCustTypeTree: model.queryCustTypeTree,
    queryCustType: model.queryCustType,
  }));
  return (
    <ModalForm<BAS.CustType>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户分类' : `修改客户分类(${initialValues.custTypeName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCusttype({ ...initialValues, ...values });
        } else {
          await addCusttype(values);
        }
        queryCustTypeTree();
        queryCustType();
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
        <Form.Item label="上级客户" name="pcustTypeId" style={{ width: '328px' }}>
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
        <ProFormText width="md" name="custTypeName" label="客户分类名称" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default DepForm;
