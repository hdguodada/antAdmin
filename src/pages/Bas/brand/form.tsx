import ProForm, { ProFormText, ModalForm, ProFormUploadDragger } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import React, { useRef } from 'react';
import { addBrand, updBrand } from '@/services/Bas';
import { StateForm } from '@/utils/form';
import { patternMsg } from '@/utils/validator';
import { useModel } from 'umi';

export default function BrandForm(props: FormProps<BAS.Brand>) {
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { query } = useModel('brand', (model) => ({
    query: model.query,
  }));
  return (
    <ModalForm<BAS.Brand>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建商品品牌' : `修改商品品牌(${initialValues?.brandName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updBrand({
            ...initialValues,
            ...values,
          });
        } else {
          await addBrand(values);
        }
        await query();
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
          name="brandName"
          label="品牌名称"
          rules={patternMsg.text('品牌名称')}
        />
        <ProFormText width="md" name="letter" label="letter" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormUploadDragger
          width="lg"
          label="Logo"
          name="logoMid"
          action={`${BASE_URL}/sys/upload/upload?type=logo`}
          description=""
          max={1}
          fieldProps={{
            listType: 'picture',
            onChange: (info) => {
              if (info.file.status === 'done') {
                formRef.current?.setFieldsValue({
                  logo: info.file.response.data.path,
                  logoMid: info.fileList,
                });
              } else if (info.file.status === 'removed') {
                formRef.current?.setFieldsValue({
                  logo: '',
                  logoMid: [],
                });
              }
            },
          }}
        />
        <ProFormText label={'logo'} name={'logo'} hidden />
      </ProForm.Group>

      {StateForm}
    </ModalForm>
  );
}
