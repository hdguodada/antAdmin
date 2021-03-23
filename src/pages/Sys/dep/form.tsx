import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Form, TreeSelect, Modal } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import type { ActionType } from '@ant-design/pro-table';
import { adddDep, updDep } from '@/services/Sys';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.CurrentUser | Record<string, unknown>;
};
const DepForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { treeDataSimpleMode } = useModel('dep');
  return (
    <ModalForm<API.Dep>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建部门' : `修改部门(${initialValues.depName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updDep({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await adddDep(values);
          Modal.confirm({
            content: '新增部门成功,是否继续添加?',
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
        <ProFormText width="md" name="depName" label="部门名称" />
        <Form.Item label="上级部门" name="pDepId" style={{ width: '328px' }}>
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
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText width="md" name="leader" label="部门负责人" />
        <ProFormText width="md" name="phone" label="手机号码" />
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
