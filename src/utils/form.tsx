import ProForm, { ProFormCheckbox, ProFormRadio, ProFormSelect } from '@ant-design/pro-form';
import React from 'react';
import { Button, Divider, TreeSelect } from 'antd';
import { useModel } from 'umi';
import { PlusOutlined } from '@ant-design/icons';
import DepForm from '@/pages/Sys/dep/form';
import { useState } from 'react';
import { patternMsg } from './validator';
import type { NamePath } from 'antd/lib/form/interface';
import { useRequest } from 'umi';
import UserForm from '@/pages/Sys/user/form';
import { ProFormCheckboxProps } from '@ant-design/pro-form/lib/components/Checkbox';
import Checkbox from 'antd/lib/checkbox/Checkbox';

export const StateForm = (
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
);

export const DepSelect = (props: {
  name: NamePath;
  label: string;
  showNew: boolean;
  disabled?: boolean;
}) => {
  const { treeDataSimpleMode, queryDepTree } = useModel('dep', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
    queryDepTree: model.queryDepTree,
  }));
  const [modalVisit, setModalVisit] = useState(false);
  return (
    <>
      <ProForm.Item
        name={props.name}
        label={props.label}
        style={{ width: '328px' }}
        rules={patternMsg.select('')}
      >
        <TreeSelect
          showSearch
          placeholder="请选择"
          allowClear
          disabled={props.disabled}
          treeDefaultExpandAll
          treeData={treeDataSimpleMode}
          dropdownRender={(menu) => {
            return (
              <div>
                {menu}
                {props.showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setModalVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      新建部门
                    </Button>
                  </>
                )}
              </div>
            );
          }}
        />
      </ProForm.Item>
      <DepForm
        action="add"
        setVisible={setModalVisit}
        visible={modalVisit}
        refresh={queryDepTree}
      />
    </>
  );
};

type UserSelectProps = {
  name: string;
  label: string;
  disabled?: boolean;
  formRef?: any;
  showNew?: boolean;
};
export const UserSelect = ({ name, label, disabled, showNew }: UserSelectProps) => {
  const { options, queryUsers } = useModel('user', (model) => ({
    options: model.options,
    queryUsers: model.query,
  }));
  const [modalVisit, setModalVisit] = useState(false);

  return (
    <>
      <ProFormSelect
        width="md"
        showSearch
        fieldProps={{
          optionFilterProp: 'label',
          dropdownRender: (menu) => {
            return (
              <div>
                {menu}
                {showNew && (
                  <>
                    <Divider style={{ margin: '4px 0' }} />
                    <Button
                      type="text"
                      block
                      onClick={() => {
                        setModalVisit(true);
                      }}
                    >
                      <PlusOutlined />
                      新建职员
                    </Button>
                  </>
                )}
              </div>
            );
          },
        }}
        disabled={disabled}
        name={name}
        label={label}
        options={options}
      />
      <UserForm action="add" setVisible={setModalVisit} visible={modalVisit} refresh={queryUsers} />
    </>
  );
};

export const AccountSelect = ({ name, label, disabled }: UserSelectProps) => {
  const { accountEnum, defaultValue } = useModel('account', (model) => ({
    accountEnum: model.valueEnum,
    defaultValue: model.defaultValue,
  }));
  return (
    <ProFormSelect
      width="md"
      showSearch
      fieldProps={{
        optionFilterProp: 'label',
      }}
      initialValue={defaultValue}
      disabled={disabled}
      name={name}
      rules={patternMsg.select('')}
      label={label}
      valueEnum={accountEnum}
    />
  );
};

export const ProductTypeTreeSelect: React.FC<{
  value?: React.Key;
  onChange?: (value: React.Key) => void;
}> = ({ value, onChange }) => {
  const { treeDataSimpleMode } = useModel('productType', (model) => ({
    treeDataSimpleMode: model.treeDataSimpleMode,
  }));
  const [v, sv] = useState(value);
  return (
    <TreeSelect
      showSearch
      value={v}
      onChange={(e) => {
        sv(e);
        onChange?.(e);
      }}
      allowClear
      treeDefaultExpandAll
      treeData={treeDataSimpleMode}
    />
  );
};

export const ProFormCheckBoxZeroAndOne: React.FC<{
  value?: number;
  onChange?: (value: number) => void;
}> = ({ value, onChange }) => {
  return (
    <Checkbox
      onChange={(e) => {
        onChange?.(e.target.checked ? 1 : 0);
      }}
      checked={value === 1}
    />
  );
};
