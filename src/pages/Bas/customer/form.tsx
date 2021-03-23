import ProForm, { ModalForm, ProFormSelect, ProFormText } from '@ant-design/pro-form';
import type { FormInstance } from 'antd';
import { Form, TreeSelect } from 'antd';
import { Button } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import { history, useModel } from 'umi';
import React, { useRef } from 'react';
import { newCustomer } from '@/services/Bas';
import { getCode, queryUsers } from '@/services/Sys';

type CustomerFormProps = {
  onSubmit: () => void;
};
type FormI = BAS.CustRel & BAS.Customer;
const CustomerForm: React.FC<CustomerFormProps> = ({ onSubmit }) => {
  const ref = useRef<FormInstance<FormI>>();
  const { treeDataSimpleMode } = useModel('custType');
  const { areaTree } = useModel('custArea', (model) => ({ areaTree: model.treeDataSimpleMode }));
  const { depTree } = useModel('dep', (model) => ({ depTree: model.treeDataSimpleMode }));
  const { levelOptions } = useModel('custLevel');
  const { typeOption } = useModel('options', (module) => ({ typeOption: module.typeOption }));
  return (
    <>
      <ModalForm<FormI>
        onFinish={async (values) => {
          const basCustRelLists = [
            {
              relName: values.relName,
              relTel: values.relTel,
              relQq: values.relQq,
              relWeiXin: values.relWeiXin,
              relAli1: values.relAli1,
              isMain: 1,
            },
          ];
          const basCustomer = {
            custName: values.custName,
            custCd: values.custCd,
            custLevelId: values.custLevelId,
            custTypeId: values.custTypeId,
            depId: values.depId,
            custAreaId: values.custAreaId,
            salesmanId: values.salesmanId,
          };
          const form = {
            basCustRelLists,
            basCustomer,
          };
          await newCustomer(form as any);
          onSubmit();
          return true;
        }}
        title="新建客户"
        trigger={
          <Button type="primary">
            <PlusOutlined />
            新建客户
          </Button>
        }
        onVisibleChange={async (visible) => {
          if (visible) {
            ref?.current?.setFieldsValue({
              custCd: (await getCode('basCustomer')).data,
            });
          }
        }}
        onReset={() => {}}
        formRef={ref}
      >
        <ProForm.Group title="公司信息">
          <ProFormText
            labelCol={{ flex: 0 }}
            name="custName"
            label="公司"
            tooltip="最长为 24 位"
            placeholder="公司名称"
            width="lg"
          />
          <ProFormText name="custShort" label="简称" width="sm" />
          <Form.Item name="custTypeId" label="客户类别" style={{ width: '440px' }}>
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
          <ProFormText width="sm" name="custCd" label="编号" />
          <ProFormSelect
            width="md"
            name="custLevelId"
            label="客户等级"
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
            request={async () => {
              return (await queryUsers({ pageNumber: -1 })).data.rows.map((item) => ({
                label: item.realName,
                value: item.userId,
              }));
            }}
          />
          <Form.Item name="custAreaId" label="所属区域" style={{ width: '328px' }}>
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

          <Form.Item name="depId" label="所属部门" style={{ width: '328px' }}>
            <TreeSelect
              showSearch
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={depTree}
              treeDataSimpleMode={true}
              treeNodeFilterProp="title"
            />
          </Form.Item>
        </ProForm.Group>
        <ProForm.Group title="联系人信息">
          <ProFormText width="sm" label="姓名" name="relName" />
          <ProFormText width="sm" label="手机" name="relTel" />
          <ProFormText width="sm" label="微信" name="relWeiXin" />
          <ProFormText width="sm" label="QQ" name="relQq" />
          <ProFormText width="sm" label="阿里旺旺" name="relAli1" />
        </ProForm.Group>
      </ModalForm>
    </>
  );
};

export default CustomerForm;
