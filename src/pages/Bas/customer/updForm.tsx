import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import { Button } from 'antd';
import { EditFilled, PlusOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import React from 'react';
import { updCustomers } from '@/services/Bas';
import { queryUsers } from '@/services/Sys';
import { patternMsg } from '@/utils/validator';
import { useRef } from 'react';
import { DepSelect, StateForm } from '@/utils/form';

export default ({ initialValues, refresh }: FormProps<BAS.Customer>) => {
  const formRef = useRef<FormInstance>();
  const { treeDataSimpleMode } = useModel('custType');
  const { areaTree } = useModel('custArea', (model) => ({ areaTree: model.treeDataSimpleMode }));
  const { levelOptions } = useModel('custLevel');
  const { typeOption } = useModel('options', (module) => ({ typeOption: module.typeOption }));
  return (
    <>
      <ModalForm<BAS.Customer>
        onFinish={async (values) => {
          await updCustomers({
            ...initialValues,
            ...values,
          });
          refresh?.();
          return true;
        }}
        formRef={formRef}
        initialValues={initialValues}
        title={initialValues?.custName}
        trigger={
          <Button type="primary">
            <EditFilled />
            编辑
          </Button>
        }
        onVisibleChange={(v) => {
          if (v) {
            formRef.current?.setFieldsValue(initialValues);
          } else {
            formRef.current?.resetFields();
          }
        }}
      >
        <ProForm.Group title="公司信息">
          <ProFormText
            labelCol={{ flex: 0 }}
            name="custName"
            label="公司"
            tooltip="最长为 24 位"
            placeholder="公司名称"
            width="lg"
            rules={patternMsg.text('')}
          />
          <ProFormText name="custShort" label="简称" width="sm" />
          <Form.Item
            name="custTypeId"
            label="客户类别"
            style={{ width: '440px' }}
            rules={patternMsg.select('')}
          >
            <TreeSelect
              showSearch
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={treeDataSimpleMode}
              treeDataSimpleMode={true}
              treeNodeFilterProp="title"
            />
          </Form.Item>
          <ProFormText width="sm" name="custCd" label="编号" rules={patternMsg.text('')} />
          <ProFormSelect
            width="md"
            name="custLevelId"
            label="客户等级"
            rules={patternMsg.select('')}
            options={levelOptions}
            tooltip="数据字典"
            fieldProps={{
              dropdownRender: (menu) => (
                <>
                  {menu}
                  <Button
                    type="dashed"
                    block
                    onClick={() => {
                      history.push('/init/dictDef');
                    }}
                  >
                    <PlusOutlined />
                    新建字典
                  </Button>
                </>
              ),
            }}
          />

          <ProFormSelect
            width="md"
            label="客户来源"
            name="SourceId"
            options={typeOption('CustSource')}
            tooltip="数据字典"
            fieldProps={{
              dropdownRender: (menu) => (
                <>
                  {menu}
                  <Button
                    type="dashed"
                    block
                    onClick={() => {
                      history.push('/init/dictDef');
                    }}
                  >
                    <PlusOutlined />
                    新建字典
                  </Button>
                </>
              ),
            }}
          />
          <ProFormSelect
            showSearch
            fieldProps={{
              optionFilterProp: 'label',
            }}
            width="md"
            name={'salesmanId'}
            label={'营销员'}
            rules={patternMsg.select('')}
            request={async () => {
              return (await queryUsers({ pageNumber: -1 })).data.rows.map((item) => ({
                label: item.realName,
                value: item.userId,
              }));
            }}
          />
          <Form.Item
            name="custAreaId"
            label="所属区域"
            style={{ width: '328px' }}
            rules={patternMsg.select('')}
          >
            <TreeSelect
              showSearch
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={areaTree}
              treeDataSimpleMode={true}
              treeNodeFilterProp="title"
            />
          </Form.Item>
          <ProForm.Item name={'depId'} label={'所属部门'}>
            <DepSelect showNew />
          </ProForm.Item>
          {StateForm}
        </ProForm.Group>
      </ModalForm>
    </>
  );
};
