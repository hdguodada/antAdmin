import ProForm, { ProFormText, ModalForm, ProFormDatePicker } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addEmploy, updEmploy } from '@/services/Bas';
import { DepSelect, StateForm } from '@/utils/form';
import { getCode } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: BAS.Employ;
};
const EmpLoyForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();

  return (
    <ModalForm<BAS.Employ>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建员工' : `修改员工(${initialValues?.empName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updEmploy({ ...initialValues, ...values });
        } else {
          await addEmploy(values);
        }
        actionRef?.current?.reload();
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
          if (action === 'add') {
            getCode('BasEmploy').then((res) => {
              formRef.current?.setFieldsValue({
                empCd: res.data,
              });
            });
          }
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <ProForm.Group>
        <ProFormText width="md" name="empCd" label="员工编号" rules={patternMsg.text('')} />
        <ProFormText width="md" name="empName" label="员工名称" rules={patternMsg.text('')} />
        <DepSelect showNew={true} name={'depId'} label={'所属部门'} />
        <ProFormText width="md" name="idcard" label="身份证" />
        <ProFormDatePicker width="md" name="birthday" label="出生日期" />
        <ProFormText width="md" name="sex" label="性别" />
        <ProFormText width="md" name="tel" label="座机" />
        <ProFormText width="md" name="mobile" label="手机" />
        <ProFormText width="md" name="qq" label="QQ" />
        <ProFormText width="md" name="weixin" label="微信" />
        <ProFormText width="md" name="email" label="邮箱" />
        <ProFormText width="md" name="address" label="地址" />
        <ProFormDatePicker width="md" name="joinDate" label="入职日期" />
        <ProFormDatePicker width="md" name="leaveDate" label="离职日期" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default EmpLoyForm;
