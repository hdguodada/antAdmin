import {
  ProFormText,
  ProFormGroup,
  ProFormRadio,
  ModalForm,
  ProFormSelect,
  ProFormTextArea,
  ProFormDatePicker,
} from '@ant-design/pro-form';
import { Button } from 'antd';
import React from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCustRecord } from '@/services/Bas';
import { useModel } from 'umi';
import { queryUsers } from '@/services/Sys';

type FormProps = {
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  initialValues: BAS.CustRecord | Record<string, unknown>;
  custRel?: BAS.CustRel[];
};
export default (props: FormProps) => {
  const { actionRef, initialValues, custRel } = props;
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.typeOption }));
  return (
    <ModalForm<BAS.CustRecord>
      trigger={
        <Button key="newRecord" type="primary">
          新建
        </Button>
      }
      title={<div>新建行动记录({initialValues.custName})</div>}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        await addCustRecord(values);
        actionRef?.current?.reload();
        return true;
      }}
    >
      <ProFormText
        width="md"
        name="custId"
        label="客户"
        disabled
        initialValue={initialValues.custId}
        hidden
      />
      <ProFormGroup>
        <ProFormSelect
          width="md"
          name="relId"
          label="联系人"
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
          options={typeOption('CustRecordType')}
        />
        <ProFormTextArea width="lg" name="content" label="行动内容" />
        <ProFormDatePicker width="md" name="exeDate" label="执行日期" />
        <ProFormSelect
          width="md"
          name="userId"
          label="执行人"
          request={async () => {
            return (await queryUsers({ pageNumber: -1 })).data.rows.map((user) => ({
              label: user.realName,
              value: user.userId,
            }));
          }}
          initialValue={initialValues.userId}
        />
      </ProFormGroup>
      <ProFormRadio.Group
        width="md"
        name="state"
        label="状态"
        initialValue={1}
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
