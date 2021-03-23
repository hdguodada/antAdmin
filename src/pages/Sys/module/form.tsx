import {
  ProFormText,
  ProFormGroup,
  ProFormSelect,
  ProFormSlider,
  ProFormCheckbox,
  ProFormRadio,
  ModalForm,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { message, Modal } from 'antd';
import React, { useRef } from 'react';
import { queryFuns, updModule } from '@/services/Sys';
import type { ActionType } from '@ant-design/pro-table';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: API.Module | Record<string, unknown>;
  moduleOptions: SelectOptions;
};
const ModuleForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues, moduleOptions } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<API.Module>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建模块' : `修改模块(${initialValues.modName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updModule({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          // await (values);
          Modal.confirm({
            content: '新增部门成功,是否继续添加?',
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
      {initialValues.pModId !== 0 && (
        <ProFormGroup>
          <ProFormSelect width="md" name="pModId" label="上级模块" options={moduleOptions} />
        </ProFormGroup>
      )}
      <ProFormGroup>
        <ProFormText width="md" name="modName" label="模块名称" />
        <ProFormText width="md" name="memo" label="模块说明" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText width="md" name="url" label="模块地址" />
        <ProFormText width="md" name="path" label="路径" />
        {initialValues.pModId !== 0 && <ProFormText width="md" name="Component" label="组件" />}
      </ProFormGroup>
      <ProFormGroup>
        <ProFormText width="md" name="icon" label="图标" />
        <ProFormText width="md" name="cNName" label="模块中文名称" />
        <ProFormText width="md" name="cNIcon" label="模块中文Icon" />
        <ProFormSlider width="md" name="sortNum" label="顺序号" />
      </ProFormGroup>
      <ProFormGroup>
        <ProFormRadio.Group
          width="md"
          name="ver1"
          label="试用版"
          options={[
            { label: '启用', value: 1 },
            { label: '关闭', value: 0 },
          ]}
        />
        <ProFormRadio.Group
          width="md"
          name="ver2"
          label="标准版"
          options={[
            { label: '启用', value: 1 },
            { label: '关闭', value: 0 },
          ]}
        />
        <ProFormRadio.Group
          width="md"
          name="ver3"
          label="增强版"
          options={[
            { label: '启用', value: 1 },
            { label: '关闭', value: 0 },
          ]}
        />
        <ProFormRadio.Group
          width="md"
          name="state"
          label="状态"
          options={[
            { label: '启用', value: 1 },
            { label: '关闭', value: 0 },
          ]}
        />
      </ProFormGroup>
      <ProFormCheckbox.Group
        name="funs"
        label="操作"
        layout="horizontal"
        options={[]}
        request={async () => {
          return (await queryFuns({ pageNumber: -1 })).data.rows.map((fun) => ({
            label: fun.funName,
            value: fun.funId,
          }));
        }}
      />
    </ModalForm>
  );
};

export default ModuleForm;
