import ProForm, {
  ProFormText,
  ProFormGroup,
  ProFormRadio,
  ModalForm,
  ProFormSelect,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { FormInstance, TreeSelect } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addEmploy, updEmploy } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.Employ;
};
const EmpLoyForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { treeDataSimpleMode } = useModel('dep', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  return (
    <ModalForm<BAS.Employ>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户分类' : `修改客户分类(${initialValues.empName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updEmploy({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addEmploy(values);
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
        <ProFormText width="md" name="empCd" label="员工编号" />
        <ProFormText width="md" name="empName" label="员工编号" />
        <ProForm.Item label="所属部门" name="depId" style={{ width: '328px' }}>
          <TreeSelect
            showSearch
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
            treeData={treeDataSimpleMode}
            treeDataSimpleMode={true}
            treeNodeFilterProp="title"
          />
        </ProForm.Item>
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

export default EmpLoyForm;
