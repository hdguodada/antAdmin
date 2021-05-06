import ProForm, {
  ProFormText,
  ModalForm,
  ProFormSelect,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message } from 'antd';
import React, { useRef } from 'react';
import { addCustDoc, updCustDoc } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  action: 'add' | 'upd';
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues?: BAS.CustDoc;
  custRel?: BAS.Rel[];
  customer: BAS.Customer;
  refresh?: () => void;
};
export default (props: FormProps) => {
  const { initialValues, visible, setVisible, action, customer, refresh } = props;
  const formRef = useRef<FormInstance>();
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.typeOption }));
  return (
    <ModalForm<BAS.CustDoc>
      initialValues={{
        custId: customer.custId,
      }}
      visible={visible}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
      title={<div>新建客户附件({customer.custName})</div>}
      formRef={formRef}
      onFinish={async (values) => {
        if (action === 'add') {
          await addCustDoc({
            ...values,
            custId: customer.custId,
          });
        } else {
          await updCustDoc({
            ...initialValues,
            ...values,
          });
        }
        refresh?.();
        return true;
      }}
    >
      <ProFormText width="md" name="custId" label="客户" disabled hidden />
      <ProFormText width="md" name="docName" label="文件名称" disabled hidden />
      <ProFormText width="md" name="docPath" label="文件路径" disabled hidden />
      <ProForm.Group>
        <ProFormSelect
          width="md"
          name="docTypeId"
          label="文件类别"
          options={typeOption('CustDocType')}
        />
      </ProForm.Group>
      <ProFormUploadDragger
        fieldProps={{
          multiple: false,
          maxCount: 1,
        }}
        label="上传附件"
        name="dragger"
        action="https://erp.zjqsa.com/sys/upload/upload?type=file"
        onChange={({ file }) => {
          if (file.status === 'done') {
            message.success(`${file.name} 上传成功`);
            formRef?.current?.setFieldsValue({
              docName: file.response?.data.fileName,
              docPath: file.response?.data.path,
            });
          } else if (file.status === 'error') {
            message.error(`${file.name} file upload failed.`);
          }
        }}
      ></ProFormUploadDragger>
    </ModalForm>
  );
};
