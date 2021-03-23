import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addSuppType, updSuppType } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.SuppType | Record<string, unknown>;
  addCb?: () => void;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const { treeDataSimpleMode, add } = useModel('suppType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    add: model.add,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.SuppType>
      initialValues={{
        state: 1,
      }}
      modalProps={{
        getContainer: 'body',
      }}
      style={{ zIndex: 20 }}
      formRef={formRef}
      title={action === 'add' ? '新建供应商分类' : `修改供应商分类(${initialValues.suppTypeName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updSuppType({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await add(values);
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
        <Form.Item label="上级供应商类别" name="psuppTypeId" style={{ width: '328px' }}>
          <TreeSelect
            showSearch
            placeholder="请选择"
            allowClear
            treeDefaultExpandAll
            treeData={treeDataSimpleMode}
            treeDataSimpleMode={true}
            treeNodeFilterProp="title"
          />
        </Form.Item>
        <ProFormText width="md" name="suppTypeName" label="供应商类别" />
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
