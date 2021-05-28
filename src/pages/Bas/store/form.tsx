import ProForm, { ProFormText, ModalForm } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import { addStore, updStore } from '@/services/Bas';
import { useModel } from 'umi';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';
import { useEffect } from 'react';
import { getCode } from '@/services/Sys';

const { confirm } = Modal;
const StoreForm: React.FC<FormProps<BAS.Store>> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const { query } = useModel('store', (model) => ({
    query: model.query,
  }));
  const formRef = useRef<FormInstance>();
  useEffect(() => {
    if (action === 'add') {
      getCode('BasStore').then((res) => {
        formRef.current?.setFieldsValue({
          storeCd: res.data,
        });
      });
    }
  }, [action]);
  return (
    <ModalForm<BAS.Store>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建仓库' : `修改仓库(${initialValues?.storeName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updStore({ ...initialValues, ...values });
        } else {
          await addStore(values);
          confirm({
            content: '新增仓库成功,是否继续添加?',
            onCancel() {
              setVisible?.(false);
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
        setVisible?.(v);
      }}
    >
      <ProForm.Group>
        <ProFormText
          width="md"
          name={'storeCd'}
          label={'仓库编号'}
          disabled={action === 'upd'}
          rules={patternMsg.text('仓库编号')}
        />
        <ProFormText
          width="md"
          name="storeName"
          label="仓库名称"
          rules={patternMsg.text('仓库名称')}
        />
        <ProFormText width="md" name="linkman" label="联系人" />
        <ProFormText width="md" name="tel" label="座机" />
        <ProFormText width="md" name="mobile" label="手机" />
        <ProFormText width="lg" name="address" label="地址" />
      </ProForm.Group>
      {StateForm}
    </ModalForm>
  );
};

export default StoreForm;
