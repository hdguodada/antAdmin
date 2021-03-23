import { addUser, updUser } from '@/services/Sys/user';
import {
  ProFormText,
  ProFormGroup,
  ProFormSelect,
  ProFormRadio,
  ModalForm,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Form, TreeSelect, Modal } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import type { ActionType } from '@ant-design/pro-table';

type UserFormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.CurrentUser | Record<string, unknown>;
};
const UserForm: React.FC<UserFormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { treeDataSimpleMode } = useModel('dep');
  const { userRoleOptions } = useModel('userRole');
  const { userType } = useModel('options', (model) => ({
    userType: model.typeOption('UserType'),
  }));
  return (
    <ModalForm<API.CurrentUser>
      key="edit"
      initialValues={{
        passWord: '123456',
        checkPassWord: '123456',
        state: 1,
      }}
      visible={visible}
      formRef={formRef}
      title=""
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updUser({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addUser(values);
          Modal.confirm({
            content: '新增用户成功,是否继续添加?',
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
        <ProFormText width="md" name="userName" label="账号名称" disabled={action === 'upd'} />
        <ProFormText width="md" name="realName" label="真实姓名" />
      </ProFormGroup>
      {action === 'add' && (
        <ProFormGroup>
          <ProFormText.Password width="md" name="passWord" label="密码" />
          <ProFormText.Password width="md" name="checkPassWord" label="确认密码" />
        </ProFormGroup>
      )}

      <ProFormGroup>
        <Form.Item label="所属部门" name="depId" style={{ width: '328px' }}>
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
        <ProFormSelect
          showSearch
          params={{}}
          width="md"
          name="userTypeId"
          label="职务"
          fieldProps={{
            optionFilterProp: 'label',
            filterOption(input, option: any) {
              return option?.label?.toLowerCase().indexOf(input.toLowerCase()) >= 0;
            },
          }}
          options={userType}
        />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText width="md" name="email" label="邮箱" />
        <ProFormText width="md" name="mobile" label="手机号码" />
      </ProFormGroup>
      <ProFormSelect
        width="lg"
        mode="multiple"
        name="roles"
        label="所属角色"
        options={userRoleOptions}
      />
      <ProFormRadio.Group
        width="md"
        name="state"
        label="状态"
        options={[
          {
            label: '正常',
            value: 1,
          },
          {
            label: '禁用',
            value: 0,
          },
        ]}
      />
    </ModalForm>
  );
};

export default UserForm;
