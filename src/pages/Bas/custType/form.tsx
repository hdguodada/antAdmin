import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCusttype, updCusttype } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.CustType | Record<string, unknown>;
};
const DepForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode } = useModel('custType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustType>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户分类' : `修改客户分类(${initialValues.custTypeName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCusttype({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addCusttype(values);
          Modal.confirm({
            content: '新增客户分类成功,是否继续添加?',
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

export default DepForm;
