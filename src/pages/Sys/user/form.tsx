import { addUser, updUser } from '@/services/Sys/user';
import ProForm, { ProFormText, ProFormSelect, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { useModel } from 'umi';
import type { ActionType } from '@ant-design/pro-table';
import { patternMsg } from '@/utils/validator';
import { DepSelect } from '@/utils/form';

type UserFormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: API.CurrentUser | Record<string, unknown>;
  refresh?: () => void;
};
const UserForm: React.FC<UserFormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues, refresh } = props;
  const formRef = useRef<FormInstance>();
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
      onFinish={async (values) => {
        if (action === 'upd') {
          await updUser({ ...initialValues, ...values });
        } else {
          await addUser(values);
        }
        actionRef?.current?.reload();
        refresh?.();
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
          name="userName"
          label="账号名称"
          disabled={action === 'upd'}
          rules={patternMsg.text('账号名称')}
        />
        <ProFormText
          width="md"
          name="realName"
          label="真实姓名"
          rules={patternMsg.text('真实姓名')}
        />
      </ProForm.Group>
      {action === 'add' && (
        <ProForm.Group>
          <ProFormText.Password width="md" name="passWord" label="密码" />
          <ProFormText.Password width="md" name="checkPassWord" label="确认密码" />
        </ProForm.Group>
      )}
      <ProForm.Group>
        <ProForm.Item name="depId" label="所属部门">
          <DepSelect showNew={true} />
        </ProForm.Item>
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
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="email" label="邮箱" />
        <ProFormText width="md" name="mobile" label="手机号码" />
      </ProForm.Group>
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
