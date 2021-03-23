import { ProFormText, ProFormGroup, ProFormRadio, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addStore, updStore } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.CustType | Record<string, unknown>;
};
const DepForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const { query } = useModel('store', (model) => ({
    query: model.query,
  }));
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<BAS.Store>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建客户分类' : `修改客户分类(${initialValues.custTypeName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updStore({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addStore(values);
          Modal.confirm({
            content: '新增仓库成功,是否继续添加?',
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
        query({ pageNumber: -1 });
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
        <ProFormText width="md" name="storeName" label="仓库名称" />
        <ProFormText width="md" name="linkman" label="联系人" />
        <ProFormText width="md" name="tel" label="座机" />
        <ProFormText width="md" name="mobile" label="手机" />
        <ProFormText width="lg" name="address" label="地址" />
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

export default DepForm;
