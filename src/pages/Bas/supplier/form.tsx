import {
  ProFormText,
  ProFormGroup,
  ProFormRadio,
  ModalForm,
  ProFormSelect,
} from '@ant-design/pro-form';
import { Divider, FormInstance, TreeSelect, Button } from 'antd';
import { message, Modal, Form, Cascader } from 'antd';
import React, { useRef, useEffect, useState } from 'react';
import type { ActionType } from '@ant-design/pro-table';
import { addSupplier, updSupplier } from '@/services/Bas';
import { useModel } from '@@/plugin-model/useModel';
import { queryUsers } from '@/services/Sys';
import { PlusOutlined } from '@ant-design/icons';
import SuppTypeForm from '../suppType/form';

type FormProps = {
  action: 'add' | 'upd';
  actionRef?: React.MutableRefObject<ActionType | undefined>;
  visible: boolean;
  setVisible: (visible: boolean) => void;
  initialValues: BAS.Supplier | Record<string, unknown>;
};
export default (props: FormProps) => {
  const { action, actionRef, visible, setVisible, initialValues } = props;
  const formRef = useRef<FormInstance>();
  const [modalVisit, setModalVisit] = useState(false);
  const [modalFormInit, setModalFormInit] = useState<Partial<BAS.CustType>>({});
  const [formAction, setFormAction] = useState<'upd' | 'add'>('upd');
  const { treeDataSimpleMode, query } = useModel('suppType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    query: model.query,
  }));
  const { RegionTree } = useModel('@@initialState', (model) => ({
    RegionTree: model?.initialState?.globalData?.RegionTree,
  }));
  useEffect(() => {
    query({ pageNumber: -1 });
  }, [query]);
  return (
    <>
      <SuppTypeForm
        action={formAction}
        visible={modalVisit}
        actionRef={actionRef}
        setVisible={setModalVisit}
        initialValues={modalFormInit}
        addCb={() => {
          formRef?.current?.setFieldsValue({});
        }}
      />
      <ModalForm<BAS.Supplier>
        initialValues={{
          state: 1,
        }}
        formRef={formRef}
        title={
          action === 'add' ? '新建供应商分类' : `修改供应商分类(${initialValues.suppTypeName})`
        }
        visible={visible}
        submitter={{
          searchConfig: {
            submitText: '确认',
            resetText: '关闭',
          },
        }}
        onFinish={async (values) => {
          if (action === 'upd') {
            await updSupplier({
              ...initialValues,
              ...values,
              regioncd: values.regioncdMid.join('-'),
            });
            message.success('提交成功');
          } else {
            await addSupplier(values);
            Modal.confirm({
              content: '新增客户分类成功,是否继续添加?',
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
        <ProFormGroup>
          <ProFormText width="md" name="suppCd" label="供应商编号" />
          <ProFormText width="md" name="suppName" label="供应商名称" />
          <Form.Item label="供应商类别" name="suppTypeId" style={{ width: '328px' }}>
            <TreeSelect
              showSearch
              placeholder="请选择"
              allowClear
              treeDefaultExpandAll
              treeData={treeDataSimpleMode}
              treeDataSimpleMode={true}
              treeNodeFilterProp="title"
              dropdownRender={(menu) => (
                <div>
                  {menu}
                  <Divider style={{ margin: '4px 0' }} />
                  <Button
                    style={{ margin: '4px 0' }}
                    type="ghost"
                    block
                    onClick={() => {
                      setFormAction('add');
                      setModalFormInit({});
                      setModalVisit(true);
                    }}
                  >
                    <PlusOutlined />
                    新建供应商
                  </Button>
                </div>
              )}
            />
          </Form.Item>
          <Form.Item label="所在地" name="regioncdMid" style={{ width: '328px' }}>
            <Cascader
              options={RegionTree}
              onChange={() => {}}
              fieldNames={{ value: 'id', label: 'label', children: 'children' }}
            />
          </Form.Item>

          <ProFormText width="lg" name="address" label="详细地址" />
          <ProFormSelect
            width="md"
            name="buyerId"
            label="采购员"
            request={async () => {
              return (await queryUsers({ pageNumber: -1 })).data.rows.map((item) => ({
                label: item.realName,
                value: item.userId,
              }));
            }}
          />
        </ProFormGroup>
        <ProFormGroup>
          <ProFormRadio.Group
            width="md"
            name="checkStatus"
            label="审核状态"
            options={[
              {
                label: '未审核',
                value: 0,
              },
              {
                label: '审核通过',
                value: 1,
              },
              {
                label: '审核未通过',
                value: 2,
              },
            ]}
          />
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
        </ProFormGroup>
      </ModalForm>
    </>
  );
};
