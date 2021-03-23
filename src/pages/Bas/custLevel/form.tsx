import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { updCustLevel, addCustLevel } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.CustLevel | Record<string, unknown>;
};
const CustLevelForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode } = useModel('custArea', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustLevel>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户等级' : `修改客户等级(${initialValues.levelName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCustLevel({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addCustLevel(values);
          Modal.confirm({
            content: '新增客户等级成功,是否继续添加?',
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
        <ProFormText width="md" name="levelName" label="客户等级" />
        <ProFormText width="md" name="discount" label="折扣率" />
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

export default CustLevelForm;
