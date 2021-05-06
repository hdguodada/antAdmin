import ProForm, { ProFormText, ProFormRadio, ModalForm, ProFormSelect } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addDict, queryDictTypes, updDict } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.Dict | Record<string, unknown>;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.Dict>
      initialValues={{
        state: 1,
        dictTypeId: initialValues.dictTypeId,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建字典' : `修改字典(${initialValues.dictName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updDict({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addDict(values);
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
        <ProFormSelect
          name="dictTypeId"
          label="字典分类"
          width="lg"
          showSearch
          fieldProps={{
            optionFilterProp: 'label',
          }}
          request={async () => {
            return (await queryDictTypes({ pageNumber: -1 })).data.rows.map((item) => ({
              label: item.dictTypeName,
              value: item.dictTypeId,
            }));
          }}
        />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="dictName" label="字典名称" rules={patternMsg.text('')} />
        <ProFormText width="md" name="dictDesc" label="字典描述" />
      </ProForm.Group>
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
