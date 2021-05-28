import ProForm, { ProFormText, ModalForm, ProFormSlider } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Input, Select } from 'antd';
import { Form } from 'antd';
import React, { useRef, useState } from 'react';
import type { ProColumns } from '@ant-design/pro-table';
import { EditableProTable } from '@ant-design/pro-table';
import { addProductType, updProductType } from '@/services/Bas';
import { useModel } from 'umi';
import { AttrValuesSelect } from '../product/detail';
import { patternMsg } from '@/utils/validator';
import { ProductTypeTreeSelect } from '@/utils/form';

export default function ProductTypeForm(props: FormProps<BAS.ProductType>) {
  const { action, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const [specListEditableKeys, setSpecListEditableKeys] = useState<React.Key[]>([]);
  const { attrListOptions, allAttrList } = useModel('attr', (model) => ({
    attrListOptions: model.options,
    allAttrList: model.list,
  }));
  const { queryTreeProductType } = useModel('productType', (model) => ({
    queryProductType: model.query,
    queryTreeProductType: model.query,
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
      onFinish={async (values) => {
        if (action === 'upd') {
          await updProductType({ ...initialValues, ...values });
        } else {
          await addProductType(values);
        }
        queryTreeProductType();
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
        setVisible?.(v);
      }}
    >
      <Form.Item
        label="上级类别"
        name="pcateId"
        style={{ width: '328px' }}
        rules={patternMsg.select('上级类别')}
      >
        <ProductTypeTreeSelect />
      </Form.Item>
      <ProForm.Group>
        <ProFormText
          width="md"
          name="cateName"
          label="分类名称"
          rules={patternMsg.text('分类名称')}
        />
        <ProFormText width="md" name="iconUrl" label="图标" />
        <ProFormSlider min={1} max={100} width="md" name="sortNum" label="排序" initialValue={1} />
      </ProForm.Group>
      <ProForm.Group>
        <ProForm.Item name="attrList" label="属性" trigger="onValuesChange">
          <EditableProTable
            rowKey="autoId"
            bordered
            recordCreatorProps={{
              newRecordType: 'dataSource',
              record: () => ({
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
      </ProForm.Group>
    </ModalForm>
  );
}
