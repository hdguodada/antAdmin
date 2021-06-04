import ProForm, {
  ProFormText,
  ProFormSlider,
  ProFormCheckbox,
  ProFormRadio,
  ModalForm,
} from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { TreeSelect } from 'antd';
import { Modal } from 'antd';
import React, { useRef } from 'react';
import { addModule, queryFuns, updModule } from '@/services/Sys';
import type { ActionType } from '@ant-design/pro-table';
import { patternMsg } from '@/utils/validator';

const { confirm } = Modal;

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: SYS.Module | Record<string, unknown>;
  moduleOptions: SelectOptions;
};
const ModuleForm: React.FC<FormProps> = (props) => {
  const { action, actionRef, visible, setVisible, initialValues, moduleOptions } = props;
  const formRef = useRef<FormInstance>();
  return (
    <ModalForm<SYS.Module>
      initialValues={{
        state: 1,
        ver1: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建模块' : `修改模块(${initialValues.modName})`}
      visible={visible}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updModule({ ...initialValues, ...values });
          actionRef?.current?.reload();
        } else {
          await addModule(values);
          confirm({
            content: '新增模块成功,是否继续添加?',
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
        <ProForm.Group>
          <ProForm.Item name="pModId" label="上级模块" style={{ width: '500px' }}>
            <TreeSelect
              showSearch
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={moduleOptions}
            />
          </ProForm.Item>
        </ProForm.Group>
      )}
      <ProForm.Group>
        <ProFormText
          width="md"
          name="modName"
          label="模块名称"
          rules={patternMsg.text('模块名称')}
        />
        <ProFormText width="md" name="memo" label="中文名称" rules={patternMsg.text('中文名称')} />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="path" label="路径" />
        <ProFormText width="md" name="url" label="模块地址" />
      </ProForm.Group>
      <ProForm.Group>
        <ProFormText width="md" name="icon" label="图标" />
        <ProFormText width="md" name="cNName" label="模块中文名称" />
        <ProFormText width="md" name="cNIcon" label="模块中文Icon" />
        <ProFormSlider width="md" name="sortNum" label="顺序号" />
      </ProForm.Group>
      <ProForm.Group>
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
      </ProForm.Group>
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
