import type { FormInstance } from '@ant-design/pro-form';
import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCustRecord, updCustRecord } from '@/services/Bas';
import { useModel } from 'umi';
import { queryUsers } from '@/services/Sys';
import moment from 'moment';
import { patternMsg } from '@/utils/validator';

type FormProps = {
  action: 'add' | 'upd';
  visible: boolean;
  setVisible: (visible: boolean) => void;
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  initialValues?: BAS.CustRecord;
  custRel?: BAS.Rel[];
  customer: BAS.Customer;
  refresh?: () => void;
};
export default (props: FormProps) => {
  const { currentUser } = useModel('@@initialState', (model) => ({
    currentUser: model.initialState?.currentUser,
  }));
  const { initialValues, custRel, visible, setVisible, action, customer, refresh } = props;
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.typeOption }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.CustRecord>
      title={<div>新建行动记录({customer?.custName})</div>}
      visible={visible}
      initialValues={{
        state: 1,
        exeDate: moment().format('YYYY-MM-DD'),
      }}
      onFinish={async (values) => {
        if (action === 'add') {
          await addCustRecord({
            ...values,
            custId: customer.custId,
          });
        } else {
          await updCustRecord({
            ...initialValues,
            ...values,
          });
        }
        refresh?.();
        return true;
      }}
      formRef={formRef}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <ProFormText width="md" name="custId" label="客户" disabled hidden />
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="relId"
          label="联系人"
          rules={patternMsg.text('')}
          request={async () => {
            return custRel
              ? custRel.map((item) => ({
                  label: item.relName,
                  value: item.relId,
                }))
              : [];
          }}
        />
        <ProFormSelect
          width="md"
          name="recordTypeId"
          label="行动类别"
          rules={patternMsg.select('')}
          options={typeOption('CustRecordType')}
        />
        <ProFormTextArea width="lg" name="content" label="行动内容" rules={patternMsg.text('')} />
        <ProFormDatePicker
          width="md"
          name="exeDate"
          label="执行日期"
          rules={patternMsg.select('')}
        />
        <ProFormSelect
          width="md"
          rules={patternMsg.select('')}
          initialValue={currentUser?.userId}
          name="userId"
          label="执行人"
          request={async () => {
            return (await queryUsers({ pageNumber: -1 })).data.rows.map((user) => ({
              label: user.realName,
              value: user.userId,
            }));
          }}
        />
      </ProForm.Group>
    </ModalForm>
  );
};
