import {
  ProFormText,
  ProFormGroup,
  ProFormRadio,
  ModalForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addDict, queryDictTypes, updDict } from '@/services/Sys';

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
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updDict({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addDict(values);
          Modal.confirm({
            content: '新增字典成功,是否继续添加?',
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
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText width="md" name="dictName" label="字典名称" />
        <ProFormText width="md" name="dictDesc" label="字典描述" />
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
