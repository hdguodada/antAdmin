import {
  ProFormText,
  ProFormGroup,
  ProFormRadio,
  ModalForm,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Upload } from 'antd';
import { message, Form } from 'antd';
import React, { useRef, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addBrand, updBrand } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.Brand | Record<string, unknown>;
  addCb?: () => void;
};
export default (props: FormProps) => {
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
      title={action === 'add' ? '新建产品分类' : `修改产品分类(${initialValues.brandName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updBrand({
            ...initialValues,
            ...values,
            logo: values.logoMid[0].response.data.path,
          });
          message.success('提交成功');
        } else {
          await addBrand({
            ...values,
            logo: values.logoMid[0].response.data.path,
          });
        }
        query({ pageNumber: -1 });
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          const logoMid = initialValues.logo
            ? [
                {
                  url: BASE_URL + initialValues.logo,
                },
              ]
            : [];
          formRef.current?.setFieldsValue({
            ...initialValues,
            logoMid,
          });
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <ProFormGroup>
        <ProFormText width="md" name="brandName" label="品牌名称" />
        <ProFormText width="md" name="letter" label="letter" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormUploadDragger
          width="lg"
          label="Logo"
          name="logoMid"
          action={`${BASE_URL}/sys/upload/upload?type=logo`}
          description=""
          max={1}
          fieldProps={{
            listType: 'picture',
          }}
        />
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
