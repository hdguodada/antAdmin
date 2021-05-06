import ProForm, { ProFormText, ProFormRadio, ModalForm, ProFormSlider } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { patternMsg } from '@/utils/validator';
import { addRole, updRole } from '@/services/Sys';

const { confirm } = Modal;
type UserFormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.UserRole;
};
const RoleForm: React.FC<UserFormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.UserRole>
      key="edit"
      initialValues={{
        state: 1,
      }}
      visible={visible}
      formRef={formRef}
      title=""
      onFinish={async (values) => {
        if (action === 'upd') {
          await updRole({ ...initialValues, ...values });
        } else {
          await addRole(values);
          confirm({
            content: '新增角色成功,是否继续添加?',
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
      <ProForm.Group>
        <ProFormText
          width="md"
          name="roleName"
          label="角色名称"
          rules={patternMsg.text('角色名称')}
        />
        <ProFormText width="md" name="roleDesc" label="角色描述" />
        <ProFormSlider label="排序" width="md" name="sortNum" max={100} min={1} />
      </ProForm.Group>
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

export default RoleForm;
