import {
  ProFormText,
  ProFormGroup,
  ModalForm,
  ProFormSelect,
  ProFormUploadDragger,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Button, message } from 'antd';
import React, { useRef } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addCustDoc } from '@/services/Bas';
import { useModel } from 'umi';

type FormProps = {
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  initialValues: BAS.Customer | Record<string, unknown>;
};
export default (props: FormProps) => {
  const { actionRef, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const { typeOption } = useModel('options', (model) => ({ typeOption: model.typeOption }));
  return (
    <ModalForm<BAS.CustDoc>
      initialValues={{
        custId: initialValues.custId,
      }}
      trigger={
        <Button key="newRecord" type="primary">
          上传附件
        </Button>
      }
      title={<div>新建客户附件({initialValues.custName})</div>}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      formRef={formRef}
      onFinish={async (values) => {
        await addCustDoc(values);
        message.success('保存成功');
        actionRef?.current?.reload();
        return true;
      }}
    >
      <ProFormText width="md" name="custId" label="客户" disabled hidden />
      <ProFormText width="md" name="docName" label="文件名称" disabled hidden />
      <ProFormText width="md" name="docPath" label="文件路径" disabled hidden />
      <ProFormGroup>
        <ProFormSelect
          width="md"
          name="docTypeId"
          label="文件类别"
          options={typeOption('CustDocType')}
        />
      </ProFormGroup>
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
