import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import React, { useRef } from 'react';
import { addCustArea, updCustArea } from '@/services/Bas';
import { useModel } from 'umi';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';

const CustAreaForm: React.FC<FormProps<BAS.CustArea>> = (props) => {
  const { queryCustAreaTree, queryCustArea } = useModel('custArea', (model) => ({
    queryCustAreaTree: model.queryCustAreaTree,
    queryCustArea: model.queryCustArea,
  }));
  const { action, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode } = useModel('custArea', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustArea>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户区域' : `修改客户区域(${initialValues?.areaName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCustArea({ ...initialValues, ...values });
        } else {
          await addCustArea(values);
        }
        queryCustAreaTree();
        queryCustArea();
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
        <Form.Item
          label="上级区域"
          name="pareaId"
          style={{ width: '328px' }}
          rules={patternMsg.select('上级区域')}
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
          name="areaName"
          label="区域名称"
          rules={patternMsg.text('区域名称')}
        />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default CustAreaForm;
