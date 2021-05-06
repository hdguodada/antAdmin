import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { updCustLevel, addCustLevel } from '@/services/Bas';
import { StateForm } from '@/utils/form';
import { useModel } from '@@/plugin-model/useModel';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.CustLevel | Record<string, unknown>;
};
const CustLevelForm: React.FC<FormProps> = (props) => {
  const { queryCustLevel } = useModel('custLevel', (model) => ({
    queryCustLevel: model.queryCustLevel,
  }));
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustLevel>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户等级' : `修改客户等级(${initialValues.levelName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updCustLevel({ ...initialValues, ...values });
        } else {
          await addCustLevel(values);
        }
        await queryCustLevel();
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
        <ProFormText width="md" name="levelName" label="客户等级" />
        <ProFormText width="md" name="discount" label="折扣率" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default CustLevelForm;
