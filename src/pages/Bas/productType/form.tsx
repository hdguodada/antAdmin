import ProForm, { ProFormText, ProFormGroup, ModalForm, ProFormSlider } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Input, Select } from 'antd';
import { Form, TreeSelect } from 'antd';
import { message } from 'antd';
import React, { useRef, useState } from 'react';
import type { ActionType, ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { addProductType, updProductType } from '@/services/Bas';
import { useModel } from 'umi';
import { AttrValuesSelect } from '../product/detail';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.ProductType | undefined;
  addCb?: () => void;
};
export default (props: FormProps) => {
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();

  const [specListEditableKeys, setSpecListEditableKeys] = useState<React.Key[]>([]);
  const { attrListOptions, allAttrList } = useModel('attr', (model) => ({
    attrListOptions: model.options,
    allAttrList: model.list,
  }));
  const { queryTreeProductType, treeDataSimpleMode } = useModel('productType', (model) => ({
    queryProductType: model.query,
    queryTreeProductType: model.query,
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const specColumns: ProColumns<BAS.Attr>[] = [
    {
      dataIndex: 'attrId',
      title: '规格',
      renderFormItem: () => <Select options={attrListOptions} />,
      width: 200,
    },
    {
      dataIndex: 'attrValues',
      title: '规格值',
      width: 500,
      renderFormItem: (_row, { record }) => {
        return record?.attrId ? (
          <AttrValuesSelect
            options={
              allAttrList?.find((i) => {
                return i.attrId === record.attrId;
              })?.attrValues
            }
          />
        ) : (
          <Input />
        );
      },
    },
  ];

  return (
    <ModalForm<BAS.ProductType>
      initialValues={{
        state: 1,
      }}
      formRef={formRef}
      title={action === 'add' ? '新建产品分类' : `修改产品分类(${initialValues?.cateName})`}
      visible={visible}
      submitter={{
        searchConfig: {
          submitText: '确认',
          resetText: '关闭',
        },
      }}
      onFinish={async (values) => {
        if (action === 'upd') {
          await updProductType({ ...initialValues, ...values });
          message.success('提交成功');
        } else {
          await addProductType(values);
        }
        queryTreeProductType({ pageNumber: -1 });
        return true;
      }}
      onVisibleChange={(v) => {
        if (v) {
          formRef.current?.setFieldsValue(initialValues);
          setSpecListEditableKeys(() => {
            return initialValues ? initialValues.attrList.map((i) => i.autoId) : [];
          });
        } else {
          formRef.current?.resetFields();
        }
        setVisible(v);
      }}
    >
      <Form.Item label="上级类别" name="pcateId" style={{ width: '328px' }}>
        <TreeSelect
          showSearch
          placeholder="请选择"
          allowClear
          treeDefaultExpandAll
          treeData={treeDataSimpleMode}
          treeNodeFilterProp="title"
        />
      </Form.Item>
      <ProFormGroup>
        <ProFormText width="md" name="cateName" label="分类名称" />
        <ProFormText width="md" name="iconUrl" label="图标" />
        <ProFormSlider min={1} max={100} width="md" name="sortNum" label="排序" initialValue={1} />
      </ProFormGroup>
      <ProFormGroup>
        <ProForm.Item name="attrList" label="属性" trigger="onValuesChange">
          <EditableProTable
            bordered
            rowKey="autoId"
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({
                attrId: Date.now(),
                attrName: '',
                attrValues: [],
                autoId: Date.now(),
              }),
            }}
            columns={specColumns}
            editable={{
              type: 'multiple',
              editableKeys: specListEditableKeys,
              onChange: setSpecListEditableKeys,
            }}
          />
        </ProForm.Item>
      </ProFormGroup>
    </ModalForm>
  );
};
